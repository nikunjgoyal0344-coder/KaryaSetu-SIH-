import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { resetRateLimiter } from '@/lib/security';
import { POST as loginPost } from '@/app/api/auth/login/route';
import { GET as meGet } from '@/app/api/auth/me/route';
import { GET as opportunitiesGet, POST as opportunitiesPost } from '@/app/api/opportunities/route';
import { GET as applicationsGet, POST as applicationsPost, PATCH as applicationsPatch } from '@/app/api/applications/route';
import { POST as endorsePost } from '@/app/api/faculty/endorse/route';
import { GET as verifyGet, POST as verifyPost } from '@/app/api/institution/verify/route';
import { GET as abcGet, POST as abcPost } from '@/app/api/abc/sync/route';
import { POST as diagnosticsPost } from '@/app/api/skills/diagnostics/route';
import { GET as matchGet, POST as matchPost } from '@/app/api/ai/match/route';
import { POST as explainPost } from '@/app/api/ai/explain/route';
import { GET as feedbackGet, POST as feedbackPost } from '@/app/api/ai/feedback/route';
import { GET as quizGet } from '@/app/api/ai/quiz/route';
import { POST as assessmentPost } from '@/app/api/ai/assessment/route';
import { POST as chatPost } from '@/app/api/ai/chat/route';
import { GET as demandInsightsGet } from '@/app/api/ai/demand-insights/route';
import { GET as profileGenGet } from '@/app/api/ai/profile-generate/route';
import { GET as recommendLearningGet } from '@/app/api/ai/recommend-learning/route';
import { GET as demandAnalyticsGet } from '@/app/api/analytics/demand/route';

function makeRequest(url: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

test('Auth login and session /me endpoints validate roles, emails, and JWT parity', async () => {
  resetRateLimiter();

  const badRoleRes = await loginPost(makeRequest('http://localhost/api/auth/login', 'POST', { role: 'hacker' }));
  assert.strictEqual(badRoleRes.status, 400);

  const badEmailRes = await loginPost(
    makeRequest('http://localhost/api/auth/login', 'POST', { role: 'student', email: 'bad-email' })
  );
  assert.strictEqual(badEmailRes.status, 400);

  const loginRes = await loginPost(
    makeRequest('http://localhost/api/auth/login', 'POST', { role: 'faculty', email: 'prof@aiia.gov.in' })
  );
  assert.strictEqual(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token);
  assert.strictEqual(loginData.user.role, 'faculty');

  const noAuthRes = await meGet(makeRequest('http://localhost/api/auth/me'));
  assert.strictEqual(noAuthRes.status, 401);

  const authedRes = await meGet(
    makeRequest('http://localhost/api/auth/me', 'GET', undefined, {
      authorization: `Bearer ${loginData.token}`,
    })
  );
  assert.strictEqual(authedRes.status, 200);
  const meData = await authedRes.json();
  assert.strictEqual(meData.user.email, 'prof@aiia.gov.in');
});

test('Opportunities & Applications API routes validate inputs and run feedback loops', async () => {
  const invalidOpp = await opportunitiesPost(
    makeRequest('http://localhost/api/opportunities', 'POST', { title: 'Test' })
  );
  assert.strictEqual(invalidOpp.status, 400);

  const invalidMode = await opportunitiesPost(
    makeRequest('http://localhost/api/opportunities', 'POST', {
      title: 'Role',
      company: 'Org',
      description: 'Desc',
      mode: 'Teleport',
    })
  );
  assert.strictEqual(invalidMode.status, 400);

  const createdOppRes = await opportunitiesPost(
    makeRequest('http://localhost/api/opportunities', 'POST', {
      title: 'Ayurveda Informatics Intern',
      company: 'AyushGrid',
      description: 'FHIR integration project',
      mode: 'Hybrid',
      category: 'Internship',
    })
  );
  assert.strictEqual(createdOppRes.status, 201);
  const createdOpp = (await createdOppRes.json()).opportunity;

  const searchRes = await opportunitiesGet(
    makeRequest('http://localhost/api/opportunities?mode=Hybrid&q=informatics')
  );
  assert.strictEqual(searchRes.status, 200);
  assert.ok((await searchRes.json()).count >= 1);

  const appCreate = await applicationsPost(
    makeRequest('http://localhost/api/applications', 'POST', { opportunityId: createdOpp.id })
  );
  assert.strictEqual(appCreate.status, 200);
  const createdApp = (await appCreate.json()).application;

  const badStatus = await applicationsPatch(
    makeRequest('http://localhost/api/applications', 'PATCH', { applicationId: createdApp.id, status: 'Hacked' })
  );
  assert.strictEqual(badStatus.status, 400);

  const selectedPatch = await applicationsPatch(
    makeRequest('http://localhost/api/applications', 'PATCH', { applicationId: createdApp.id, status: 'Selected' })
  );
  assert.strictEqual(selectedPatch.status, 200);
  const selectedData = await selectedPatch.json();
  assert.strictEqual(selectedData.application.status, 'Selected');

  const appsList = await applicationsGet(makeRequest('http://localhost/api/applications'));
  assert.strictEqual(appsList.status, 200);
});

test('Faculty endorse, Institution verify, ABC sync, and Diagnostics enforce strict validation', async () => {
  const badEndorse = await endorsePost(makeRequest('http://localhost/api/faculty/endorse', 'POST', {}));
  assert.strictEqual(badEndorse.status, 400);

  const goodEndorse = await endorsePost(
    makeRequest('http://localhost/api/faculty/endorse', 'POST', { skillId: 'panchakarma-therapy' })
  );
  assert.strictEqual(goodEndorse.status, 200);
  assert.match((await goodEndorse.json()).attestationSignature, /^SIG-AYUSH-2026-/);

  const queueRes = await verifyGet();
  const queueData = await queueRes.json();
  assert.ok(queueData.count > 0);

  const badVerify = await verifyPost(
    makeRequest('http://localhost/api/institution/verify', 'POST', {
      studentId: queueData.unverifiedStudents[0].id,
      action: 'Deleted',
    })
  );
  assert.strictEqual(badVerify.status, 400);

  const goodVerify = await verifyPost(
    makeRequest('http://localhost/api/institution/verify', 'POST', {
      studentId: queueData.unverifiedStudents[0].id,
      action: 'Verified',
    })
  );
  assert.strictEqual(goodVerify.status, 200);

  const badAbc = await abcPost(makeRequest('http://localhost/api/abc/sync', 'POST', { abcId: 'invalid' }));
  assert.strictEqual(badAbc.status, 400);

  const goodAbc = await abcPost(makeRequest('http://localhost/api/abc/sync', 'POST', { abcId: '123456789012' }));
  assert.strictEqual(goodAbc.status, 200);
  assert.strictEqual((await goodAbc.json()).abcId, '1234-5678-9012');

  const abcLedger = await abcGet();
  assert.strictEqual(abcLedger.status, 200);

  const diagRes = await diagnosticsPost(
    makeRequest('http://localhost/api/skills/diagnostics', 'POST', { skillId: 'rasashastra-qa', levelGain: 1 })
  );
  assert.strictEqual(diagRes.status, 200);
});

test('AI matching, explain, feedback, quiz, assessment, chat, and analytics endpoints work reliably', async () => {
  resetRateLimiter();

  const matchGetRes = await matchGet();
  assert.strictEqual(matchGetRes.status, 200);

  const matchPostRes = await matchPost(makeRequest('http://localhost/api/ai/match', 'POST', {}));
  assert.strictEqual(matchPostRes.status, 200);
  const firstOppId = (await matchPostRes.json()).matches[0].opportunity.id;

  const explainRes = await explainPost(
    makeRequest('http://localhost/api/ai/explain', 'POST', { opportunityId: firstOppId })
  );
  assert.strictEqual(explainRes.status, 200);

  const fbBad = await feedbackPost(makeRequest('http://localhost/api/ai/feedback', 'POST', { type: 'bad' }));
  assert.strictEqual(fbBad.status, 400);

  const fbGood = await feedbackPost(
    makeRequest('http://localhost/api/ai/feedback', 'POST', {
      type: 'course_completed',
      skillId: 'rasashastra-qa',
      outcome: 'positive',
    })
  );
  assert.strictEqual(fbGood.status, 200);
  assert.strictEqual((await feedbackGet()).status, 200);

  const quizRes = await quizGet(makeRequest('http://localhost/api/ai/quiz?skillId=panchakarma-therapy'));
  assert.strictEqual(quizRes.status, 200);
  assert.strictEqual((await quizRes.json()).totalQuestions, 5);

  const assessBad = await assessmentPost(
    makeRequest('http://localhost/api/ai/assessment', 'POST', { skillId: 'panchakarma-therapy', answers: [99] })
  );
  assert.strictEqual(assessBad.status, 400);

  const assessGood = await assessmentPost(
    makeRequest('http://localhost/api/ai/assessment', 'POST', {
      skillId: 'panchakarma-therapy',
      answers: [4, 4, 4, 4, 4],
      quizType: 'theory',
    })
  );
  assert.strictEqual(assessGood.status, 200);

  const chatBad = await chatPost(makeRequest('http://localhost/api/ai/chat', 'POST', { messages: [] }));
  assert.strictEqual(chatBad.status, 400);

  const chatGood = await chatPost(
    makeRequest('http://localhost/api/ai/chat', 'POST', {
      messages: [{ role: 'user', content: 'Explain Bhasma AFI limits' }],
    })
  );
  assert.strictEqual(chatGood.status, 200);
  assert.match((await chatGood.json()).reply, /AFI/);

  assert.strictEqual((await demandInsightsGet()).status, 200);
  assert.strictEqual((await profileGenGet()).status, 200);
  assert.strictEqual((await recommendLearningGet()).status, 200);
  assert.strictEqual((await demandAnalyticsGet()).status, 200);
});
