import crypto from 'node:crypto';
import { AYUSH_SKILLS_TAXONOMY, COMPETENCY_FRAMEWORK } from './taxonomy';
import { createAttestationDigest } from './security';
import type { StudentProfile } from './seedData';

export interface CredentialDigestInput {
  studentId: string;
  studentName: string;
  competencyScore: number;
  verifiedSkillsCount: number;
  abcCredits: number;
}

export interface CredentialVerificationOutcome {
  isAuthentic: boolean;
  matchMode: 'full-digest' | 'qr-prefix' | 'mismatch';
  expectedDigest: string;
}

/**
 * Computes weighted competency score (0-99) consistent across portfolio generation and verification.
 */
export function computeWeightedCompetencyScore(student: StudentProfile): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const skill of student.skills) {
    const taxonomyItem = AYUSH_SKILLS_TAXONOMY.find((t) => t.id === skill.skillId);
    const category = taxonomyItem?.category || 'AYUSH Clinical';
    const weight =
      COMPETENCY_FRAMEWORK.domainWeights[
        category as keyof typeof COMPETENCY_FRAMEWORK.domainWeights
      ] || 0.15;
    const verificationBonus = skill.isVerified ? 1.15 : 1.0;

    weightedSum += (skill.level / 5) * 100 * weight * verificationBonus;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.min(99, Math.round(weightedSum / totalWeight)) : 80;
}

/**
 * Builds the canonical attestation payload string for a student credential.
 */
export function buildCredentialPayload(input: CredentialDigestInput): string {
  return `${input.studentId}:${input.studentName}:${input.competencyScore}:${input.verifiedSkillsCount}:${input.abcCredits}`;
}

/**
 * Signs a canonical student credential payload using HMAC-SHA256.
 */
export function signStudentCredential(student: StudentProfile): {
  competencyScore: number;
  verifiedSkillsCount: number;
  digitalSignature: string;
  compactSignature: string;
  verifyPath: string;
} {
  const verifiedSkillsCount = student.skills.filter((s) => s.isVerified).length;
  const competencyScore = computeWeightedCompetencyScore(student);
  const payload = buildCredentialPayload({
    studentId: student.id,
    studentName: student.name,
    competencyScore,
    verifiedSkillsCount,
    abcCredits: student.abcCredits || 148,
  });

  const digitalSignature = `0x${createAttestationDigest(payload)}`;
  const compactSignature = digitalSignature.slice(0, 26); // 0x + 24 hex chars (96 bits)
  const verifyPath = `/verify?studentId=${encodeURIComponent(student.id)}&sig=${encodeURIComponent(compactSignature)}`;

  return {
    competencyScore,
    verifiedSkillsCount,
    digitalSignature,
    compactSignature,
    verifyPath,
  };
}

function normalizeHexDigest(raw: string): string {
  return raw.trim().toLowerCase().replace(/^0x/, '');
}

/**
 * Constant-time verification of either a full 64-hex HMAC-SHA256 digest or compact QR prefix (>= 14 hex chars).
 */
export function verifyCredentialSignature(
  providedSignature: string,
  expectedSignature: string
): CredentialVerificationOutcome {
  const providedHex = normalizeHexDigest(providedSignature);
  const expectedHex = normalizeHexDigest(expectedSignature);

  if (!/^[a-f0-9]+$/.test(providedHex) || providedHex.length < 14 || providedHex.length > expectedHex.length) {
    return { isAuthentic: false, matchMode: 'mismatch', expectedDigest: expectedSignature };
  }

  const targetSlice = expectedHex.slice(0, providedHex.length);
  const a = Buffer.from(providedHex, 'utf8');
  const b = Buffer.from(targetSlice, 'utf8');

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { isAuthentic: false, matchMode: 'mismatch', expectedDigest: expectedSignature };
  }

  return {
    isAuthentic: true,
    matchMode: providedHex.length === expectedHex.length ? 'full-digest' : 'qr-prefix',
    expectedDigest: expectedSignature,
  };
}
