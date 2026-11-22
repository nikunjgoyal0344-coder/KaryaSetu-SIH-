import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/backend/db';

const ALLOWED_ROLES = ['student', 'industry', 'faculty', 'institution'] as const;
type StakeholderRole = (typeof ALLOWED_ROLES)[number];

function getJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY CONFIGURATION: JWT_SECRET must be defined in production environment.');
  }
  return 'karyasetu-sovereign-dev-secret-2026';
}

/**
 * POST /api/auth/login
 * Authenticates user across 4 stakeholder roles and returns a signed JWT token.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawRole = typeof body.role === 'string' ? body.role.trim() : 'student';

    if (!ALLOWED_ROLES.includes(rawRole as StakeholderRole)) {
      return NextResponse.json(
        { success: false, error: `Invalid role specified. Must be one of: ${ALLOWED_ROLES.join(', ')}` },
        { status: 400 }
      );
    }
    const role = rawRole as StakeholderRole;

    let email = '';
    if (typeof body.email === 'string' && body.email.trim().length > 0) {
      email = body.email.trim().slice(0, 254);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email address format' },
          { status: 400 }
        );
      }
    }

    const user = db.getUser(role);
    const resolvedEmail = email || user.email;
    const secret = getJwtSecret();

    // Sign stateless JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: resolvedEmail,
        role: user.role,
        affiliation: user.affiliation,
      },
      secret,
      { expiresIn: '7d' }
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

    // Set secure session cookie
    response.cookies.set('karyasetu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
