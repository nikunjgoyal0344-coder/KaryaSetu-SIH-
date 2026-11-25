import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { AYUSH_SKILLS_TAXONOMY } from '@/lib/taxonomy';
import { isAllowedEnum, sanitizeString } from '@/lib/security';
import { badRequest, getRestrictedCorsHeaders, parseJsonBody, serverError } from '@/lib/apiHelpers';

/**
 * Bridge course catalog for AI-driven gap remediation recommendations.
 * Each entry describes a specific course that closes a skill-level gap.
 */
const BRIDGE_COURSES: Record<
  string,
  { title: string; provider: string; durationWeeks: number; difficulty: string }
> = {
  'panchakarma-therapy': {
    title: 'Advanced Panchakarma Clinical Practicum (Vamana, Virechana, Basti)',
    provider: 'National Ayurveda Research Institute (NARI)',
    durationWeeks: 4,
    difficulty: 'Intermediate',
  },
  'nadi-pariksha': {
    title: 'Advanced Sphygmology & Dosha Rhythmics Clinical Masterclass',
    provider: 'AIIA Dept. of Roga Nidana',
    durationWeeks: 3,
    difficulty: 'Advanced',
  },
  'dravyaguna-identification': {
    title: 'Field Botany, Herbarium Curation & Raw Drug Macro/Microscopy',
    provider: 'National Medicinal Plants Board (NMPB) & CCRAS',
    durationWeeks: 3,
    difficulty: 'Intermediate',
  },
  'ahara-poshan': {
    title: 'Prakriti-Based Therapeutic Nutrition Protocols & Clinical Ahara',
    provider: 'AIIA Center for Integrative Nutrition',
    durationWeeks: 3,
    difficulty: 'Intermediate',
  },
  'prakriti-evaluation': {
    title: 'Comprehensive Prakriti & Agni Assessment Clinical Module',
    provider: 'Gujarat Ayurved University (GAU)',
    durationWeeks: 2,
    difficulty: 'Intermediate',
  },
  'clinical-documentation': {
    title: 'National Ayush Morbidity Codes (NAMASTE) & WHO ICD-11 Integration',
    provider: 'Ministry of Ayush Digital Health Mission',
    durationWeeks: 2,
    difficulty: 'Beginner',
  },
  'rasashastra-qa': {
    title: 'Ayurvedic Pharmacopeia & Bhasma Quality Control Certification',
    provider: 'Pharmacopoeia Commission for Indian Medicine & Homeopathy (PCIM&H)',
    durationWeeks: 4,
    difficulty: 'Intermediate',
  },
  'yoga-therapy': {
    title: 'Therapeutic Yoga & Pranayama Clinical Protocols for Metabolic Disorders',
    provider: 'Morarji Desai National Institute of Yoga (MDNIY)',
    durationWeeks: 3,
    difficulty: 'Intermediate',
  },
  'patient-counseling': {
    title: 'Holistic Communication & Motivational Interviewing for AYUSH Clinicians',
    provider: 'National Institute of Mental Health & Neurosciences (NIMHANS)',
    durationWeeks: 2,
    difficulty: 'Beginner',
  },
  'research-methodology': {
    title: 'GCP & RCT Design for Herbal Therapeutics (ICMR-Accredited)',
    provider: 'CSIR - Central Drug Research Institute (CDRI)',
    durationWeeks: 3,
    difficulty: 'Advanced',
  },
};

// 8 core AYUSH skills used for gap analysis benchmark
const CORE_SKILL_IDS = [
  'panchakarma-therapy',
  'nadi-pariksha',
  'dravyaguna-identification',
  'ahara-poshan',
  'prakriti-evaluation',
  'clinical-documentation',
  'rasashastra-qa',
  'yoga-therapy',
];

// AYUSH industry benchmark target proficiency levels
const TARGET_LEVELS: Record<string, number> = {
  'panchakarma-therapy': 4,
  'nadi-pariksha': 4,
  'dravyaguna-identification': 3,
  'ahara-poshan': 4,
  'prakriti-evaluation': 4,
  'clinical-documentation': 3,
  'rasashastra-qa': 3,
  'yoga-therapy': 3,
};

const CORS_HEADERS = getRestrictedCorsHeaders('POST, OPTIONS');

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

const VALID_QUIZ_TYPES = ['theory', 'practical'] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody<{
      studentId?: unknown;
      skillId?: unknown;
      answers?: unknown;
      quizType?: unknown;
    }>(req);

    if (!body) {
      return badRequest('Invalid JSON request body', CORS_HEADERS);
    }

    const skillId = sanitizeString(body.skillId, 80);
    const answers = body.answers;
    const quizType = isAllowedEnum(body.quizType, VALID_QUIZ_TYPES) ? body.quizType : 'theory';

    // --- Validation ---
    if (!skillId || !Array.isArray(answers) || answers.length === 0) {
      return badRequest('Invalid request body. skillId and answers are required.', CORS_HEADERS);
    }
    if (answers.length > 5) {
      return badRequest('Maximum 5 answers allowed per assessment.', CORS_HEADERS);
    }
    for (const score of answers) {
      if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 4) {
        return badRequest('Each answer score must be a finite number between 0 and 4.', CORS_HEADERS);
      }
    }

    // --- Compute new proficiency level from quiz scores ---
    const totalScore = answers.reduce((sum, s) => sum + s, 0);
    const maxPossibleScore = answers.length * 4;
    const newLevel = Math.max(1, Math.min(5, Math.round((totalScore / maxPossibleScore) * 5)));

    // --- Fetch current student state ---
    const student = db.getStudent();
    const existingSkill = student.skills.find((s) => s.skillId === skillId);
    const oldLevel = existingSkill ? existingSkill.level : 0;

    // --- Only persist when there is a level gain (never regress) ---
    const levelGain = Math.max(0, newLevel - oldLevel);
    let updatedStudent = student;
    if (levelGain > 0) {
      updatedStudent = db.updateSkillLevel(skillId, levelGain);
    }

    // --- Build fresh skill map from the (potentially updated) student ---
    const updatedSkillMap = new Map<string, number>();
    updatedStudent.skills.forEach((s) => updatedSkillMap.set(s.skillId, s.level));

    // --- Gap Analysis across ALL 8 core AYUSH skills ---
    const gapAnalysis = CORE_SKILL_IDS.map((coreSkillId) => {
      const taxonomyEntry = AYUSH_SKILLS_TAXONOMY.find((t) => t.id === coreSkillId);
      const currentLevel = updatedSkillMap.get(coreSkillId) ?? 0;
      const targetLevel = TARGET_LEVELS[coreSkillId] ?? 3;
      const gap = Math.max(0, targetLevel - currentLevel);
      const bridgeCourse = BRIDGE_COURSES[coreSkillId];

      return {
        skillId: coreSkillId,
        skillName: taxonomyEntry?.name ?? coreSkillId,
        currentLevel,
        targetLevel,
        gap,
        bridgeCourse:
          gap > 0 && bridgeCourse
            ? {
                title: bridgeCourse.title,
                provider: bridgeCourse.provider,
                difficulty: bridgeCourse.difficulty,
              }
            : null,
        weeksNeeded: gap > 0 && bridgeCourse ? bridgeCourse.durationWeeks * gap : 0,
      };
    });

    // --- Build contextual notification message ---
    const assessedSkillName =
      AYUSH_SKILLS_TAXONOMY.find((t) => t.id === skillId)?.name ?? skillId;
    let notification: string;
    if (levelGain > 0) {
      notification = `🎉 Level Up! Your ${assessedSkillName} proficiency advanced from Level ${oldLevel} to Level ${newLevel}. Readiness score updated to ${updatedStudent.readinessScore}%.`;
    } else if (newLevel > 0 && newLevel <= oldLevel) {
      notification = `✅ Assessment complete. Your ${assessedSkillName} level is confirmed at Level ${oldLevel}. Keep practising to level up!`;
    } else {
      notification = `📊 Assessment recorded. Complete more practice exercises to improve your ${assessedSkillName} proficiency.`;
    }

    return NextResponse.json(
      {
        success: true,
        newLevel,
        oldLevel,
        levelGain,
        quizType: quizType ?? 'theory',
        gapAnalysis,
        updatedReadinessScore: updatedStudent.readinessScore,
        notification,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    return serverError('ai/assessment', error, 'Internal server error', CORS_HEADERS);
  }
}
