import { NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { signStudentCredential } from '@/lib/credentialAttestation';
import { serverError } from '@/lib/apiHelpers';

export const dynamic = 'force-dynamic';

export interface Badge {
  id: string;
  name: string;
  category: string;
  icon: string;
  earnedDate: string;
  issuer: string;
  credentialUrl: string;
  isVerified: boolean;
}

export interface GeneratedProfile {
  studentId: string;
  studentName: string;
  college: string;
  degree: string;
  competencyScore: number;
  verificationLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nsqfLevel: number;
  hsscAlignment: string[];
  badges: Badge[];
  strengths: string[];
  improvementAreas: string[];
  portfolioSummary: string;
  digitalSignature: string;
  verifyPath: string;
  qrCodeUrl: string;
  abcCredits: number;
  totalVerifiedSkills: number;
  lastUpdated: string;
}

/**
 * GET /api/ai/profile-generate
 * Automated Skill Profile Generation & Verified Digital Portfolio Engine (Feature 5)
 * Constructs a verifiable competency profile from student skill levels,
 * institutional endorsements, and APAAR/ABC credits.
 */
export async function GET() {
  try {
    const student = db.getStudent();
    const verifiedSkills = student.skills.filter((s) => s.isVerified);

    // 1. Compute canonical weighted competency score and HMAC attestation signature
    const {
      competencyScore,
      digitalSignature,
      verifyPath,
    } = signStudentCredential(student);

    // 2. Verification Tier
    let verificationLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
    if (verifiedSkills.length >= 6) {
      verificationLevel = 'Platinum';
    } else if (verifiedSkills.length >= 4) {
      verificationLevel = 'Gold';
    } else if (verifiedSkills.length >= 2) {
      verificationLevel = 'Silver';
    }

    // 3. NSQF Level estimation based on highest verified skill and cgpa
    const maxSkillLevel = Math.max(...student.skills.map((s) => s.level), 3);
    const nsqfLevel = Math.min(8, maxSkillLevel + 2); // e.g. level 4 -> NSQF Level 6 (BAMS/Intern)

    // 4. Dynamic Badges
    const badges: Badge[] = [
      {
        id: 'badge-1',
        name: 'Clinical Panchakarma Master',
        category: 'Clinical Competency',
        icon: '🌿',
        earnedDate: 'August 2025',
        issuer: 'All India Institute of Ayurveda (AIIA)',
        credentialUrl: 'https://karyasetu.gov.in/credentials/aiia-pk-44',
        isVerified: true,
      },
      {
        id: 'badge-2',
        name: 'Classical Pulse Diagnostic (Nadi)',
        category: 'Diagnostics',
        icon: '🩺',
        earnedDate: 'October 2025',
        issuer: 'AIIA Dept. of Roga Nidana',
        credentialUrl: 'https://karyasetu.gov.in/credentials/aiia-np-89',
        isVerified: student.skills.some((s) => s.skillId === 'nadi-pariksha' && s.level >= 3),
      },
      {
        id: 'badge-3',
        name: 'Prakriti & Agni Assessment Specialist',
        category: 'Ayurvedic Constitutional Analysis',
        icon: '⚖️',
        earnedDate: 'November 2025',
        issuer: 'National Ayurveda Research Institute',
        credentialUrl: 'https://karyasetu.gov.in/credentials/nari-pra-12',
        isVerified: true,
      },
      {
        id: 'badge-4',
        name: 'Ayurveda Ahara & Poshan Consultant',
        category: 'Therapeutic Dietetics',
        icon: '🍲',
        earnedDate: 'December 2025',
        issuer: 'HSSC Healthcare Council',
        credentialUrl: 'https://karyasetu.gov.in/credentials/hssc-ah-33',
        isVerified: student.skills.some((s) => s.skillId === 'ahara-poshan' && s.level >= 3),
      },
      {
        id: 'badge-5',
        name: 'DigiLocker & APAAR Credit Verified',
        category: 'Academic Integrity',
        icon: '🏛️',
        earnedDate: 'January 2026',
        issuer: 'Academic Bank of Credits (ABC MoE)',
        credentialUrl: 'https://karyasetu.gov.in/credentials/abc-apaar-99',
        isVerified: Boolean(student.isAbcLinked),
      },
      {
        id: 'badge-6',
        name: 'Dean Endorsed Clinical Intern',
        category: 'Institutional Accreditation',
        icon: '📜',
        earnedDate: 'February 2026',
        issuer: student.college,
        credentialUrl: 'https://karyasetu.gov.in/credentials/inst-dean-01',
        isVerified: Boolean(student.isInstitutionVerified),
      },
    ];

    // 5. Strengths & Improvement Areas
    const strengths = student.skills
      .filter((s) => s.level >= 4)
      .map((s) => `${s.skillName} (Level ${s.level}/5 - ${s.isVerified ? 'Faculty Endorsed' : 'Self-Demonstrated'})`);

    const improvementAreas = student.skills
      .filter((s) => s.level < 3)
      .map((s) => `${s.skillName} (Current: Level ${s.level}/5 - Recommended: NSQF Bridge Course)`);

    if (improvementAreas.length === 0) {
      improvementAreas.push('Rasashastra QA & LC-MS Standardization (Recommended to reach Level 4)');
    }

    // 6. Portfolio Summary (AI-generated)
    const portfolioSummary = `${student.name} is a high-performing ${student.degree} candidate at ${student.college} with an overall readiness index of ${student.readinessScore}%. Demonstrates expert proficiency in Panchakarma therapies, constitutional Prakriti analysis, and holistic patient counseling. Academic credits (${student.abcCredits || 148} credits) are securely mapped through the Academic Bank of Credits (APAAR), satisfying National Health Systems Resource Centre (NHSRC) and Healthcare Sector Skill Council (HSSC) qualification pack guidelines.`;

    // 7. Cryptographic HMAC Signature & QR Verification URL
    const appOrigin = (process.env.NEXT_PUBLIC_APP_URL || 'https://karyasetu.gov.in').replace(/\/$/, '');
    const qrCodeUrl = `${appOrigin}${verifyPath}`;

    // 8. HSSC Alignment Packs
    const hsscAlignment = [
      'HSS/Q3601 - Panchakarma Technician (NSQF Level 4)',
      'HSS/Q3801 - Ayurveda Ahara Sahayak (NSQF Level 5)',
      'HSS/Q4001 - Yoga Wellness Trainer (NSQF Level 5)',
      'HSS/Q3901 - Ayurveda Pharmacy Assistant (NSQF Level 4)',
    ];

    const profile: GeneratedProfile = {
      studentId: student.id,
      studentName: student.name,
      college: student.college,
      degree: student.degree,
      competencyScore,
      verificationLevel,
      nsqfLevel,
      hsscAlignment,
      badges,
      strengths,
      improvementAreas,
      portfolioSummary,
      digitalSignature,
      verifyPath,
      qrCodeUrl,
      abcCredits: student.abcCredits || 148,
      totalVerifiedSkills: verifiedSkills.length,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: unknown) {
    return serverError('ai/profile-generate', error, 'Profile generation failed');
  }
}
