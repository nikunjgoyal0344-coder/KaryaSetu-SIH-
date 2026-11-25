import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getClientKey, getJwtSecret } from './security';

export interface VerifiedSessionPayload {
  sub: string;
  role: string;
  email?: string;
  name?: string;
}

/**
 * Safely parses JSON request body without throwing uncaught syntax errors.
 */
export async function parseJsonBody<T = Record<string, unknown>>(req: NextRequest): Promise<T | null> {
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns a standardized 400 Bad Request JSON response.
 */
export function badRequest(message: string, headers?: HeadersInit): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400, headers });
}

/**
 * Returns a standardized 401 Unauthorized JSON response.
 */
export function unauthorized(message = 'Authentication required', headers?: HeadersInit): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401, headers });
}

/**
 * Returns a standardized 403 Forbidden JSON response.
 */
export function forbidden(message = 'Insufficient role permissions for this operation', headers?: HeadersInit): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403, headers });
}

/**
 * Returns a standardized 404 Not Found JSON response.
 */
export function notFound(message: string, headers?: HeadersInit): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 404, headers });
}

/**
 * Enforces signed JWT RBAC when credentials are present or when `REQUIRE_STRICT_AUTH=true`.
 * Returns null if permitted, or an HTTP 401/403 NextResponse if denied.
 */
export function verifyOptionalSessionRole(
  req: NextRequest,
  allowedRoles: readonly string[]
): NextResponse | null {
  const authHeader = req.headers.get('authorization');
  const cookieToken = req.cookies.get('karyasetu_token')?.value;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const token = bearerToken || cookieToken || '';

  if (!token) {
    if (process.env.REQUIRE_STRICT_AUTH === 'true') {
      return unauthorized('Authenticated session token is required');
    }
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as VerifiedSessionPayload;
    if (!decoded || typeof decoded.role !== 'string') {
      return unauthorized('Invalid session payload');
    }
    if (!allowedRoles.includes(decoded.role)) {
      return forbidden(`Role '${decoded.role}' is not authorized for this action`);
    }
    return null;
  } catch {
    return unauthorized('Invalid or expired session token');
  }
}

/**
 * Logs internal details server-side and returns an opaque, safe 500 response to clients.
 */
export function serverError(contextLabel: string, error: unknown, publicMessage: string, headers?: HeadersInit): NextResponse {
  console.error(`[API:${contextLabel}] Internal error:`, error instanceof Error ? error.message : error);
  return NextResponse.json({ success: false, error: publicMessage }, { status: 500, headers });
}

/**
 * Enforces fixed-window rate limiting on an incoming API request.
 * Returns null if allowed, or a 429 NextResponse if limit exceeded.
 */
export function enforceRateLimit(
  req: NextRequest,
  routePrefix: string,
  maxRequests = 60,
  windowMs = 60_000
): NextResponse | null {
  const clientKey = getClientKey(req.headers, routePrefix);
  const result = checkRateLimit(clientKey, maxRequests, windowMs);
  if (!result.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  return null;
}

/**
 * Returns restricted same-origin CORS headers rather than an unsafe wildcard.
 */
export function getRestrictedCorsHeaders(methods = 'GET, POST, OPTIONS'): Record<string, string> {
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}
