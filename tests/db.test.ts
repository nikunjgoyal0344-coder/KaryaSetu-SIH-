import test from 'node:test';
import assert from 'node:assert/strict';
import { ServerDatabase } from '../lib/backend/db.ts';

test('ServerDatabase isolates state, updates skills cleanly, and enforces caps', () => {
  const repo = new ServerDatabase();
  const initial = repo.getStudent();
  assert.ok(initial.skills.length > 0);

  repo.updateSkillLevel('rasashastra-qa', 2);
  repo.updateSkillLevel('rasashastra-qa', 10);
  const updated = repo.getStudent().skills.find((s) => s.skillId === 'rasashastra-qa');
  assert.strictEqual(updated?.level, 5);
  assert.ok(repo.getStudent().readinessScore <= 99);

  repo.updateSkillLevel('brand-new-skill', 2);
  const added = repo.getStudent().skills.find((s) => s.skillId === 'brand-new-skill');
  assert.strictEqual(added?.level, 3);

  repo.endorseSkill('rasashastra-qa', 'Prof. Mishra');
  assert.strictEqual(updated?.isVerified, true);
  assert.strictEqual(updated?.endorsedBy, 'Prof. Mishra');
});

test('ServerDatabase opportunity and application O(1) operations work and deduplicate', () => {
  const repo = new ServerDatabase();
  const createdOpp = repo.addOpportunity({
    title: 'Ayush Informatics Intern',
    company: 'AyushGrid Labs',
    category: 'Internship',
    location: 'New Delhi',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹20,000 / mo',
    requiredSkills: [],
    minEligibility: 'BAMS',
    targetDomain: ['Digital Health'],
    description: 'FHIR integration.',
  });

  assert.strictEqual(repo.getOpportunityById(createdOpp.id)?.title, 'Ayush Informatics Intern');

  const app1 = repo.createApplication(createdOpp.id, 'Ananya Sharma', 'AIIA');
  const app2 = repo.createApplication(createdOpp.id, 'Ananya Sharma', 'AIIA');
  assert.ok(app1);
  assert.strictEqual(app1.id, app2?.id);
  assert.strictEqual(createdOpp.applicantsCount, 1);

  assert.strictEqual(repo.createApplication('non-existent'), null);

  const patched = repo.updateApplicationStatus(app1.id, 'Shortlisted');
  assert.strictEqual(patched?.status, 'Shortlisted');
  assert.strictEqual(repo.updateApplicationStatus('missing-id', 'Selected'), null);
});

test('ServerDatabase verification, ABC sync, and feedback recalibration', () => {
  const repo = new ServerDatabase();
  const queue = repo.getUnverifiedStudents();
  assert.ok(queue.length > 0);

  const verified = repo.verifyStudent(queue[0].id, 'Verified');
  assert.strictEqual(verified?.status, 'Verified');
  assert.strictEqual(repo.verifyStudent('missing-student', 'Flagged'), null);

  repo.linkAbcId('1111-2222-3333');
  assert.strictEqual(repo.getStudent().abcId, '1111-2222-3333');
  assert.strictEqual(repo.getStudent().isAbcLinked, true);

  for (let i = 0; i < 10; i++) repo.syncAbcCredits();
  assert.strictEqual(repo.getStudent().abcCredits, 160);

  repo.recordFeedback('rasashastra-qa', 'positive', 'Passed assessment');
  const history = repo.getFeedbackHistory();
  assert.strictEqual(history.length, 1);
  history.pop();
  assert.strictEqual(repo.getFeedbackHistory().length, 1);

  const recal = repo.recalibrateMatchingEngine();
  assert.strictEqual(recal.topOpportunities.length, 3);
});
