import crypto from 'node:crypto';

export const ALLOWED_ROLES = ['student', 'industry', 'faculty', 'institution'] as const;
export type StakeholderRole = (typeof ALLOWED_ROLES)[number];

export const ALLOWED_APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Selected',
  'Rejected',
] as const;
export type ApplicationStatus = (typeof ALLOWED_APPLICATION_STATUSES)[number];

export const ALLOWED_OPPORTUNITY_CATEGORIES = [
  'Internship',
  'Entry-Level Job',
  'Live Project',
  'Faculty FDP',
] as const;

export const ALLOWED_WORK_MODES = ['On-site', 'Remote', 'Hybrid'] as const;

export const ALLOWED_VERIFICATION_ACTIONS = ['Verified', 'Flagged'] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ABC_ID_REGEX = /^(\d{4}-\d{4}-\d{4}|\d{12})$/;
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F<>]/g;

/**
 * Resolves the JWT signing/verification secret consistently across all auth endpoints.
 * Fails closed in production if JWT_SECRET is not explicitly configured.
 */
export function getJwtSecret(): string {
  const configured = process.env.JWT_SECRET?.trim();
  if (configured) {
    return configured;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY CONFIGURATION: JWT_SECRET must be defined in production.');
  }
  return 'karyasetu-sovereign-dev-secret-2026';
}

/**
 * Strips control characters and HTML angle brackets, trims, and enforces max length.
 */
export function sanitizeString(value: unknown, maxLength = 256): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS_REGEX, '').trim().slice(0, maxLength);
}

/**
 * Validates email length and structural format.
 */
export function isValidEmail(email: string): boolean {
  return email.length > 3 && email.length <= 254 && EMAIL_REGEX.test(email);
}

/**
 * Validates 12-digit APAAR / Academic Bank of Credits identifier (e.g. 8472-1920-3841 or 847219203841).
 */
export function isValidAbcId(abcId: string): boolean {
  return ABC_ID_REGEX.test(abcId.trim());
}

/**
 * Normalizes a valid 12-digit ABC ID into hyphenated XXXX-XXXX-XXXX display format.
 */
export function formatAbcId(abcId: string): string {
  const digits = abcId.replace(/\D/g, '');
  if (digits.length !== 12) return abcId.trim();
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
}

/**
 * Validates whether a candidate value belongs to a fixed enum allowlist.
 */
export function isAllowedEnum<T extends string>(value: unknown, allowlist: readonly T[]): value is T {
  return typeof value === 'string' && (allowlist as readonly string[]).includes(value);
}

/**
 * Clamps a numeric input within inclusive bounds, returning fallback if invalid or non-finite.
 */
export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

/**
 * Creates a salted scrypt password hash (format: salt:derivedKeyHex).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

/**
 * Verifies a password against a salted scrypt hash using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;

  const expectedBuffer = Buffer.from(keyHex, 'hex');
  const actualBuffer = crypto.scryptSync(password, salt, 64);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Generates an HMAC-SHA256 attestation signature for verified credentials.
 */
export function createAttestationDigest(payload: string): string {
  const secret = getJwtSecret();
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

/**
 * Fixed-window in-memory rate limiter for API route protection.
 */
export function checkRateLimit(
  key: string,
  maxRequests = 60,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - existing.count),
    resetAt: existing.resetAt,
  };
}

/**
 * Clears internal rate limit buckets (intended for isolated test suites).
 */
export function resetRateLimiter(): void {
  rateLimitStore.clear();
}

/**
 * Extracts a safe client identifier from headers for rate limiting.
 */
export function getClientKey(headers: { get(name: string): string | null }, routePrefix: string): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = headers.get('x-real-ip')?.trim();
  const ip = forwarded || realIp || 'local-client';
  return `${routePrefix}:${ip}`;
}
