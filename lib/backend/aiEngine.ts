import { Opportunity, StudentSkill, SkillGapItem } from '../matchingEngine';
import { StudentProfile } from '../seedData';

/**
 * High-Performance AI Matching Engine v2
 * Layer 1: Vector Cosine Similarity (multidimensional skill space)
 * Layer 2: Content-Based Filtering (TF-IDF style keyword overlap)
 * Layer 3: Domain Affinity Scoring (interest + mode alignment)
 */

// Universal skill feature dimension vocabulary (15-dimensional AYUSH space)
export const SKILL_FEATURE_VOCABULARY: string[] = [
  'panchakarma-therapy',
  'patient-counseling',
  'nadi-pariksha',
  'prakriti-evaluation',
  'ahara-poshan',
  'dravyaguna-identification',
  'rasashastra-qa',
  'clinical-documentation',
  'hplc-standardisation',
  'botanical-fingerprinting',
  'clinical-research',
  'pharmacovigilance',
  'ayurvedic-formulation',
  'good-manufacturing-practices',
  'nabh-protocols',
];

// Domain keyword corpus for content-based filtering (TF-IDF style)
const DOMAIN_KEYWORD_CORPUS: Record<string, string[]> = {
  panchakarma: ['panchakarma', 'panchkarma', 'detox', 'vamana', 'virechana', 'basti', 'nasya', 'raktamokshana', 'shodhana'],
  clinical: ['clinical', 'patient', 'hospital', 'ward', 'OPD', 'IPD', 'diagnosis', 'treatment', 'therapy', 'medical'],
  research: ['research', 'clinical trial', 'study', 'RCT', 'GCP', 'pharmacology', 'analysis', 'data', 'publication'],
  pharmacy: ['pharmacy', 'formulation', 'QA', 'QC', 'manufacturing', 'GMP', 'bhasma', 'rasashastra', 'herbal', 'HPLC'],
  nutrition: ['nutrition', 'diet', 'ahara', 'poshan', 'prakriti', 'lifestyle', 'wellness', 'dosha', 'agni'],
  digital: ['digital', 'EHR', 'records', 'ABDM', 'health tech', 'telemedicine', 'software'],
  yoga: ['yoga', 'pranayama', 'asana', 'meditation', 'therapy', 'wellness', 'shatkriya'],
  botany: ['botany', 'herb', 'plant', 'dravyaguna', 'identification', 'taxonomy', 'pharmacognosy'],
};

/**
 * Content-Based Filtering — TF-IDF Keyword Overlap
 * Computes semantic similarity between student's bio/interests and opportunity text.
 * Returns a Jaccard-style coefficient in [0, 1]
 */
export function computeContentSimilarity(student: StudentProfile, opportunity: Opportunity): number {
  const studentText = [
    student.bio || '',
    ...(student.interests || []),
    ...student.skills.map((s) => s.skillName),
  ]
    .join(' ')
    .toLowerCase();

  const oppText = [
    opportunity.title || '',
    opportunity.company || '',
    ...(opportunity.targetDomain || []),
    ...opportunity.requiredSkills.map((s) => s.skillName),
  ]
    .join(' ')
    .toLowerCase();

  let matchedKeywords = 0;
  let totalKeywords = 0;

  for (const keywords of Object.values(DOMAIN_KEYWORD_CORPUS)) {
    for (const keyword of keywords) {
      totalKeywords++;
      const studentHas = studentText.includes(keyword.toLowerCase());
      const oppHas = oppText.includes(keyword.toLowerCase());
      if (studentHas && oppHas) matchedKeywords++;
    }
  }

  return totalKeywords > 0 ? matchedKeywords / totalKeywords : 0;
}

export interface FeatureVector {
  dimensions: number[];
  norm: number;
}

/**
 * Converts a student profile into a normalized mathematical feature vector
 */
export function vectorizeStudent(student: StudentProfile): FeatureVector {
  const skillLevelMap = new Map<string, number>();
  student.skills.forEach((s) => {
    // Verified skills get an institutional credibility boost (+0.5)
    const credibilityMultiplier = s.isVerified ? 1.1 : 1.0;
    skillLevelMap.set(s.skillId, Math.min(5, s.level * credibilityMultiplier));
  });

  const dimensions: number[] = SKILL_FEATURE_VOCABULARY.map((skillId) => {
    return skillLevelMap.get(skillId) || 0;
  });

  // Calculate Euclidean Norm ||A|| = sqrt(sum(x_i^2))
  let sumSq = 0;
  dimensions.forEach((val) => (sumSq += val * val));
  const norm = Math.sqrt(sumSq);

  return { dimensions, norm };
}

/**
 * Converts an opportunity's requirements into an importance-weighted feature vector
 */
export function vectorizeOpportunity(opportunity: Opportunity): FeatureVector {
  const reqMap = new Map<string, { level: number; weight: number }>();
  opportunity.requiredSkills.forEach((req) => {
    reqMap.set(req.skillId, {
      level: req.requiredLevel,
      weight: req.importanceWeight,
    });
  });

  const dimensions: number[] = SKILL_FEATURE_VOCABULARY.map((skillId) => {
    const item = reqMap.get(skillId);
    if (!item) return 0;
    // Weight scales the vector coordinate importance in n-dimensional Euclidean space
    return item.level * (item.weight / 3.0);
  });

  let sumSq = 0;
  dimensions.forEach((val) => (sumSq += val * val));
  const norm = Math.sqrt(sumSq);

  return { dimensions, norm };
}

/**
 * Computes Pure Cosine Similarity:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 * Value range: [0, 1]
 */
export function computeCosineSimilarity(vecA: FeatureVector, vecB: FeatureVector): number {
  if (vecA.norm === 0 || vecB.norm === 0) return 0;

  let dotProduct = 0;
  for (let i = 0; i < vecA.dimensions.length; i++) {
    dotProduct += vecA.dimensions[i] * vecB.dimensions[i];
  }

  const similarity = dotProduct / (vecA.norm * vecB.norm);
  // Bound to [0, 1]
  return Math.max(0, Math.min(1, similarity));
}

export interface AIMatchResult {
  opportunity: Opportunity;
  cosineSimilarity: number;              // Layer 1: Vector dot product similarity (0 - 1)
  contentFilteringSimilarity: number;    // Layer 2: TF-IDF keyword overlap (0 - 1)
  compositeMatchScore: number;           // Normalized composite percentage (0 - 100%)
  matchedCompetencies: {
    skillId: string;
    skillName: string;
    studentLevel: number;
    requiredLevel: number;
    alignment: 'Superior' | 'Optimal' | 'Developing' | 'Deficit';
  }[];
  criticalGaps: SkillGapItem[];
  explainableReasoning: string;
  recommendationRoadmap: {
    bridgeCourseTitle: string;
    targetGain: string;
    estimatedWeeks: number;
  }[];
}

/**
 * AI Recommendation Ranker
 * Evaluates candidate against a library of opportunities using vector cosine similarity
 * fused with domain eligibility and mode affinity.
 */
export function rankOpportunitiesWithAI(
  student: StudentProfile,
  opportunities: Opportunity[]
): AIMatchResult[] {
  const studentVec = vectorizeStudent(student);

  const ranked = opportunities.map((opp) => {
    const oppVec = vectorizeOpportunity(opp);
    // Layer 1: Vector Cosine Similarity
    const cosine = computeCosineSimilarity(studentVec, oppVec);

    // Layer 2: Content-Based Filtering (TF-IDF keyword overlap)
    const contentSim = computeContentSimilarity(student, opp);

    // Layer 3: Domain Affinity Bonus
    let domainBonus = 0;
    if (opp.targetDomain.some((d) => student.interests.includes(d))) {
      domainBonus += 0.08;
    }
    if (opp.mode === student.preferredMode || opp.mode === 'Hybrid') {
      domainBonus += 0.05;
    }

    // Composite Score: 55% Vector Cosine + 25% Content Filtering + 20% Domain Affinity
    const compositeScore = Math.min(99, Math.round((cosine * 0.55 + contentSim * 0.25 + domainBonus * 0.20) * 100));

    // Analyze competency alignment
    const studentSkillMap = new Map(student.skills.map((s) => [s.skillId, s]));
    const matchedCompetencies = opp.requiredSkills.map((req) => {
      const studentSkill = studentSkillMap.get(req.skillId);
      const studentLevel = studentSkill ? studentSkill.level : 0;
      let alignment: 'Superior' | 'Optimal' | 'Developing' | 'Deficit' = 'Deficit';
      if (studentLevel > req.requiredLevel) alignment = 'Superior';
      else if (studentLevel === req.requiredLevel) alignment = 'Optimal';
      else if (studentLevel >= req.requiredLevel - 1) alignment = 'Developing';

      return {
        skillId: req.skillId,
        skillName: req.skillName,
        studentLevel,
        requiredLevel: req.requiredLevel,
        alignment,
      };
    });

    // Identify critical gaps
    const criticalGaps: SkillGapItem[] = opp.requiredSkills
      .filter((req) => {
        const studentSkill = studentSkillMap.get(req.skillId);
        const studentLevel = studentSkill ? studentSkill.level : 0;
        return studentLevel < req.requiredLevel;
      })
      .map((req) => {
        const studentSkill = studentSkillMap.get(req.skillId);
        const studentLevel = studentSkill ? studentSkill.level : 0;
        const diff = req.requiredLevel - studentLevel;
        return {
          skillId: req.skillId,
          skillName: req.skillName,
          requiredLevel: req.requiredLevel,
          studentLevel,
          importance: req.importanceWeight,
          gapScore: diff * req.importanceWeight,
          severity: diff * req.importanceWeight >= 8 ? 'High' : diff * req.importanceWeight >= 4 ? 'Medium' : 'Low',
          recommendationAction: `Complete Bridge Course: ${req.skillName} Proficiency (Target ${req.requiredLevel}/5)`,
        };
      });

    // Explainability reasoning
    const topStrength = matchedCompetencies.find((c) => c.alignment === 'Superior' || c.alignment === 'Optimal');
    const primaryDeficit = criticalGaps[0];

    let reasoning = `High vector alignment (${Math.round(cosine * 100)}% Cosine). `;
    if (topStrength) {
      reasoning += `Strong core foundation in ${topStrength.skillName} (Level ${topStrength.studentLevel}/5). `;
    }
    if (primaryDeficit) {
      reasoning += `Remedial action recommended for ${primaryDeficit.skillName} to satisfy recruitment criteria.`;
    } else {
      reasoning += `Exceeds minimum clinical competencies across all stated requirements.`;
    }

    const recommendationRoadmap = criticalGaps.map((gap) => ({
      bridgeCourseTitle: `NSQF Bridge: Advanced ${gap.skillName}`,
      targetGain: `+${gap.requiredLevel - gap.studentLevel} Skill Level`,
      estimatedWeeks: Math.max(2, (gap.requiredLevel - gap.studentLevel) * 2),
    }));

    return {
      opportunity: opp,
      cosineSimilarity: Number(cosine.toFixed(4)),
      contentFilteringSimilarity: Number(contentSim.toFixed(4)),
      compositeMatchScore: compositeScore,
      matchedCompetencies,
      criticalGaps,
      explainableReasoning: reasoning,
      recommendationRoadmap,
    };
  });

  return ranked.sort((a, b) => b.compositeMatchScore - a.compositeMatchScore);
}
