export interface StudentSkill {
  skillId: string;
  skillName: string;
  level: number; // 1 to 5
  isVerified?: boolean;
  endorsedBy?: string;
}

export interface OpportunityRequiredSkill {
  skillId: string;
  skillName: string;
  requiredLevel: number; // 1 to 5
  importanceWeight: number; // 1 to 5 (5 is critical)
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  category: 'Internship' | 'Entry-Level Job' | 'Live Project' | 'Faculty FDP';
  location: string;
  mode: 'On-site' | 'Remote' | 'Hybrid';
  duration: string;
  stipend: string;
  requiredSkills: OpportunityRequiredSkill[];
  minEligibility: string;
  targetDomain: string[];
  description: string;
  postedAt: string;
  applicantsCount: number;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  requiredLevel: number;
  studentLevel: number;
  importance: number;
  gapScore: number;
  severity: 'High' | 'Medium' | 'Low' | 'None';
  recommendationAction: string;
}

export interface MatchBreakdown {
  overallScore: number; // 0 - 100%
  factors: {
    skillMatchPercentage: number; // 45% weight
    proficiencyScore: number;     // 20% weight
    interestMatchScore: number;   // 15% weight
    modeMatchScore: number;       // 10% weight
    eligibilityScore: number;     // 10% weight
  };
  matchedSkillsCount: number;
  totalRequiredSkills: number;
  matchedSkillsList: { name: string; studentLevel: number; requiredLevel: number; met: boolean }[];
  missingCriticalSkills: string[];
  reasoning: string;
}

/**
 * Calculates Skill Gap Score
 * Gap Score = Importance * max(0, Required Level - Student Level)
 */
export function calculateSkillGaps(
  studentSkills: StudentSkill[],
  targetRoleRequirements: OpportunityRequiredSkill[]
): SkillGapItem[] {
  const studentMap = new Map<string, StudentSkill>();
  studentSkills.forEach((s) => studentMap.set(s.skillId, s));

  const gaps: SkillGapItem[] = targetRoleRequirements.map((req) => {
    const studentSkill = studentMap.get(req.skillId);
    const studentLvl = studentSkill ? studentSkill.level : 0;
    const diff = Math.max(0, req.requiredLevel - studentLvl);
    const gapScore = req.importanceWeight * diff;

    let severity: 'High' | 'Medium' | 'Low' | 'None' = 'None';
    if (gapScore >= 8) severity = 'High';
    else if (gapScore >= 4) severity = 'Medium';
    else if (gapScore > 0) severity = 'Low';

    let action = 'Skill benchmark met.';
    if (diff > 0) {
      action = `Complete 2-4 week practical training module in ${req.skillName} (Target Level: ${req.requiredLevel}/5)`;
    }

    return {
      skillId: req.skillId,
      skillName: req.skillName,
      requiredLevel: req.requiredLevel,
      studentLevel: studentLvl,
      importance: req.importanceWeight,
      gapScore,
      severity,
      recommendationAction: action,
    };
  });

  return gaps.sort((a, b) => b.gapScore - a.gapScore);
}

/**
 * Computes the Transparent Weighted Compatibility Match Score (0 - 100%)
 */
export function computeOpportunityMatch(
  student: {
    skills: StudentSkill[];
    interests: string[];
    preferredMode?: 'On-site' | 'Remote' | 'Hybrid';
    preferredLocation?: string;
    course?: string;
    degree?: string;
    year?: string;
    cgpa: number;
  },
  opportunity: Opportunity
): MatchBreakdown {
  const reqSkills = opportunity.requiredSkills;
  if (!reqSkills || reqSkills.length === 0) {
    return {
      overallScore: 80,
      factors: {
        skillMatchPercentage: 80,
        proficiencyScore: 80,
        interestMatchScore: 80,
        modeMatchScore: 80,
        eligibilityScore: 80,
      },
      matchedSkillsCount: 0,
      totalRequiredSkills: 0,
      matchedSkillsList: [],
      missingCriticalSkills: [],
      reasoning: 'General open opportunity matching student broad profile.',
    };
  }

  const studentSkillMap = new Map<string, StudentSkill>();
  student.skills.forEach((s) => studentSkillMap.set(s.skillId, s));

  let matchedCount = 0;
  let totalProficiencyRatio = 0;
  const matchedSkillsList: { name: string; studentLevel: number; requiredLevel: number; met: boolean }[] = [];
  const missingCriticalSkills: string[] = [];

  reqSkills.forEach((req) => {
    const sSkill = studentSkillMap.get(req.skillId);
    if (sSkill && sSkill.level > 0) {
      matchedCount++;
      const ratio = Math.min(1.0, sSkill.level / req.requiredLevel);
      totalProficiencyRatio += ratio;
      matchedSkillsList.push({
        name: req.skillName,
        studentLevel: sSkill.level,
        requiredLevel: req.requiredLevel,
        met: sSkill.level >= req.requiredLevel,
      });
      if (sSkill.level < req.requiredLevel && req.importanceWeight >= 4) {
        missingCriticalSkills.push(`${req.skillName} (Has Level ${sSkill.level}, needs Level ${req.requiredLevel})`);
      }
    } else {
      matchedSkillsList.push({
        name: req.skillName,
        studentLevel: 0,
        requiredLevel: req.requiredLevel,
        met: false,
      });
      if (req.importanceWeight >= 4) {
        missingCriticalSkills.push(req.skillName);
      }
    }
  });

  // Factor 1: Skill Coverage Match (45%)
  const skillCoveragePct = (matchedCount / reqSkills.length) * 100;

  // Factor 2: Proficiency Level Compatibility (20%)
  const avgProficiencyPct = matchedCount > 0 ? (totalProficiencyRatio / reqSkills.length) * 100 : 0;

  // Factor 3: Career Interest Match (15%)
  const hasInterestMatch = opportunity.targetDomain.some((domain) =>
    student.interests.some((i) => i.toLowerCase().includes(domain.toLowerCase()) || domain.toLowerCase().includes(i.toLowerCase()))
  );
  const interestScore = hasInterestMatch ? 100 : 60;

  // Factor 4: Mode / Location (10%)
  const modeScore = (student.preferredMode === opportunity.mode || opportunity.mode === 'Hybrid') ? 100 : 70;

  // Factor 5: Eligibility (10%)
  const eligibilityScore = student.cgpa >= 7.0 ? 100 : 80;

  // Weighted sum
  const weightedSum =
    skillCoveragePct * 0.45 +
    avgProficiencyPct * 0.20 +
    interestScore * 0.15 +
    modeScore * 0.10 +
    eligibilityScore * 0.10;

  const overallScore = Math.min(99, Math.max(25, Math.round(weightedSum)));

  let reasoning = `High compatibility with ${matchedCount}/${reqSkills.length} required competencies matched.`;
  if (missingCriticalSkills.length > 0) {
    reasoning += ` Priority growth area: ${missingCriticalSkills.slice(0, 2).join(', ')}.`;
  }

  return {
    overallScore,
    factors: {
      skillMatchPercentage: Math.round(skillCoveragePct),
      proficiencyScore: Math.round(avgProficiencyPct),
      interestMatchScore: interestScore,
      modeMatchScore: modeScore,
      eligibilityScore,
    },
    matchedSkillsCount: matchedCount,
    totalRequiredSkills: reqSkills.length,
    matchedSkillsList,
    missingCriticalSkills,
    reasoning,
  };
}
