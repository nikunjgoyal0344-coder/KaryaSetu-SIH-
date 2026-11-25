import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { AYUSH_SKILLS_TAXONOMY } from '@/lib/taxonomy';
import { serverError } from '@/lib/apiHelpers';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LearningRecommendation {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium';
  courseTitle: string;
  provider: string;
  duration: string;
  nsqfLevel: string;
  creditHours: number;
  mode: 'Online' | 'Hands-on' | 'Blended';
  url: string;
}

export interface CareerPathway {
  title: string;
  description: string;
  requiredSkills: string[];
  estimatedSalary: string;
  demandLevel: 'Rising' | 'High' | 'Very High';
  openingsCount: number;
}

// ─── Course Catalogue (Static Bridge Modules mapped to AYUSH skill IDs) ──────

const COURSE_CATALOGUE: Record<
  string,
  {
    courseTitle: string;
    provider: string;
    duration: string;
    nsqfLevel: string;
    creditHours: number;
    mode: 'Online' | 'Hands-on' | 'Blended';
    url: string;
  }
> = {
  'panchakarma-therapy': {
    courseTitle: 'Advanced Panchakarma Clinical Protocols & Karma Certification',
    provider: 'National Institute of Ayurveda (NIA), Jaipur',
    duration: '6 Weeks',
    nsqfLevel: 'NSQF Level 6',
    creditHours: 16,
    mode: 'Hands-on',
    url: 'https://nia.nic.in',
  },
  'nadi-pariksha': {
    courseTitle: 'Advanced Sphygmology & Dosha Rhythmics Clinical Masterclass',
    provider: 'AIIA Dept. of Roga Nidana',
    duration: '3 Weeks',
    nsqfLevel: 'NSQF Level 7',
    creditHours: 8,
    mode: 'Hands-on',
    url: 'https://aiia.gov.in',
  },
  'prakriti-evaluation': {
    courseTitle: 'Computational Prakriti Assessment & Agni Vikrti Analysis',
    provider: 'CCRAS – Central Council for Research in Ayurvedic Sciences',
    duration: '2 Weeks',
    nsqfLevel: 'NSQF Level 6',
    creditHours: 6,
    mode: 'Blended',
    url: 'https://ccras.nic.in',
  },
  'ahara-poshan': {
    courseTitle: 'Prakriti-Based Therapeutic Nutrition Protocols & Clinical Ahara',
    provider: 'AIIA Center for Integrative Nutrition',
    duration: '3 Weeks',
    nsqfLevel: 'NSQF Level 6',
    creditHours: 8,
    mode: 'Online',
    url: 'https://aiia.gov.in',
  },
  'dravyaguna-identification': {
    courseTitle: 'Field Botany, Herbarium Curation & Raw Drug Macro/Microscopy',
    provider: 'National Medicinal Plants Board (NMPB) & CCRAS',
    duration: '3 Weeks',
    nsqfLevel: 'NSQF Level 6',
    creditHours: 10,
    mode: 'Hands-on',
    url: 'https://nmpb.nic.in',
  },
  'clinical-documentation': {
    courseTitle: 'NAMASTE Portal & WHO ICD-11 TM-2 Integration for AyushGrid',
    provider: 'Ministry of Ayush Digital Health Mission',
    duration: '2 Weeks',
    nsqfLevel: 'NSQF Level 5',
    creditHours: 4,
    mode: 'Online',
    url: 'https://ayush.gov.in',
  },
  'rasashastra-qa': {
    courseTitle: 'Ayurvedic Pharmacopeia & Bhasma Quality Control Certification',
    provider: 'Pharmacopoeia Commission for Indian Medicine & Homeopathy (PCIM&H)',
    duration: '4 Weeks',
    nsqfLevel: 'NSQF Level 6',
    creditHours: 12,
    mode: 'Blended',
    url: 'https://pcimh.gov.in',
  },
  'yoga-therapy': {
    courseTitle: 'Evidence-Based Therapeutic Yoga & Pranayama for Chronic Disease',
    provider: 'Morarji Desai National Institute of Yoga (MDNIY)',
    duration: '4 Weeks',
    nsqfLevel: 'NSQF Level 5',
    creditHours: 10,
    mode: 'Hands-on',
    url: 'https://yogamdniy.nic.in',
  },
  'patient-counseling': {
    courseTitle: 'Motivational Interviewing & Holistic Patient Communication',
    provider: 'HSSC – Healthcare Sector Skill Council',
    duration: '2 Weeks',
    nsqfLevel: 'NSQF Level 5',
    creditHours: 6,
    mode: 'Online',
    url: 'https://hssc.net.in',
  },
  'research-methodology': {
    courseTitle: 'GCP Compliance & RCT Design for Ayurvedic Clinical Trials',
    provider: 'ICMR – Indian Council of Medical Research',
    duration: '5 Weeks',
    nsqfLevel: 'NSQF Level 7',
    creditHours: 14,
    mode: 'Online',
    url: 'https://icmr.gov.in',
  },
};

// ─── Career Pathways ──────────────────────────────────────────────────────────

const CAREER_PATHWAYS: CareerPathway[] = [
  {
    title: 'Panchakarma Specialist',
    description:
      'Lead detoxification and rejuvenation programs in Ayurvedic hospitals and wellness retreats. Manage IPD/OPD Panchakarma wards, supervise junior therapists, and design patient-specific Shodhana protocols.',
    requiredSkills: ['Panchakarma Therapy Procedures', 'Nadi Pariksha', 'Prakriti & Agni Assessment', 'Patient Counseling'],
    estimatedSalary: '₹4.5L – ₹9.5L / year',
    demandLevel: 'Very High',
    openingsCount: 320,
  },
  {
    title: 'Ayurveda Clinical Researcher',
    description:
      'Design and conduct clinical trials on herbal formulations and AYUSH interventions under GCP compliance. Collaborate with CCRAS, ICMR, and international institutions for evidence-based Ayurveda research.',
    requiredSkills: ['Clinical Trial Methodology', 'Dravyaguna Identification', 'Rasashastra QA', 'AyushGrid EHR'],
    estimatedSalary: '₹5.5L – ₹12L / year',
    demandLevel: 'High',
    openingsCount: 145,
  },
  {
    title: 'Integrative Medicine Practitioner',
    description:
      'Practice evidence-integrated healthcare combining Ayurveda with modern diagnostics. Consult in corporate wellness, multispecialty hospitals, and international wellness centres. High global demand.',
    requiredSkills: ['Prakriti & Agni Assessment', 'Patient Counseling', 'Ahara & Poshan', 'Therapeutic Yoga'],
    estimatedSalary: '₹6L – ₹18L / year',
    demandLevel: 'Very High',
    openingsCount: 480,
  },
  {
    title: 'AYUSH Quality Assurance Officer',
    description:
      'Oversee GMP compliance, Bhasma standardization, and pharmacovigilance at Ayurvedic pharma companies. Work with PCIM&H, API standards, and Ministry of Ayush licensing bodies.',
    requiredSkills: ['Rasashastra & Formulation QA', 'Dravyaguna Identification', 'Clinical Documentation', 'Research Methodology'],
    estimatedSalary: '₹5L – ₹11L / year',
    demandLevel: 'Rising',
    openingsCount: 210,
  },
];

// ─── Priority Logic ───────────────────────────────────────────────────────────

function getPriority(gap: number, currentLevel: number): 'Critical' | 'High' | 'Medium' {
  if (gap >= 3 || currentLevel === 0) return 'Critical';
  if (gap >= 2) return 'High';
  return 'Medium';
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/recommend-learning
 * Generates a personalized AYUSH learning path for the student
 * based on skill gap analysis against NSQF Level 4 industry-readiness targets.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const studentId: string | undefined = body.studentId;

    const student = db.getStudent();
    if (studentId && student.id !== studentId) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const studentSkillMap = new Map(student.skills.map((s) => [s.skillId, s.level]));

    const TARGET_LEVEL = 4;
    const coreSkillIds = [
      'panchakarma-therapy',
      'nadi-pariksha',
      'prakriti-evaluation',
      'ahara-poshan',
      'dravyaguna-identification',
      'clinical-documentation',
      'rasashastra-qa',
      'patient-counseling',
    ];

    const recommendations: LearningRecommendation[] = [];

    for (const skillId of coreSkillIds) {
      const currentLevel = studentSkillMap.get(skillId) ?? 0;
      const gap = Math.max(0, TARGET_LEVEL - currentLevel);

      if (gap <= 0) continue;

      const taxonomyItem = AYUSH_SKILLS_TAXONOMY.find((t) => t.id === skillId);
      const courseInfo = COURSE_CATALOGUE[skillId];
      if (!taxonomyItem || !courseInfo) continue;

      recommendations.push({
        skillId,
        skillName: taxonomyItem.name,
        currentLevel,
        targetLevel: TARGET_LEVEL,
        gap,
        priority: getPriority(gap, currentLevel),
        courseTitle: courseInfo.courseTitle,
        provider: courseInfo.provider,
        duration: courseInfo.duration,
        nsqfLevel: courseInfo.nsqfLevel,
        creditHours: courseInfo.creditHours,
        mode: courseInfo.mode,
        url: courseInfo.url,
      });
    }

    const priorityOrder = { Critical: 0, High: 1, Medium: 2 };
    recommendations.sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return b.gap - a.gap;
    });

    const totalCreditHours = recommendations.reduce((acc, r) => acc + r.creditHours, 0);
    const estimatedCompletionWeeks = Math.ceil((totalCreditHours / 8) * 0.6);

    return NextResponse.json({
      success: true,
      studentId: student.id,
      studentName: student.name,
      timestamp: new Date().toISOString(),
      recommendations,
      careerPathways: CAREER_PATHWAYS,
      estimatedCompletionWeeks,
    });
  } catch (error: unknown) {
    return serverError('ai/recommend-learning', error, 'Learning path generation failed');
  }
}

/**
 * GET /api/ai/recommend-learning
 * Convenience endpoint — returns learning path for the primary demo student.
 */
export async function GET() {
  const req = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: { 'Content-Type': 'application/json' },
  });
  return POST(req as unknown as NextRequest);
}
