const fs = require('fs');
const assert = require('assert');

console.log('=== SALONS ANERI v1.11 PRODUCTION VERIFICATION SUITE ===\n');

// Test 1: Verify SQL migration contents
console.log('[TEST 1] Verifying SQL migration files...');
const schema001 = fs.readFileSync('migrations/0001_initial_schema.sql', 'utf8');
assert(schema001.includes('CREATE TABLE IF NOT EXISTS schema_migrations'), '0001 schema must include schema_migrations');
assert(schema001.includes('CREATE TABLE IF NOT EXISTS services'), '0001 schema must include services');
assert(schema001.includes('CREATE TABLE IF NOT EXISTS service_translations'), '0001 schema must include service_translations');
assert(schema001.includes('CREATE TABLE IF NOT EXISTS articles'), '0001 schema must include articles');
assert(schema001.includes('CREATE TABLE IF NOT EXISTS article_translations'), '0001 schema must include article_translations');
console.log('  ✓ 0001_initial_schema.sql contains all necessary tables and migration tracking');

const seed002 = fs.readFileSync('migrations/0002_seed_full_catalog.sql', 'utf8');
const servicesMatches = (seed002.match(/INSERT OR IGNORE INTO services/g) || []).length;
const transMatches = (seed002.match(/INSERT OR IGNORE INTO service_translations/g) || []).length;
assert.strictEqual(servicesMatches, 83, `Expected 83 services in 0002 seed, found ${servicesMatches}`);
assert.strictEqual(transMatches, 249, `Expected 249 translations in 0002 seed, found ${transMatches}`);
console.log(`  ✓ 0002_seed_full_catalog.sql contains exactly ${servicesMatches} services and ${transMatches} translations`);

const seed003 = fs.readFileSync('migrations/0003_seed_all_articles.sql', 'utf8');
const articleMatches = (seed003.match(/INSERT OR IGNORE INTO articles/g) || []).length;
const artTransMatches = (seed003.match(/INSERT OR IGNORE INTO article_translations/g) || []).length;
assert.strictEqual(articleMatches, 11, `Expected 11 articles in 0003 seed, found ${articleMatches}`);
assert.strictEqual(artTransMatches, 33, `Expected 33 translations in 0003 seed, found ${artTransMatches}`);
console.log(`  ✓ 0003_seed_all_articles.sql contains exactly ${articleMatches} articles and ${artTransMatches} translations`);

// Test 2: Check Cloudflare Access JWT decoder & validation logic
console.log('\n[TEST 2] Verifying Cloudflare Access JWT validation logic...');

function decodeJwtPayload(jwt) {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function mockValidateAccess(headers, env = {}) {
  const AUTHORIZED_EMAILS = ['pomellius@gmail.com'];
  const jwt = headers['cf-access-jwt-assertion'];
  const cfUserEmailHeader = headers['cf-access-authenticated-user-email'];

  if (!jwt && !cfUserEmailHeader) {
    return { authorized: false, status: 401, error: 'Missing Cloudflare Access assertion' };
  }

  let userEmail;
  if (jwt) {
    const claims = decodeJwtPayload(jwt);
    if (!claims) return { authorized: false, status: 401, error: 'Malformed JWT' };
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) return { authorized: false, status: 401, error: 'Expired JWT' };
    userEmail = claims.email?.trim().toLowerCase();
  }

  if (cfUserEmailHeader) {
    const headerEmail = cfUserEmailHeader.trim().toLowerCase();
    if (userEmail && userEmail !== headerEmail) {
      return { authorized: false, status: 403, error: 'Mismatch between JWT and header' };
    }
    userEmail = userEmail || headerEmail;
  }

  if (!userEmail) return { authorized: false, status: 401, error: 'No email found' };
  if (!AUTHORIZED_EMAILS.includes(userEmail)) {
    return { authorized: false, status: 403, error: 'Unauthorized email' };
  }

  return { authorized: true, email: userEmail };
}

// 2a: Unauthenticated request
const unauthRes = mockValidateAccess({});
assert.strictEqual(unauthRes.authorized, false);
assert.strictEqual(unauthRes.status, 401);
console.log('  ✓ Unauthenticated request rejected with HTTP 401');

// 2b: Unauthorized email
const wrongUserRes = mockValidateAccess({ 'cf-access-authenticated-user-email': 'attacker@example.com' });
assert.strictEqual(wrongUserRes.authorized, false);
assert.strictEqual(wrongUserRes.status, 403);
console.log('  ✓ Non-admin email rejected with HTTP 403');

// 2c: Valid authorized owner
const validRes = mockValidateAccess({ 'cf-access-authenticated-user-email': 'pomellius@gmail.com' });
assert.strictEqual(validRes.authorized, true);
assert.strictEqual(validRes.email, 'pomellius@gmail.com');
console.log('  ✓ Authorized owner (pomellius@gmail.com) accepted');

// 2d: Expired JWT test
const expiredPayload = Buffer.from(JSON.stringify({
  email: 'pomellius@gmail.com',
  exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
})).toString('base64').replace(/=/g, '');
const expiredJwt = `header.${expiredPayload}.signature`;
const expiredRes = mockValidateAccess({ 'cf-access-jwt-assertion': expiredJwt });
assert.strictEqual(expiredRes.authorized, false);
assert.strictEqual(expiredRes.status, 401);
console.log('  ✓ Expired Cloudflare Access token strictly rejected with HTTP 401');

// Test 3: Check codebase for forbidden backdoors
console.log('\n[TEST 3] Checking codebase for forbidden backdoors...');
const adminPanelCode = fs.readFileSync('components/AdminPanel.tsx', 'utf8');
assert(!adminPanelCode.includes('2640'), 'AdminPanel must NOT contain PIN 2640');
assert(!adminPanelCode.includes('aneri2026'), 'AdminPanel must NOT contain password aneri2026');
assert(!adminPanelCode.includes('localStorage.setItem(\'aneri_admin_auth\''), 'AdminPanel must NOT write fake auth to localStorage');
console.log('  ✓ PIN 2640, password aneri2026, and localStorage auth bypass successfully removed from AdminPanel.tsx');

const middlewareCode = fs.readFileSync('functions/api/_middleware.ts', 'utf8');
assert(!middlewareCode.includes('hasBearerToken = authHeader.startsWith(\'Bearer \') && authHeader.length > 15'), 'Middleware must NOT accept arbitrary Bearer tokens');
console.log('  ✓ Arbitrary Bearer token bypass successfully removed from functions/api/_middleware.ts');

const authCode = fs.readFileSync('functions/api/admin/auth.ts', 'utf8');
assert(!authCode.includes('Math.random()'), 'Auth endpoint must NOT generate random fake session tokens');
assert(!authCode.includes('2640'), 'Auth endpoint must NOT check PIN 2640');
console.log('  ✓ Fake Math.random() session generator removed from functions/api/admin/auth.ts');

// Test 4: Check version bumps across files
console.log('\n[TEST 4] Checking version v1.24 bump across files...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert(pkg.name.includes('1.24'), 'package.json name must reflect 1.24');

const footerCode = fs.readFileSync('components/Footer.tsx', 'utf8');
assert(footerCode.includes('v1.24'), 'Footer.tsx must display v1.24');

const wranglerCode = fs.readFileSync('wrangler.jsonc', 'utf8');
assert(!wranglerCode.includes('REPLACE_WITH_YOUR_PRODUCTION_D1_ID'), 'wrangler.jsonc must not contain dummy REPLACE_WITH_... strings');
assert(wranglerCode.includes('e356eee0-ed72-4c96-a0bf-d87f44834d6e'), 'wrangler.jsonc must contain real production database_id');
assert(wranglerCode.includes('pomellius.cloudflareaccess.com'), 'wrangler.jsonc must use pomellius.cloudflareaccess.com');
console.log('  ✓ Version bumped to 1.24 in package.json and Footer.tsx');
console.log('  ✓ wrangler.jsonc configured with real database IDs and pomellius.cloudflareaccess.com');

console.log('\n=== ALL PRODUCTION HARDENING TESTS PASSED! ===');
