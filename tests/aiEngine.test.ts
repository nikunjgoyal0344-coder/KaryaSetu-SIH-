import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCosineSimilarity,
  vectorizeStudent,
  vectorizeOpportunity,
  computeContentSimilarity,
  rankOpportunitiesWithAI,
} from '../lib/backend/aiEngine.ts';
import type { FeatureVector } from '../lib/backend/aiEngine.ts';
import type { StudentProfile } from '../lib/seedData.ts';
import type { Opportunity } from '../lib/matchingEngine.ts';

function makeStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: 'test-stu',
    name: 'Test Scholar',
    email: 'scholar@test.in',
    avatar: '',
    degree: 'BAMS',
    year: '4th Year',
    college: 'AIIA',
    abcId: '1234-5678-9012',
    cgpa: 8.5,
    readinessScore: 80,
    prakriti: 'Pitta-Kapha',
    preferredMode: 'On-site',
    preferredLocation: 'New Delhi',
    skills: [
      { skillId: 'panchakarma-therapy', skillName: 'Panchakarma Therapy', level: 4, isVerified: true },
      { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', level: 3, isVerified: false },
    ],
    interests: ['Clinical Research', 'Panchakarma'],
    bio: 'Aspiring clinical researcher in Panchakarma therapy.',
    completedCertificates: [],
    projects: [],
    ...overrides,
  };
}

function makeOpp(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: 'opp-1',
    title: 'Panchakarma Intern',
    company: 'Ayush Clinical Hospital',
    category: 'Internship',
    location: 'New Delhi',
    mode: 'On-site',
    duration: '6 Months',
    stipend: '12,000/mo',
    requiredSkills: [
      { skillId: 'panchakarma-therapy', skillName: 'Panchakarma Therapy', requiredLevel: 4, importanceWeight: 5 },
    ],
    minEligibility: 'BAMS Final Year',
    targetDomain: ['Ayurveda', 'Clinical Research'],
    description: 'Practical clinical training in Panchakarma therapy.',
    postedAt: '2026-01-01',
    applicantsCount: 10,
    ...overrides,
  };
}

test('computeCosineSimilarity handles orthogonal, parallel, and zero vectors', () => {
  const vecA: FeatureVector = { dimensions: [1, 0, 0], norm: 1 };
  const vecB: FeatureVector = { dimensions: [0, 1, 0], norm: 1 };
  assert.strictEqual(computeCosineSimilarity(vecA, vecB), 0);

  const vecC: FeatureVector = { dimensions: [2, 2, 1], norm: 3 };
  assert.strictEqual(Math.round(computeCosineSimilarity(vecC, vecC) * 100) / 100, 1);

  const zeroVec: FeatureVector = { dimensions: [0, 0, 0], norm: 0 };
  assert.strictEqual(computeCosineSimilarity(vecA, zeroVec), 0);
});

test('vectorizeStudent applies verified credibility boost capped at 5', () => {
  const unverified = vectorizeStudent(
    makeStudent({ skills: [{ skillId: 'panchakarma-therapy', skillName: 'Panchakarma', level: 4, isVerified: false }] })
  );
  const verified = vectorizeStudent(
    makeStudent({ skills: [{ skillId: 'panchakarma-therapy', skillName: 'Panchakarma', level: 4, isVerified: true }] })
  );
  const capped = vectorizeStudent(
    makeStudent({ skills: [{ skillId: 'panchakarma-therapy', skillName: 'Panchakarma', level: 5, isVerified: true }] })
  );

  assert.strictEqual(unverified.dimensions[0], 4);
  assert.ok(verified.dimensions[0] > 4 && verified.dimensions[0] <= 4.41);
  assert.strictEqual(capped.dimensions[0], 5);
});

test('rankOpportunitiesWithAI ranks strong matches higher and builds remediation roadmap', () => {
  const student = makeStudent();
  const strongOpp = makeOpp({ id: 'opp-strong' });
  const weakOpp = makeOpp({
    id: 'opp-weak',
    title: 'GMP Manufacturing Intern',
    mode: 'Remote',
    targetDomain: ['Manufacturing'],
    description: 'GMP HPLC manufacturing protocols.',
    requiredSkills: [
      { skillId: 'rasashastra-qa', skillName: 'Rasashastra QA', requiredLevel: 5, importanceWeight: 5 },
    ],
  });

  const ranked = rankOpportunitiesWithAI(student, [weakOpp, strongOpp]);
  assert.strictEqual(ranked.length, 2);
  assert.strictEqual(ranked[0].opportunity.id, 'opp-strong');
  assert.ok(ranked[0].compositeMatchScore > ranked[1].compositeMatchScore);
  assert.strictEqual(ranked[1].criticalGaps.length, 1);
  assert.strictEqual(ranked[1].recommendationRoadmap[0].estimatedWeeks, 10);

  const noOverlapContent = computeContentSimilarity(
    makeStudent({ bio: 'unrelated', interests: [], skills: [] }),
    weakOpp
  );
  assert.strictEqual(noOverlapContent, 0);
});
