import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import {
  buildCredentialPayload,
  signStudentCredential,
  verifyCredentialSignature,
} from '@/lib/credentialAttestation';
import { sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, notFound, parseJsonBody, serverError } from '@/lib/apiHelpers';

export const dynamic = 'force-dynamic';

function evaluateCredentialRequest(studentId: string, providedSig: string): NextResponse {
  const activeStudent = db.getStudent();

  if (studentId !== activeStudent.id) {
    return notFound('No sovereign credential record found for the specified Scholar ID');
  }

  const signed = signStudentCredential(activeStudent);
  const check = verifyCredentialSignature(providedSig, signed.digitalSignature);
  const verifiedSkills = activeStudent.skills.filter((s) => s.isVerified);

  const canonicalPayload = buildCredentialPayload({
    studentId: activeStudent.id,
    studentName: activeStudent.name,
    competencyScore: signed.competencyScore,
    verifiedSkillsCount: signed.verifiedSkillsCount,
    abcCredits: activeStudent.abcCredits || 148,
  });

  if (!check.isAuthentic) {
    return NextResponse.json({
      success: true,
      verified: false,
      status: 'TAMPERED',
      matchMode: check.matchMode,
      reason: 'Provided cryptographic signature does not match the canonical institutional HMAC-SHA256 digest.',
      checkedAt: new Date().toISOString(),
      scholarSummary: {
        id: activeStudent.id,
        name: activeStudent.name,
        college: activeStudent.college,
      },
    });
  }

  return NextResponse.json({
    success: true,
    verified: true,
    status: 'AUTHENTIC',
    matchMode: check.matchMode,
    algorithm: 'HMAC-SHA256 Canonical Attestation',
    verifiedAt: new Date().toISOString(),
    credential: {
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      college: activeStudent.college,
      degree: activeStudent.degree,
      readinessScore: activeStudent.readinessScore,
      competencyScore: signed.competencyScore,
      nsqfLevel: Math.min(8, Math.max(...activeStudent.skills.map((s) => s.level), 3) + 2),
      isInstitutionVerified: Boolean(activeStudent.isInstitutionVerified),
      institutionVerificationDate: activeStudent.institutionVerificationDate || 'Verified AYUSH Registry',
      abcId: activeStudent.abcId || '8472-1920-3841',
      abcCredits: activeStudent.abcCredits || 148,
      isAbcLinked: Boolean(activeStudent.isAbcLinked),
      verifiedSkillsCount: verifiedSkills.length,
      endorsedSkills: verifiedSkills.map((s) => ({
        skillId: s.skillId,
        skillName: s.skillName,
        level: s.level,
        endorsedBy: s.endorsedBy || 'AIIA Clinical Faculty',
      })),
      signatureDigestPrefix: `${signed.digitalSignature.slice(0, 26)}...`,
      canonicalPayloadPreview: canonicalPayload,
    },
  });
}

/**
 * GET /api/verify?studentId=...&sig=...
 * Public verification endpoint for QR scans and verifiable credential links.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'verify:get', 60, 60_000);
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);
    const studentId = sanitizeString(searchParams.get('studentId'), 64);
    const providedSig = sanitizeString(searchParams.get('sig'), 96);

    if (!studentId || !providedSig) {
      return badRequest('studentId and sig query parameters are required for verification');
    }

    return evaluateCredentialRequest(studentId, providedSig);
  } catch (error: unknown) {
    return serverError('verify:GET', error, 'Credential verification failed');
  }
}

/**
 * POST /api/verify
 * Verifies a submitted Scholar ID and cryptographic SHA-256/HMAC hash or QR token.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'verify:post', 60, 60_000);
  if (limited) return limited;

  try {
    const body = await parseJsonBody<{ studentId?: unknown; signature?: unknown }>(req);
    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const studentId = sanitizeString(body.studentId, 64);
    const providedSig = sanitizeString(body.signature, 96);

    if (!studentId || !providedSig) {
      return badRequest('studentId and signature are required');
    }

    return evaluateCredentialRequest(studentId, providedSig);
  } catch (error: unknown) {
    return serverError('verify:POST', error, 'Credential verification failed');
  }
}
