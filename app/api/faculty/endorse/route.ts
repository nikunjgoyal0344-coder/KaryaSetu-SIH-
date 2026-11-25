import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { createAttestationDigest, sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError, verifyOptionalSessionRole } from '@/lib/apiHelpers';

/**
 * POST /api/faculty/endorse
 * Faculty member endorses and certifies student clinical competency
 * with an HMAC-SHA256 cryptographic endorsement signature.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'faculty:endorse', 30, 60_000);
  if (limited) return limited;

  const authError = verifyOptionalSessionRole(req, ['faculty', 'institution']);
  if (authError) return authError;

  try {
    const body = await parseJsonBody<{ skillId?: unknown; facultyName?: unknown }>(req);
    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const skillId = sanitizeString(body.skillId, 80);
    const facultyName = sanitizeString(body.facultyName, 120) || 'Dr. Rajesh Mishra (AIIA)';

    if (!skillId) {
      return badRequest('skillId is required');
    }

    const updatedStudent = db.endorseSkill(skillId, facultyName);

    const payload = `${updatedStudent.id}:${skillId}:${facultyName}:${Date.now()}`;
    const signatureHash = createAttestationDigest(payload);

    db.addNotification({
      title: 'Clinical Skill Endorsed!',
      message: `${facultyName} officially endorsed your clinical proficiency in ${skillId.replace(/-/g, ' ')}.`,
      type: 'endorsement',
      link: '/student/portfolio',
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      skillId,
      endorsedBy: facultyName,
      attestationSignature: `SIG-AYUSH-2026-${signatureHash.substring(0, 16).toUpperCase()}`,
      studentSkills: updatedStudent.skills,
    });
  } catch (error: unknown) {
    return serverError('faculty/endorse', error, 'Endorsement failed');
  }
}
