import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getStudentProfile,
  getOpportunities,
  submitApplication,
  updateApplicationStatus,
  getNotifications,
} from '../lib/firebase/firestoreService.ts';

test('firestoreService provides seamless local fallback when Firebase credentials are unset', async () => {
  const prevKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  try {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const student = await getStudentProfile('stu-1');
    assert.ok(student.name.length > 0);
    assert.ok(Array.isArray(student.skills));

    const opps = await getOpportunities();
    assert.ok(opps.length > 0);

    const createdApp = await submitApplication(opps[0].id, student.name, student.college);
    assert.ok(createdApp);
    assert.strictEqual(createdApp.opportunityId, opps[0].id);

    const missingApp = await submitApplication('non-existent-opp', student.name, student.college);
    assert.strictEqual(missingApp, null);

    const updatedApp = await updateApplicationStatus(createdApp.id, 'Shortlisted');
    assert.strictEqual(updatedApp?.status, 'Shortlisted');

    const notifs = await getNotifications();
    assert.ok(Array.isArray(notifs));
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = prevKey;
  }
});

test('Repository enforces zero Math.random() in backend/API security code and includes firestore.rules default-deny', () => {
  const securitySensitiveFiles = [
    'lib/security.ts',
    'lib/backend/db.ts',
    'app/api/auth/login/route.ts',
    'app/api/auth/me/route.ts',
    'app/api/ai/profile-generate/route.ts',
    'app/api/faculty/endorse/route.ts',
    'app/api/institution/verify/route.ts',
  ];

  for (const relPath of securitySensitiveFiles) {
    const content = fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf8');
    assert.strictEqual(
      content.includes('Math.random('),
      false,
      `Insecure Math.random() found in ${relPath}`
    );
  }

  const rulesContent = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  assert.match(rulesContent, /allow read, write: if false;/);
  assert.match(rulesContent, /isInstitutionVerified/);
});
