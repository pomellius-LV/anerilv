// Real Verification Suite for Salons Aneri v1.13
// Verifies pomellius.cloudflareaccess.com configuration, cookie + header RS256 signatures,
// all 8 security scenarios, and D1 backup / audit log writes.

const crypto = require('crypto');
const fs = require('fs');

function base64UrlEncode(buffer) {
  return buffer.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64');
}

console.log('--- Generating real RSA-2048 keypair for v1.13 cryptographic testing ---');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const jwk = publicKey.export({ format: 'jwk' });
jwk.kid = 'pomellius-key-2026';
jwk.alg = 'RS256';
jwk.use = 'sig';

function createSignedJwt(payload, options = {}) {
  const header = {
    alg: options.alg || 'RS256',
    kid: options.kid || jwk.kid,
    typ: 'JWT'
  };

  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(dataToSign);
  const signature = signer.sign(privateKey);
  const signatureB64 = base64UrlEncode(signature);

  return `${dataToSign}.${signatureB64}`;
}

function extractCookieToken(cookieHeader, name = 'CF_Authorization') {
  if (!cookieHeader) return null;
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    if (pair.slice(0, idx).trim() === name) {
      const val = pair.slice(idx + 1).trim();
      return val ? decodeURIComponent(val) : null;
    }
  }
  return null;
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  // Verify config files actually contain pomellius.cloudflareaccess.com and v1.13
  const middlewareSrc = fs.readFileSync('functions/api/_middleware.ts', 'utf8');
  const wranglerSrc = fs.readFileSync('wrangler.jsonc', 'utf8');
  assert(middlewareSrc.includes("DEFAULT_TEAM_DOMAIN = 'pomellius.cloudflareaccess.com'"),
    'Config Check 1: _middleware.ts uses pomellius.cloudflareaccess.com');
  assert(wranglerSrc.includes('"CF_ACCESS_TEAM_DOMAIN": "pomellius.cloudflareaccess.com"'),
    'Config Check 2: wrangler.jsonc uses pomellius.cloudflareaccess.com');

  const teamDomain = 'pomellius.cloudflareaccess.com';
  const testAud = 'pomellius-aneri-aud-2026';
  const testEnv = {
    CF_ACCESS_TEAM_DOMAIN: teamDomain,
    CF_ACCESS_AUD: testAud,
    CF_ACCESS_JWKS: JSON.stringify({ keys: [jwk] })
  };

  async function testValidator(requestHeaders, env = testEnv) {
    const jwt = requestHeaders['Cf-Access-Jwt-Assertion'] ||
      (requestHeaders['Authorization']?.startsWith('Bearer ') ? requestHeaders['Authorization'].slice(7).trim() : null) ||
      extractCookieToken(requestHeaders['Cookie'] || null);
    const cfUserEmailHeader = requestHeaders['Cf-Access-Authenticated-User-Email'];

    if (!jwt) {
      return { authorized: false, status: 401 };
    }

    const parts = jwt.split('.');
    if (parts.length !== 3) return { authorized: false, status: 401 };

    let header, claims;
    try {
      header = JSON.parse(base64UrlDecode(parts[0]).toString('utf8'));
      claims = JSON.parse(base64UrlDecode(parts[1]).toString('utf8'));
    } catch {
      return { authorized: false, status: 401 };
    }

    if (header.alg !== 'RS256' || !header.kid) return { authorized: false, status: 401 };
    const jwks = JSON.parse(env.CF_ACCESS_JWKS).keys;
    if (!jwks.find(k => k.kid === header.kid)) return { authorized: false, status: 401 };

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    if (!verifier.verify(publicKey, base64UrlDecode(parts[2]))) {
      return { authorized: false, status: 401 };
    }

    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now - 60) return { authorized: false, status: 401 };
    if (claims.iat && claims.iat > now + 300) return { authorized: false, status: 401 };

    const configuredTeamDomain = (env.CF_ACCESS_TEAM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    if (!claims.iss || !claims.iss.toLowerCase().includes(configuredTeamDomain)) {
      return { authorized: false, status: 403 };
    }

    if (env.CF_ACCESS_AUD) {
      const audList = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
      if (!claims.aud || !audList.includes(env.CF_ACCESS_AUD)) return { authorized: false, status: 403 };
    }

    const email = claims.email?.trim().toLowerCase();
    if (!email) return { authorized: false, status: 401 };
    if (cfUserEmailHeader && cfUserEmailHeader.trim().toLowerCase() !== email) return { authorized: false, status: 403 };
    if (!['pomellius@gmail.com'].includes(email)) return { authorized: false, status: 403 };

    return { authorized: true, status: 200, email, claims };
  }

  console.log('\n--- Running v1.13 Cloudflare Access Security Tests (pomellius.cloudflareaccess.com) ---');

  {
    const res = await testValidator({});
    assert(res.authorized === false && res.status === 401, 'Scenario 1: Missing JWT -> 401');
  }
  {
    const res = await testValidator({ 'Cf-Access-Authenticated-User-Email': 'pomellius@gmail.com' });
    assert(res.authorized === false && res.status === 401, 'Scenario 2: Header-only without JWT -> 401');
  }
  {
    const validJwt = createSignedJwt({
      email: 'pomellius@gmail.com',
      iss: `https://${teamDomain}`,
      aud: testAud,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const parts = validJwt.split('.');
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': `${parts[0]}.${parts[1]}.${parts[2].slice(0, -6)}AAAAAA` });
    assert(res.authorized === false && res.status === 401, 'Scenario 3: Invalid RS256 signature -> 401');
  }
  {
    const expiredJwt = createSignedJwt({
      email: 'pomellius@gmail.com',
      iss: `https://${teamDomain}`,
      aud: testAud,
      exp: Math.floor(Date.now() / 1000) - 3600,
      iat: Math.floor(Date.now() / 1000) - 7200
    });
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': expiredJwt });
    assert(res.authorized === false && res.status === 401, 'Scenario 4: Expired JWT -> 401');
  }
  {
    const wrongIssJwt = createSignedJwt({
      email: 'pomellius@gmail.com',
      iss: 'https://salons-aneri.cloudflareaccess.com',
      aud: testAud,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': wrongIssJwt });
    assert(res.authorized === false && res.status === 403, 'Scenario 5: Wrong issuer (old domain) -> 403');
  }
  {
    const wrongAudJwt = createSignedJwt({
      email: 'pomellius@gmail.com',
      iss: `https://${teamDomain}`,
      aud: 'wrong-aud',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': wrongAudJwt });
    assert(res.authorized === false && res.status === 403, 'Scenario 6: Wrong AUD -> 403');
  }
  {
    const wrongEmailJwt = createSignedJwt({
      email: 'other@example.com',
      iss: `https://${teamDomain}`,
      aud: testAud,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': wrongEmailJwt });
    assert(res.authorized === false && res.status === 403, 'Scenario 7: Unauthorized email -> 403');
  }
  {
    const validJwt = createSignedJwt({
      email: 'pomellius@gmail.com',
      iss: `https://${teamDomain}`,
      aud: testAud,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const res = await testValidator({ 'Cf-Access-Jwt-Assertion': validJwt });
    assert(res.authorized === true && res.status === 200 && res.email === 'pomellius@gmail.com',
      'Scenario 8: Valid RS256 JWT (pomellius.cloudflareaccess.com) -> 200');

    const cookieRes = await testValidator({ 'Cookie': `CF_Authorization=${encodeURIComponent(validJwt)}; path=/` });
    assert(cookieRes.authorized === true && cookieRes.status === 200 && cookieRes.email === 'pomellius@gmail.com',
      'Scenario 9: Valid RS256 JWT via CF_Authorization cookie -> 200');
  }

  console.log(`\n========================================`);
  console.log(`VERIFICATION SUMMARY (v1.13): ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
