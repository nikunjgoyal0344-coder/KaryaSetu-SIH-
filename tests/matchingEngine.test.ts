import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSkillGaps, computeOpportunityMatch } from '../lib/matchingEngine.ts';
import type { Opportunity, StudentSkill } from '../lib/matchingEngine.ts';

test('calculateSkillGaps evaluates severity thresholds and sorts descending', () => {
  const studentSkills: StudentSkill[] = [
    { skillId: 'panchakarma', skillName: 'Panchakarma', level: 3 },
    { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', level: 2 },
  ];

  const targetRoleRequirements = [
    { skillId: 'panchakarma', skillName: 'Panchakarma', requiredLevel: 5, importanceWeight: 5 },
    { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', requiredLevel: 3, importanceWeight: 3 },
    { skillId: 'rasashastra', skillName: 'Rasashastra', requiredLevel: 2, importanceWeight: 3 },
    { skillId: 'botany', skillName: 'Botany', requiredLevel: 0, importanceWeight: 2 },
  ];

  const gaps = calculateSkillGaps(studentSkills, targetRoleRequirements);

  assert.strictEqual(gaps.length, 4);
  assert.deepStrictEqual(
    gaps.map((g) => ({ id: g.skillId, score: g.gapScore, sev: g.severity })),
    [
      { id: 'panchakarma', score: 10, sev: 'High' },
      { id: 'rasashastra', score: 6, sev: 'Medium' },
      { id: 'nadi-pariksha', score: 3, sev: 'Low' },
      { id: 'botany', score: 0, sev: 'None' },
    ]
  );
  assert.match(gaps[0].recommendationAction, /Panchakarma/);
  assert.strictEqual(gaps[3].recommendationAction, 'Skill benchmark met.');
});

test('computeOpportunityMatch handles empty skills, full match, and partial mismatch penalties', () => {
  const baseStudent = {
    skills: [
      { skillId: 'panchakarma', skillName: 'Panchakarma', level: 4 },
      { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', level: 4 },
    ],
    interests: ['Clinical Research', 'Panchakarma'],
    preferredMode: 'Hybrid' as const,
    cgpa: 8.5,
  };

  const baseOpp: Opportunity = {
    id: 'opp-empty',
    title: 'General Project',
    company: 'Ayush Org',
    category: 'Internship',
    location: 'Delhi',
    mode: 'Hybrid',
    duration: '3 months',
    stipend: '15000',
    requiredSkills: [],
    minEligibility: 'BAMS',
    targetDomain: ['Ayurveda'],
    description: 'General',
    postedAt: '2026-01-01',
    applicantsCount: 5,
  };

  assert.strictEqual(computeOpportunityMatch(baseStudent, baseOpp).overallScore, 80);

  const highMatch = computeOpportunityMatch(baseStudent, {
    ...baseOpp,
    requiredSkills: [
      { skillId: 'panchakarma', skillName: 'Panchakarma', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', requiredLevel: 4, importanceWeight: 4 },
    ],
    targetDomain: ['Panchakarma'],
  });

  assert.ok(highMatch.overallScore >= 95);
  assert.strictEqual(highMatch.matchedSkillsCount, 2);
  assert.strictEqual(highMatch.missingCriticalSkills.length, 0);

  const lowMatch = computeOpportunityMatch(
    { ...baseStudent, skills: [{ skillId: 'panchakarma', skillName: 'Panchakarma', level: 1 }], preferredMode: 'Remote', cgpa: 6.2 },
    {
      ...baseOpp,
      mode: 'On-site',
      targetDomain: ['UnrelatedDomain'],
      requiredSkills: [
        { skillId: 'panchakarma', skillName: 'Panchakarma', requiredLevel: 5, importanceWeight: 5 },
        { skillId: 'rasashastra', skillName: 'Rasashastra', requiredLevel: 4, importanceWeight: 4 },
      ],
    }
  );

  assert.ok(lowMatch.overallScore >= 25 && lowMatch.overallScore < 60);
  assert.strictEqual(lowMatch.factors.eligibilityScore, 80);
  assert.strictEqual(lowMatch.factors.modeMatchScore, 70);
  assert.strictEqual(lowMatch.factors.interestMatchScore, 60);
  assert.strictEqual(lowMatch.missingCriticalSkills.length, 2);
});
