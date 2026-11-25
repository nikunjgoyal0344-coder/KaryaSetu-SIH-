import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import {
  ALLOWED_VERIFICATION_ACTIONS,
  createAttestationDigest,
  isAllowedEnum,
  sanitizeString,
} from '@/lib/security';
import { badRequest, enforceRateLimit, notFound, parseJsonBody, serverError, verifyOptionalSessionRole } from '@/lib/apiHelpers';

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
  } catch (error: unknown) {
    return serverError('institution/verify:GET', error, 'Failed to fetch verification queue');
  }
}

/**
 * POST /api/institution/verify
 * Dean / Institutional Authority officially verifies or flags a student's credentials.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'institution:verify', 30, 60_000);
  if (limited) return limited;

  const authError = verifyOptionalSessionRole(req, ['institution']);
  if (authError) return authError;

  try {
    const body = await parseJsonBody<{ studentId?: unknown; action?: unknown }>(req);
    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const studentId = sanitizeString(body.studentId, 64);
    const action = body.action ?? 'Verified';

    if (!studentId) {
      return badRequest('studentId is required');
    }

    if (!isAllowedEnum(action, ALLOWED_VERIFICATION_ACTIONS)) {
      return badRequest(`Invalid action. Must be one of: ${ALLOWED_VERIFICATION_ACTIONS.join(', ')}`);
    }

    const updated = db.verifyStudent(studentId, action);
    if (!updated) {
      return notFound('Student not found in verification roster');
    }

    const rawData = `${studentId}:${updated.rollNumber}:${updated.cgpa}:${action}:${Date.now()}`;
    const institutionalHash = createAttestationDigest(rawData);

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
  } catch (error: unknown) {
    return serverError('institution/verify:POST', error, 'Verification action failed');
  }
}
