import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLOWED_ROLES,
  checkRateLimit,
  clampNumber,
  createAttestationDigest,
  formatAbcId,
  getJwtSecret,
  hashPassword,
  isAllowedEnum,
  isValidAbcId,
  isValidEmail,
  resetRateLimiter,
  sanitizeString,
  verifyPassword,
} from '../lib/security.ts';

test('sanitizeString strips HTML brackets, control chars, and enforces maxLength', () => {
  assert.strictEqual(sanitizeString('  <script>alert(1)</script>  ', 50), 'scriptalert(1)/script');
  assert.strictEqual(sanitizeString('hello\x00\x1Fworld', 50), 'helloworld');
  assert.strictEqual(sanitizeString('abcdef', 3), 'abc');
  assert.strictEqual(sanitizeString(12345 as unknown), '');
});

test('email and ABC ID validation and formatting work strictly', () => {
  assert.strictEqual(isValidEmail('ananya@aiia.gov.in'), true);
  assert.strictEqual(isValidEmail('not-an-email'), false);
  assert.strictEqual(isValidEmail('a@b'), false);

  assert.strictEqual(isValidAbcId('8472-1920-3841'), true);
  assert.strictEqual(isValidAbcId('847219203841'), true);
  assert.strictEqual(isValidAbcId('12345'), false);
  assert.strictEqual(formatAbcId('847219203841'), '8472-1920-3841');
});

test('enum allowlist and clampNumber reject malformed inputs', () => {
  assert.strictEqual(isAllowedEnum('student', ALLOWED_ROLES), true);
  assert.strictEqual(isAllowedEnum('superadmin', ALLOWED_ROLES), false);
  assert.strictEqual(clampNumber(10, 1, 5, 1), 5);
  assert.strictEqual(clampNumber(-2, 1, 5, 1), 1);
  assert.strictEqual(clampNumber(Number.NaN, 1, 5, 2), 2);
  assert.strictEqual(clampNumber('bad', 1, 5, 3), 3);
});

test('scrypt password hashing and HMAC attestation verification', () => {
  const hash = hashPassword('SovereignAyush#2026');
  assert.strictEqual(verifyPassword('SovereignAyush#2026', hash), true);
  assert.strictEqual(verifyPassword('WrongPassword', hash), false);
  assert.strictEqual(verifyPassword('any', 'corrupt-hash'), false);

  const sig1 = createAttestationDigest('stu-1:panchakarma:2026');
  const sig2 = createAttestationDigest('stu-1:panchakarma:2026');
  assert.strictEqual(sig1.length, 64);
  assert.strictEqual(sig1, sig2);
});

test('getJwtSecret fails closed in production when JWT_SECRET is unset', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.JWT_SECRET;

  try {
    delete process.env.JWT_SECRET;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    assert.ok(getJwtSecret().length > 10);

    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    assert.throws(() => getJwtSecret(), /CRITICAL SECURITY CONFIGURATION/);

    process.env.JWT_SECRET = 'custom-prod-secret-value';
    assert.strictEqual(getJwtSecret(), 'custom-prod-secret-value');
  } finally {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  }
});

test('checkRateLimit enforces quota per key and resets cleanly', () => {
  resetRateLimiter();
  const r1 = checkRateLimit('test:ip1', 2, 10_000);
  const r2 = checkRateLimit('test:ip1', 2, 10_000);
  const r3 = checkRateLimit('test:ip1', 2, 10_000);
  const other = checkRateLimit('test:ip2', 2, 10_000);

  assert.strictEqual(r1.allowed, true);
  assert.strictEqual(r1.remaining, 1);
  assert.strictEqual(r2.allowed, true);
  assert.strictEqual(r2.remaining, 0);
  assert.strictEqual(r3.allowed, false);
  assert.strictEqual(other.allowed, true);
  resetRateLimiter();
});
