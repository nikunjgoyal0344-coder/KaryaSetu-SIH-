import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/backend/db';
import {
  ALLOWED_ROLES,
  getJwtSecret,
  isAllowedEnum,
  isValidEmail,
  sanitizeString,
} from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError } from '@/lib/apiHelpers';

/**
 * POST /api/auth/login
 * Authenticates user across 4 stakeholder roles and returns a signed JWT token.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'auth:login', 30, 60_000);
  if (limited) return limited;

  try {
    const body = (await parseJsonBody<{ role?: unknown; email?: unknown }>(req)) ?? {};
    const rawRole = typeof body.role === 'string' ? body.role.trim() : 'student';

    if (!isAllowedEnum(rawRole, ALLOWED_ROLES)) {
      return badRequest(`Invalid role specified. Must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }

    let resolvedEmailInput = '';
    if (typeof body.email === 'string' && body.email.trim().length > 0) {
      resolvedEmailInput = sanitizeString(body.email, 254);
      if (!isValidEmail(resolvedEmailInput)) {
        return badRequest('Invalid email address format');
      }
    }

    const user = db.getUser(rawRole);
    const resolvedEmail = resolvedEmailInput || user.email;
    const secret = getJwtSecret();

    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: resolvedEmail,
        role: user.role,
        affiliation: user.affiliation,
      },
      secret,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        ...user,
        email: resolvedEmail,
      },
      expiresIn: '7d',
    });

    response.cookies.set('karyasetu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    return serverError('auth/login', error, 'Authentication failed');
  }
}
