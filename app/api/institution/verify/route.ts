import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/backend/db';

/**
 * GET /api/institution/verify
 * Returns candidate verification queue for Dean / Institutional authority.
 */
export async function GET() {
  try {
    const list = db.getUnverifiedStudents();
    return NextResponse.json({
      success: true,
      count: list.length,
      unverifiedStudents: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch verification queue' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/institution/verify
 * Dean / Institutional Authority officially verifies or flags a student's credentials.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, action = 'Verified' } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'studentId is required' },
        { status: 400 }
      );
    }

    const updated = db.verifyStudent(studentId, action);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Student not found in verification roster' },
        { status: 404 }
      );
    }

    // Generate Institutional Sovereign Hash
    const rawData = `${studentId}:${updated.rollNumber}:${updated.cgpa}:${action}:${Date.now()}`;
    const institutionalHash = crypto.createHash('sha256').update(rawData).digest('hex');

    db.addNotification({
      title: `Institutional Status: ${action}`,
      message: `Your student credentials have been officially ${action.toLowerCase()} by AIIA Dean of Academics.`,
      type: 'verification',
      link: '/student/dashboard',
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      student: updated,
      cryptographicSeal: `AIIA-NEP-${institutionalHash.substring(0, 20).toUpperCase()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification action failed' },
      { status: 500 }
    );
  }
}
