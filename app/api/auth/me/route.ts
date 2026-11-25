import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/security';

/**
 * GET /api/auth/me
 * Verifies JWT from cookie or Authorization Bearer header, returning the active session.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('karyasetu_token')?.value;

    let token = cookieToken;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });

    return NextResponse.json({
      success: true,
      user: decoded,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session token' },
      { status: 401 }
    );
  }
}
