import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/backend/db';

const JWT_SECRET = process.env.JWT_SECRET || 'karyasetu-sovereign-secret-2026';

/**
 * POST /api/auth/login
 * Authenticates user across 4 stakeholder roles and returns a signed JWT token.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role = 'student', email } = body;

    const user = db.getUser(role);

    // Sign stateless JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: email || user.email,
        role: user.role,
        affiliation: user.affiliation,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        ...user,
        email: email || user.email,
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
