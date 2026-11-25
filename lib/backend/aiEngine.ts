import type { Opportunity, SkillGapItem } from '../matchingEngine';
import type { StudentProfile } from '../seedData';

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

// Pre-compiled lowercased keyword array avoids repeated string normalization in hot ranking loops
const PRECOMPILED_KEYWORDS: readonly string[] = Object.values(DOMAIN_KEYWORD_CORPUS).flatMap((list) =>
  list.map((kw) => kw.toLowerCase())
);

function buildStudentSearchText(student: StudentProfile): string {
  return [
    student.bio || '',
    ...(student.interests || []),
    ...student.skills.map((s) => s.skillName),
  ]
    .join(' ')
    .toLowerCase();
}

function buildOpportunitySearchText(opportunity: Opportunity): string {
  return [
    opportunity.title || '',
    opportunity.company || '',
    ...(opportunity.targetDomain || []),
    ...opportunity.requiredSkills.map((s) => s.skillName),
    opportunity.description || '',
  ]
    .join(' ')
    .toLowerCase();
}

/**
 * Computes Jaccard similarity over pre-matched student keyword hits and opportunity text.
 */
function computeContentSimilarityFromMask(studentMatchedFlags: boolean[], oppText: string): number {
  let matchedKeywords = 0;
  let unionKeywords = 0;

  for (let i = 0; i < PRECOMPILED_KEYWORDS.length; i++) {
    const studentHas = studentMatchedFlags[i];
    const oppHas = oppText.includes(PRECOMPILED_KEYWORDS[i]);
    if (studentHas || oppHas) unionKeywords++;
    if (studentHas && oppHas) matchedKeywords++;
  }

  return unionKeywords > 0 ? matchedKeywords / unionKeywords : 0;
}

/**
 * Content-Based Filtering — TF-IDF Keyword Overlap
 * Computes semantic similarity between student's bio/interests and opportunity text.
 * Returns a Jaccard-style coefficient in [0, 1].
 */
export function computeContentSimilarity(student: StudentProfile, opportunity: Opportunity): number {
  const studentText = buildStudentSearchText(student);
  const oppText = buildOpportunitySearchText(opportunity);
  const studentFlags = PRECOMPILED_KEYWORDS.map((kw) => studentText.includes(kw));
  return computeContentSimilarityFromMask(studentFlags, oppText);
}

export interface FeatureVector {
  dimensions: number[];
  norm: number;
}

/**
 * Converts a student profile into a normalized mathematical feature vector.
 */
export function vectorizeStudent(student: StudentProfile): FeatureVector {
  const skillLevelMap = new Map<string, number>();
  for (const s of student.skills) {
    // Verified skills receive an institutional credibility multiplier
    const credibilityMultiplier = s.isVerified ? 1.1 : 1.0;
    skillLevelMap.set(s.skillId, Math.min(5, s.level * credibilityMultiplier));
  }

  const dimensions = new Array<number>(SKILL_FEATURE_VOCABULARY.length);
  let sumSq = 0;

  for (let i = 0; i < SKILL_FEATURE_VOCABULARY.length; i++) {
    const val = skillLevelMap.get(SKILL_FEATURE_VOCABULARY[i]) || 0;
    dimensions[i] = val;
    sumSq += val * val;
  }

  return { dimensions, norm: Math.sqrt(sumSq) };
}

/**
 * Converts an opportunity's requirements into an importance-weighted feature vector.
 */
export function vectorizeOpportunity(opportunity: Opportunity): FeatureVector {
  const reqMap = new Map<string, { level: number; weight: number }>();
  for (const req of opportunity.requiredSkills) {
    reqMap.set(req.skillId, {
      level: req.requiredLevel,
      weight: req.importanceWeight,
    });
  }

  const dimensions = new Array<number>(SKILL_FEATURE_VOCABULARY.length);
  let sumSq = 0;

  for (let i = 0; i < SKILL_FEATURE_VOCABULARY.length; i++) {
    const item = reqMap.get(SKILL_FEATURE_VOCABULARY[i]);
    const val = item ? item.level * (item.weight / 3.0) : 0;
    dimensions[i] = val;
    sumSq += val * val;
  }

  return { dimensions, norm: Math.sqrt(sumSq) };
}

/**
 * Computes Pure Cosine Similarity:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 * Value range: [0, 1]
 */
export function computeCosineSimilarity(vecA: FeatureVector, vecB: FeatureVector): number {
  if (vecA.norm === 0 || vecB.norm === 0) return 0;

  const len = Math.min(vecA.dimensions.length, vecB.dimensions.length);
  let dotProduct = 0;
  for (let i = 0; i < len; i++) {
    dotProduct += vecA.dimensions[i] * vecB.dimensions[i];
  }

  const similarity = dotProduct / (vecA.norm * vecB.norm);
  return Math.max(0, Math.min(1, similarity));
}

export interface AIMatchResult {
  opportunity: Opportunity;
  cosineSimilarity: number;
  contentFilteringSimilarity: number;
  compositeMatchScore: number;
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
 * fused with content filtering and domain/mode affinity.
 */
export function rankOpportunitiesWithAI(
  student: StudentProfile,
  opportunities: Opportunity[]
): AIMatchResult[] {
  // Pre-compute candidate structures once outside the opportunity loop (O(K) instead of O(N*K))
  const studentVec = vectorizeStudent(student);
  const studentText = buildStudentSearchText(student);
  const studentKeywordMask = PRECOMPILED_KEYWORDS.map((kw) => studentText.includes(kw));
  const studentInterestSet = new Set(student.interests || []);
  const studentSkillMap = new Map(student.skills.map((s) => [s.skillId, s.level]));

  const ranked: AIMatchResult[] = opportunities.map((opp) => {
    const oppVec = vectorizeOpportunity(opp);
    const cosine = computeCosineSimilarity(studentVec, oppVec);
    const contentSim = computeContentSimilarityFromMask(
      studentKeywordMask,
      buildOpportunitySearchText(opp)
    );

    let domainBonus = 0;
    if (opp.targetDomain.some((d) => studentInterestSet.has(d))) {
      domainBonus += 0.6;
    }
    if (opp.mode === student.preferredMode || opp.mode === 'Hybrid') {
      domainBonus += 0.4;
    }

    // Composite Score: 55% Vector Cosine + 25% Content Filtering + 20% Domain Affinity
    const compositeScore = Math.min(
      99,
      Math.round((cosine * 0.55 + contentSim * 0.25 + domainBonus * 0.2) * 100)
    );

    const matchedCompetencies: AIMatchResult['matchedCompetencies'] = [];
    const criticalGaps: SkillGapItem[] = [];
    let topStrength: AIMatchResult['matchedCompetencies'][number] | undefined;

    for (const req of opp.requiredSkills) {
      const studentLevel = studentSkillMap.get(req.skillId) ?? 0;
      let alignment: 'Superior' | 'Optimal' | 'Developing' | 'Deficit' = 'Deficit';
      if (studentLevel > req.requiredLevel) alignment = 'Superior';
      else if (studentLevel === req.requiredLevel) alignment = 'Optimal';
      else if (studentLevel >= req.requiredLevel - 1) alignment = 'Developing';

      const competency = {
        skillId: req.skillId,
        skillName: req.skillName,
        studentLevel,
        requiredLevel: req.requiredLevel,
        alignment,
      };
      matchedCompetencies.push(competency);

      if (!topStrength && (alignment === 'Superior' || alignment === 'Optimal')) {
        topStrength = competency;
      }

      if (studentLevel < req.requiredLevel) {
        const diff = req.requiredLevel - studentLevel;
        const gapScore = diff * req.importanceWeight;
        criticalGaps.push({
          skillId: req.skillId,
          skillName: req.skillName,
          requiredLevel: req.requiredLevel,
          studentLevel,
          importance: req.importanceWeight,
          gapScore,
          severity: gapScore >= 8 ? 'High' : gapScore >= 4 ? 'Medium' : 'Low',
          recommendationAction: `Complete Bridge Course: ${req.skillName} Proficiency (Target ${req.requiredLevel}/5)`,
        });
      }
    }

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
