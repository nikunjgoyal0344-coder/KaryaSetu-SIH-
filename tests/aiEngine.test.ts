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

test('computeCosineSimilarity calculates mathematical cosine angle correctly', () => {
  // Orthogonal vectors: dot product is 0 -> similarity 0
  const vecA: FeatureVector = { dimensions: [1, 0, 0], norm: 1 };
  const vecB: FeatureVector = { dimensions: [0, 1, 0], norm: 1 };
  assert.strictEqual(computeCosineSimilarity(vecA, vecB), 0);

  // Parallel identical vectors: similarity 1
  const vecC: FeatureVector = { dimensions: [2, 2, 1], norm: 3 };
  assert.strictEqual(Math.round(computeCosineSimilarity(vecC, vecC) * 100) / 100, 1);

  // Zero vector handling: returns 0 without crashing with NaN
  const zeroVec: FeatureVector = { dimensions: [0, 0, 0], norm: 0 };
  assert.strictEqual(computeCosineSimilarity(vecA, zeroVec), 0);
});

test('vectorizeStudent and vectorizeOpportunity produce correct norms and dimensions', () => {
  const mockStudent: StudentProfile = {
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
  };

  const studentVec = vectorizeStudent(mockStudent);
  assert.ok(studentVec.norm > 0, 'Norm should be positive');
  assert.ok(studentVec.dimensions.length === 15, 'Should match 15 AYUSH vocabulary dimensions');

  const mockOpp: Opportunity = {
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
  };

  const oppVec = vectorizeOpportunity(mockOpp);
  assert.ok(oppVec.norm > 0, 'Opportunity vector norm should be positive');

  const sim = computeCosineSimilarity(studentVec, oppVec);
  assert.ok(sim > 0.5, `Expected high similarity for matching skill, got ${sim}`);

  const contentSim = computeContentSimilarity(mockStudent, mockOpp);
  assert.ok(contentSim > 0, `Expected positive content overlap, got ${contentSim}`);

  const ranked = rankOpportunitiesWithAI(mockStudent, [mockOpp]);
  assert.strictEqual(ranked.length, 1);
  assert.ok(ranked[0].compositeMatchScore > 50, 'Composite match score should be high');
});
