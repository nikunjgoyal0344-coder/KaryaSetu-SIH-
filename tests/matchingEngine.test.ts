import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSkillGaps, computeOpportunityMatch } from '../lib/matchingEngine.ts';
import type { Opportunity, StudentSkill } from '../lib/matchingEngine.ts';

test('calculateSkillGaps correctly evaluates skill gaps, severity, and sorts descending', () => {
  const studentSkills: StudentSkill[] = [
    { skillId: 'panchakarma', skillName: 'Panchakarma', level: 3 },
    { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', level: 2 },
  ];

  const targetRoleRequirements = [
    { skillId: 'panchakarma', skillName: 'Panchakarma', requiredLevel: 5, importanceWeight: 5 }, // diff 2 * 5 = 10 -> High
    { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', requiredLevel: 3, importanceWeight: 3 }, // diff 1 * 3 = 3 -> Low
    { skillId: 'rasashastra', skillName: 'Rasashastra', requiredLevel: 2, importanceWeight: 3 }, // diff 2 * 3 = 6 -> Medium
    { skillId: 'botany', skillName: 'Botany', requiredLevel: 0, importanceWeight: 2 }, // diff 0 -> None
  ];

  const gaps = calculateSkillGaps(studentSkills, targetRoleRequirements);

  assert.strictEqual(gaps.length, 4);
  // First item must be panchakarma with highest gap score (10)
  assert.strictEqual(gaps[0].skillId, 'panchakarma');
  assert.strictEqual(gaps[0].gapScore, 10);
  assert.strictEqual(gaps[0].severity, 'High');

  // Second item: rasashastra (gap score 6)
  assert.strictEqual(gaps[1].skillId, 'rasashastra');
  assert.strictEqual(gaps[1].gapScore, 6);
  assert.strictEqual(gaps[1].severity, 'Medium');

  // Third item: nadi-pariksha (gap score 3)
  assert.strictEqual(gaps[2].skillId, 'nadi-pariksha');
  assert.strictEqual(gaps[2].gapScore, 3);
  assert.strictEqual(gaps[2].severity, 'Low');

  // Fourth item: botany (gap score 0)
  assert.strictEqual(gaps[3].skillId, 'botany');
  assert.strictEqual(gaps[3].gapScore, 0);
  assert.strictEqual(gaps[3].severity, 'None');
});

test('computeOpportunityMatch calculates scores and handles empty skill lists cleanly', () => {
  const dummyStudent = {
    skills: [
      { skillId: 'panchakarma', skillName: 'Panchakarma', level: 4 },
      { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', level: 4 },
    ],
    interests: ['Clinical Research', 'Panchakarma'],
    preferredMode: 'Hybrid' as const,
    cgpa: 8.5,
  };

  const emptyOpp: Opportunity = {
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

  const emptyMatch = computeOpportunityMatch(dummyStudent, emptyOpp);
  assert.strictEqual(emptyMatch.overallScore, 80);

  const matchedOpp: Opportunity = {
    ...emptyOpp,
    id: 'opp-targeted',
    requiredSkills: [
      { skillId: 'panchakarma', skillName: 'Panchakarma', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha', requiredLevel: 4, importanceWeight: 4 },
    ],
    targetDomain: ['Panchakarma'],
  };

  const targetMatch = computeOpportunityMatch(dummyStudent, matchedOpp);
  assert.ok(targetMatch.overallScore >= 95, `Expected score >= 95, got ${targetMatch.overallScore}`);
  assert.strictEqual(targetMatch.matchedSkillsCount, 2);
  assert.strictEqual(targetMatch.missingCriticalSkills.length, 0);
});
