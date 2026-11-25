import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { formatAbcId, isValidAbcId, sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError, verifyOptionalSessionRole } from '@/lib/apiHelpers';

/**
 * GET /api/abc/sync
 * Returns Academic Bank of Credits (ABC / APAAR) status and credit ledger.
 */
export async function GET() {
  try {
    const student = db.getStudent();

    return NextResponse.json({
      success: true,
      abcId: student.abcId || '9821-4402-8819',
      isLinked: student.isAbcLinked ?? true,
      totalCredits: student.abcCredits || 148,
      minimumRequired: 160,
      lastSynced: student.abcLastSynced || 'Today via DigiLocker National Gateway',
      creditBreakdown: student.abcCreditBreakdown || [],
      nsqfLevel: 'Level 7 (BAMS Professional)',
      institutionalNode: 'All India Institute of Ayurveda (AIIA)',
    });
  } catch (error: unknown) {
    return serverError('abc/sync:GET', error, 'Failed to fetch ABC ID ledger');
  }
}

/**
 * POST /api/abc/sync
 * Links new 12-digit ABC ID or performs a live DigiLocker credit sync.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'abc:sync', 20, 60_000);
  if (limited) return limited;

  const authError = verifyOptionalSessionRole(req, ['student', 'institution']);
  if (authError) return authError;

  try {
    const body = (await parseJsonBody<{ abcId?: unknown; action?: unknown }>(req)) ?? {};
    const rawAbcId = typeof body.abcId === 'string' ? sanitizeString(body.abcId, 20) : '';

    let updatedStudent;
    if (rawAbcId) {
      if (!isValidAbcId(rawAbcId)) {
        return badRequest('Invalid ABC / APAAR ID. Expected 12 digits (e.g. 8472-1920-3841).');
      }
      updatedStudent = db.linkAbcId(formatAbcId(rawAbcId));
    } else {
      updatedStudent = db.syncAbcCredits();
    }

    db.addNotification({
      title: 'ABC Credits Synchronized',
      message: `Academic Bank of Credits updated: ${updatedStudent.abcCredits} / 160 verified credits logged.`,
      type: 'verification',
      link: '/student/dashboard',
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      abcId: updatedStudent.abcId,
      totalCredits: updatedStudent.abcCredits,
      lastSynced: updatedStudent.abcLastSynced,
      status: 'Synchronized with National Academic Depository (NAD)',
    });
  } catch (error: unknown) {
    return serverError('abc/sync:POST', error, 'ABC synchronization failed');
  }
}
