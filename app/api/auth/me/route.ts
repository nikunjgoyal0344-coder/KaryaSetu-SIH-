import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'karyasetu-sovereign-secret-2026';

/**
 * GET /api/auth/me
 * Verifies JWT from Authorization header or cookie, returning the active session.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('karyasetu_token')?.value;

    let token = cookieToken;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: decoded,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session token' },
      { status: 401 }
    );
  }
}
