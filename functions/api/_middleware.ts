// Cloudflare Pages Functions Middleware (v1.13)
// Cryptographic RS256 Cloudflare Access JWT verification with JWKS public keys
// Enforces strict Zero Trust authentication for all /api/admin/* endpoints
// Rejects unauthorized access, forged headers, invalid signatures, or expired assertions

export interface Env {
  DB?: any;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  CF_ACCESS_CERTS_URL?: string;
  CF_ACCESS_JWKS?: string;
}

export const AUTHORIZED_ADMIN_EMAILS = ['pomellius@gmail.com'];
export const DEFAULT_TEAM_DOMAIN = 'pomellius.cloudflareaccess.com';

export interface CloudflareAccessClaims {
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  type?: string;
  identity_nonce?: string;
  [key: string]: any;
}

export interface JWKKey {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  e: string;
  n: string;
}

export interface AuthResult {
  authorized: boolean;
  email?: string;
  claims?: CloudflareAccessClaims;
  error?: string;
  status?: number;
}

// In-memory cache for fetched JWKS keys across Worker invocations
let cachedJwks: { keys: JWKKey[]; fetchedAt: number } | null = null;
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function setJwksCacheForTesting(keys: JWKKey[] | null) {
  if (keys) {
    cachedJwks = { keys, fetchedAt: Date.now() };
  } else {
    cachedJwks = null;
  }
}

export function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function base64UrlDecodeJson<T = any>(base64Url: string): T | null {
  try {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// Fetch official Cloudflare Access JWKS public certificates
export async function getCloudflareAccessJwks(env?: Env, forceRefresh = false): Promise<JWKKey[]> {
  const now = Date.now();
  if (!forceRefresh && cachedJwks && now - cachedJwks.fetchedAt < JWKS_CACHE_TTL_MS) {
    return cachedJwks.keys;
  }

  // Allow static JWKS injection via env var for isolated tests/environments
  if (env?.CF_ACCESS_JWKS) {
    try {
      const parsed = JSON.parse(env.CF_ACCESS_JWKS);
      const keys = Array.isArray(parsed) ? parsed : (parsed.keys || []);
      if (keys.length > 0) {
        cachedJwks = { keys, fetchedAt: now };
        return keys;
      }
    } catch {
      // Fall through to network fetch
    }
  }

  const teamDomain = (env?.CF_ACCESS_TEAM_DOMAIN || DEFAULT_TEAM_DOMAIN)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  const certsUrl = env?.CF_ACCESS_CERTS_URL || `https://${teamDomain}/cdn-cgi/access/certs`;

  try {
    const res = await fetch(certsUrl, {
      headers: { Accept: 'application/json' },
      ...({ cf: { cacheTtl: 3600 } } as Record<string, unknown>)
    } as RequestInit);

    if (!res.ok) {
      throw new Error(`Cloudflare Access JWKS fetch failed with HTTP ${res.status}`);
    }

    const data: any = await res.json();
    const keys: JWKKey[] = data?.keys || [];
    cachedJwks = { keys, fetchedAt: now };
    return keys;
  } catch (err: any) {
    // If refresh fails but we have stale cache, return it
    if (cachedJwks && cachedJwks.keys.length > 0) {
      return cachedJwks.keys;
    }
    throw new Error(`Neizdevās iegūt Cloudflare Access JWKS sertifikātus: ${err.message}`);
  }
}

// Cryptographically verifies Cloudflare Access RS256 JWT using Web Crypto API
export async function verifyCloudflareAccessJwt(
  jwt: string,
  env?: Env
): Promise<{ verified: boolean; claims?: CloudflareAccessClaims; error?: string; status?: number }> {
  const parts = jwt.split('.');
  if (parts.length !== 3) {
    return { verified: false, status: 401, error: 'Nekorekts Cloudflare Access JWT formāts (nepieciešamas 3 daļas).' };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Parse and validate header
  const header = base64UrlDecodeJson<{ alg?: string; kid?: string; typ?: string }>(headerB64);
  if (!header) {
    return { verified: false, status: 401, error: 'Nevar nolasīt JWT galveni (header).' };
  }

  if (header.alg !== 'RS256') {
    return { verified: false, status: 401, error: `Neatbalstīts JWT algoritms: "${header.alg}". Nepieciešams RS256.` };
  }

  if (!header.kid || typeof header.kid !== 'string') {
    return { verified: false, status: 401, error: 'JWT galvenē trūkst "kid" atslēgas identifikatora.' };
  }

  // 2. Locate matching RSA public key in Cloudflare Access JWKS
  let keys = await getCloudflareAccessJwks(env);
  let matchingKey = keys.find(k => k.kid === header.kid && (k.kty === 'RSA' || !k.kty));

  if (!matchingKey) {
    // Try forcing refresh once in case key was just rotated by Cloudflare
    try {
      keys = await getCloudflareAccessJwks(env, true);
      matchingKey = keys.find(k => k.kid === header.kid);
    } catch {
      // Ignore refresh error and evaluate match
    }
  }

  if (!matchingKey) {
    return {
      verified: false,
      status: 401,
      error: `Cloudflare Access JWKS nesatur publisko atslēgu ar kid "${header.kid}".`
    };
  }

  // 3. Import public key into Web Crypto
  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      'jwk',
      {
        kty: matchingKey.kty || 'RSA',
        e: matchingKey.e,
        n: matchingKey.n,
        alg: 'RS256',
        ext: true
      },
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' }
      },
      false,
      ['verify']
    );
  } catch (e: any) {
    return {
      verified: false,
      status: 401,
      error: `Kļūda importējot publisko atslēgu: ${e.message}`
    };
  }

  // 4. Verify cryptographic signature using Web Crypto
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBuffer = base64UrlToUint8Array(signatureB64);

    const isSignatureValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signatureBuffer,
      dataBuffer
    );

    if (!isSignatureValid) {
      return {
        verified: false,
        status: 401,
        error: 'Kriptogrāfiskais Cloudflare Access JWT paraksts ir nederīgs.'
      };
    }
  } catch (e: any) {
    return {
      verified: false,
      status: 401,
      error: `Kriptogrāfiskās pārbaudes kļūda: ${e.message}`
    };
  }

  // 5. Parse and validate claims
  const claims = base64UrlDecodeJson<CloudflareAccessClaims>(payloadB64);
  if (!claims) {
    return { verified: false, status: 401, error: 'Nekorekts JWT saturs (payload).' };
  }

  const now = Math.floor(Date.now() / 1000);
  const clockSkew = 60; // 60s allowable clock skew

  if (claims.exp && claims.exp < now - clockSkew) {
    return {
      verified: false,
      status: 401,
      error: 'Cloudflare Access sesijas termiņš ir beidzies (exp).'
    };
  }

  if (claims.iat && claims.iat > now + 300) {
    return {
      verified: false,
      status: 401,
      error: 'JWT izdošanas laiks ir nākotnē (iat).'
    };
  }

  // 6. Validate Issuer
  const configuredTeamDomain = (env?.CF_ACCESS_TEAM_DOMAIN || DEFAULT_TEAM_DOMAIN)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .toLowerCase();

  if (claims.iss) {
    const issClean = claims.iss.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    if (issClean !== configuredTeamDomain && !issClean.endsWith(`.${configuredTeamDomain}`) && !issClean.includes(configuredTeamDomain)) {
      return {
        verified: false,
        status: 403,
        error: `Cloudflare Access issuer (${claims.iss}) neatbilst konfigurācijai (${configuredTeamDomain}).`
      };
    }
  } else {
    return {
      verified: false,
      status: 403,
      error: 'JWT nesatur obligāto "iss" lauku.'
    };
  }

  // 7. Validate AUD tag
  if (env?.CF_ACCESS_AUD) {
    const audList = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!claims.aud || !audList.includes(env.CF_ACCESS_AUD)) {
      return {
        verified: false,
        status: 403,
        error: 'Cloudflare Access AUD tag neatbilst lietotnei.'
      };
    }
  }

  return { verified: true, claims };
}

// Helper to extract CF_Authorization cookie if present
export function extractCookieToken(cookieHeader: string | null, name = 'CF_Authorization'): string | null {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    if (key === name) {
      const val = pair.slice(idx + 1).trim();
      return val ? decodeURIComponent(val) : null;
    }
  }
  return null;
}

// Master Request Validator
// STRICT RULE: Never authorize by header alone.
// Must have cryptographically verified JWT, and email extracted from verified claims.
export async function validateCloudflareAccessRequest(
  request: Request,
  env?: Env
): Promise<AuthResult> {
  const jwt =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    request.headers.get('cf-access-jwt-assertion') ||
    (request.headers.get('Authorization')?.startsWith('Bearer ')
      ? request.headers.get('Authorization')!.replace(/^Bearer\s+/i, '').trim()
      : null) ||
    extractCookieToken(request.headers.get('Cookie') || request.headers.get('cookie'));

  const cfUserEmailHeader = request.headers.get('Cf-Access-Authenticated-User-Email');

  // If NO JWT is present at all, REJECT IMMEDIATELY.
  // Even if Cf-Access-Authenticated-User-Email is present, header alone is NOT trusted!
  if (!jwt) {
    return {
      authorized: false,
      status: 401,
      error: 'Piekļuve liegta: Nav atrasts Cloudflare Access JWT sertifikāts. Galvene viena pati netiek pieņemta bez kriptogrāfiska paraksta.'
    };
  }

  // Perform cryptographic verification with Cloudflare Access JWKS
  let verifyResult: { verified: boolean; claims?: CloudflareAccessClaims; error?: string; status?: number };
  try {
    verifyResult = await verifyCloudflareAccessJwt(jwt, env);
  } catch (err: any) {
    return {
      authorized: false,
      status: 500,
      error: `Autentifikācijas servisa kļūda: ${err.message}`
    };
  }

  if (!verifyResult.verified || !verifyResult.claims) {
    return {
      authorized: false,
      status: verifyResult.status || 401,
      error: verifyResult.error || 'Neizdevās pārbaudīt Cloudflare Access JWT sertifikātu.'
    };
  }

  const verifiedClaims = verifyResult.claims;

  // Extract email strictly from the verified JWT payload
  const email = verifiedClaims.email?.trim().toLowerCase();
  if (!email) {
    return {
      authorized: false,
      status: 401,
      error: 'Pārbaudītais Cloudflare Access JWT nesatur lietotāja e-pasta adresi.'
    };
  }

  // Cross-check with header if header is present
  if (cfUserEmailHeader) {
    const headerEmail = cfUserEmailHeader.trim().toLowerCase();
    if (headerEmail !== email) {
      return {
        authorized: false,
        status: 403,
        email,
        error: `Drošības nesakritība: JWT e-pasts (${email}) nesakrīt ar galvenes e-pastu (${headerEmail}).`
      };
    }
  }

  // Enforce authorized administrator whitelist (pomellius@gmail.com)
  if (!AUTHORIZED_ADMIN_EMAILS.includes(email)) {
    return {
      authorized: false,
      status: 403,
      email,
      error: `Piekļuve liegta: e-pasts "${email}" nav autorizēto salona administratoru sarakstā.`
    };
  }

  return {
    authorized: true,
    email,
    claims: verifiedClaims
  };
}

export const onRequest = async (context: {
  request: Request;
  env: Env;
  data?: Record<string, unknown>;
  next: () => Promise<Response>;
}) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion, Cf-Access-Authenticated-User-Email',
      },
    });
  }

  // Strict Protection for all /api/admin/* endpoints
  if (url.pathname.startsWith('/api/admin')) {
    const authResult = await validateCloudflareAccessRequest(request, env);
    if (!authResult.authorized) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Unauthorized',
          message: authResult.error || 'Access restricted to authorized salon administrators via Cloudflare Access Zero Trust.',
          email: authResult.email || null,
        }),
        {
          status: authResult.status || 401,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    // Attach verified identity to context.data for downstream admin handlers
    if (!context.data) {
      context.data = {};
    }
    context.data.adminEmail = authResult.email;
    context.data.adminClaims = authResult.claims;
  }

  // Proceed to route handler
  const response = await context.next();

  // Clone and append production security headers
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
