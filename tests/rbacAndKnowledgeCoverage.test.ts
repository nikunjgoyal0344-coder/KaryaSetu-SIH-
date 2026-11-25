import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { getCurrentUser, hasRolePermission, ROLE_PERMISSIONS } from '@/lib/auth';
import {
  badRequest,
  enforceRateLimit,
  forbidden,
  getRestrictedCorsHeaders,
  notFound,
  parseJsonBody,
  serverError,
  unauthorized,
  verifyOptionalSessionRole,
} from '@/lib/apiHelpers';
import { generateLocalAyushResponse } from '@/lib/backend/ayushKnowledge';
import { resetRateLimiter } from '@/lib/security';
import { POST as loginPost } from '@/app/api/auth/login/route';
import { POST as endorsePost } from '@/app/api/faculty/endorse/route';
import { GET as verifyGet, POST as verifyPost } from '@/app/api/institution/verify/route';
import { POST as opportunitiesPost } from '@/app/api/opportunities/route';
import { POST as applicationsPost, PATCH as applicationsPatch } from '@/app/api/applications/route';
import { POST as feedbackPost } from '@/app/api/ai/feedback/route';
import { GET as quizGet } from '@/app/api/ai/quiz/route';
import { POST as abcPost } from '@/app/api/abc/sync/route';

function makeJsonReq(url: string, method: string, body?: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

test('lib/auth exports all stakeholder demo identities and enforces RBAC permission matrix', () => {
  const roles = ['student', 'industry', 'faculty', 'institution'] as const;
  for (const role of roles) {
    const user = getCurrentUser(role);
    assert.strictEqual(user.role, role);
    assert.ok(ROLE_PERMISSIONS[role].length >= 3);
    assert.strictEqual(hasRolePermission(role, ROLE_PERMISSIONS[role][0]), true);
    assert.strictEqual(hasRolePermission(role, 'nonexistent:perm'), false);
  }
  assert.strictEqual(hasRolePermission('student', 'students:verify'), false);
  assert.strictEqual(hasRolePermission('institution', 'students:verify'), true);
});

test('lib/apiHelpers parses JSON safely, emits standard responses, and enforces rate limits', async () => {
  resetRateLimiter();

  const badReq = new NextRequest('http://localhost/test', { method: 'POST', body: 'not-json' });
  assert.strictEqual(await parseJsonBody(badReq), null);

  const arrayReq = new NextRequest('http://localhost/test', { method: 'POST', body: '[1,2,3]' });
  assert.strictEqual(await parseJsonBody(arrayReq), null);

  const goodReq = makeJsonReq('http://localhost/test', 'POST', { hello: 'world' });
  assert.deepStrictEqual(await parseJsonBody(goodReq), { hello: 'world' });

  assert.strictEqual(badRequest('bad').status, 400);
  assert.strictEqual(unauthorized().status, 401);
  assert.strictEqual(forbidden().status, 403);
  assert.strictEqual(notFound('missing').status, 404);
  assert.strictEqual(serverError('test', new Error('secret trace'), 'Safe msg').status, 500);

  const cors = getRestrictedCorsHeaders('GET, POST');
  assert.ok(cors['Access-Control-Allow-Methods'].includes('POST'));
  assert.notStrictEqual(cors['Access-Control-Allow-Origin'], '*');

  const rlReq = makeJsonReq('http://localhost/test', 'POST', {});
  assert.strictEqual(enforceRateLimit(rlReq, 'unit:bucket', 2, 60_000), null);
  assert.strictEqual(enforceRateLimit(rlReq, 'unit:bucket', 2, 60_000), null);
  const blocked = enforceRateLimit(rlReq, 'unit:bucket', 2, 60_000);
  assert.strictEqual(blocked?.status, 429);
  assert.ok(blocked?.headers.get('Retry-After'));
});

test('verifyOptionalSessionRole and mutating API routes enforce JWT RBAC and strict mode', async () => {
  resetRateLimiter();

  const studentLogin = await loginPost(makeJsonReq('http://localhost/api/auth/login', 'POST', { role: 'student' }));
  const { token: studentToken } = await studentLogin.json();

  const instLogin = await loginPost(makeJsonReq('http://localhost/api/auth/login', 'POST', { role: 'institution' }));
  const { token: instToken } = await instLogin.json();

  // Tampered token rejected cleanly with 401
  const badAuthRes = await endorsePost(
    makeJsonReq('http://localhost/api/faculty/endorse', 'POST', { skillId: 'nadi-pariksha' }, { authorization: 'Bearer forged.jwt.sig' })
  );
  assert.strictEqual(badAuthRes.status, 401);

  // Student role rejected with 403 on institution, faculty, and industry mutating routes
  const verifyForbidden = await verifyPost(
    makeJsonReq('http://localhost/api/institution/verify', 'POST', { studentId: 'stu-2', action: 'Verified' }, { authorization: `Bearer ${studentToken}` })
  );
  assert.strictEqual(verifyForbidden.status, 403);

  const endorseForbidden = await endorsePost(
    makeJsonReq('http://localhost/api/faculty/endorse', 'POST', { skillId: 'nadi-pariksha' }, { authorization: `Bearer ${studentToken}` })
  );
  assert.strictEqual(endorseForbidden.status, 403);

  const postOppForbidden = await opportunitiesPost(
    makeJsonReq('http://localhost/api/opportunities', 'POST', { title: 'Role', company: 'Org', description: 'Desc' }, { authorization: `Bearer ${studentToken}` })
  );
  assert.strictEqual(postOppForbidden.status, 403);

  const patchAppForbidden = await applicationsPatch(
    makeJsonReq('http://localhost/api/applications', 'PATCH', { applicationId: 'app-1', status: 'Selected' }, { authorization: `Bearer ${studentToken}` })
  );
  assert.strictEqual(patchAppForbidden.status, 403);

  const appPostForbidden = await applicationsPost(
    makeJsonReq('http://localhost/api/applications', 'POST', { opportunityId: 'opp-1' }, { authorization: `Bearer ${instToken}` })
  );
  assert.strictEqual(appPostForbidden.status, 403);

  // Valid authorized institution role passes RBAC guard (Bearer header & HttpOnly cookie)
  const queueData = await (await verifyGet()).json();
  const targetStudentId = queueData.unverifiedStudents[0]?.id;
  assert.ok(targetStudentId);

  const verifyAllowed = await verifyPost(
    makeJsonReq('http://localhost/api/institution/verify', 'POST', { studentId: targetStudentId, action: 'Verified' }, { authorization: `Bearer ${instToken}` })
  );
  assert.strictEqual(verifyAllowed.status, 200);

  const verifyViaCookie = await verifyPost(
    makeJsonReq('http://localhost/api/institution/verify', 'POST', { studentId: targetStudentId, action: 'Verified' }, { cookie: `karyasetu_token=${instToken}` })
  );
  assert.strictEqual(verifyViaCookie.status, 200);

  // Strict fail-closed mode rejects missing credentials when enabled
  const prevStrict = process.env.REQUIRE_STRICT_AUTH;
  try {
    process.env.REQUIRE_STRICT_AUTH = 'true';
    const strictDenial = verifyOptionalSessionRole(makeJsonReq('http://localhost/api/institution/verify', 'POST', {}), ['institution']);
    assert.strictEqual(strictDenial?.status, 401);
  } finally {
    if (prevStrict === undefined) delete process.env.REQUIRE_STRICT_AUTH;
    else process.env.REQUIRE_STRICT_AUTH = prevStrict;
  }
});

test('applications, abc, quiz, and feedback endpoints handle all status branches and validation errors', async () => {
  resetRateLimiter();

  // Create application + exercise Selected, Rejected, Shortlisted, Under Review & error paths
  const createdRes = await applicationsPost(
    makeJsonReq('http://localhost/api/applications', 'POST', {
      opportunityId: 'opp-2',
      studentName: 'Test Scholar',
      college: 'AIIA',
    })
  );
  assert.strictEqual(createdRes.status, 200);
  const { application } = await createdRes.json();

  assert.strictEqual((await applicationsPatch(makeJsonReq('http://localhost/api/applications', 'PATCH', { status: 'Selected' }))).status, 400);
  assert.strictEqual((await applicationsPatch(makeJsonReq('http://localhost/api/applications', 'PATCH', { applicationId: application.id, status: 'InvalidStatus' }))).status, 400);
  assert.strictEqual((await applicationsPatch(makeJsonReq('http://localhost/api/applications', 'PATCH', { applicationId: 'nonexistent', status: 'Selected' }))).status, 404);

  for (const status of ['Under Review', 'Shortlisted', 'Selected', 'Rejected'] as const) {
    const res = await applicationsPatch(
      makeJsonReq('http://localhost/api/applications', 'PATCH', { applicationId: application.id, status })
    );
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.application.status, status);
    assert.ok(data.matchingEngineUpdate);
  }

  // ABC credit sync without custom abcId (increment path) & invalid ABC ID
  const abcSyncRes = await abcPost(makeJsonReq('http://localhost/api/abc/sync', 'POST', {}));
  assert.strictEqual(abcSyncRes.status, 200);
  assert.strictEqual((await abcPost(makeJsonReq('http://localhost/api/abc/sync', 'POST', { abcId: '123' }))).status, 400);

  // Quiz fallback & specific lookup
  const fallbackQuiz = await quizGet(new NextRequest('http://localhost/api/ai/quiz?skillId=unknown-ayush-skill'));
  assert.strictEqual(fallbackQuiz.status, 200);
  assert.ok((await fallbackQuiz.json()).questions.length > 0);

  // Feedback positive, negative, neutral, and validation errors
  assert.strictEqual((await feedbackPost(makeJsonReq('http://localhost/api/ai/feedback', 'POST', {}))).status, 400);
  assert.strictEqual((await feedbackPost(makeJsonReq('http://localhost/api/ai/feedback', 'POST', { type: 'bad', skillId: 's', outcome: 'positive' }))).status, 400);
  assert.strictEqual((await feedbackPost(makeJsonReq('http://localhost/api/ai/feedback', 'POST', { type: 'course_completed', skillId: 's', outcome: 'bad' }))).status, 400);

  for (const outcome of ['positive', 'negative', 'neutral'] as const) {
    const res = await feedbackPost(
      makeJsonReq('http://localhost/api/ai/feedback', 'POST', {
        type: 'course_completed',
        skillId: 'rasashastra-qa',
        outcome,
        details: 'Practiced SOP',
      })
    );
    assert.strictEqual(res.status, 200);
  }
});

test('generateLocalAyushResponse handles every clinical, career, ABDM, ABC, and fallback domain', () => {
  const ctx = { name: 'Ananya', readinessScore: 86, abcCredits: 152 };

  const gap = generateLocalAyushResponse('How can I improve my skill gap?', ctx);
  assert.strictEqual(gap.actionType, 'enroll_bridge');
  assert.ok(gap.text.includes('86%'));

  const bhasma = generateLocalAyushResponse('Explain AFI Bhasma limits', ctx);
  assert.ok(bhasma.text.includes('Varitaratva'));
  assert.strictEqual(bhasma.actionType, 'enroll_bridge');

  const kshara = generateLocalAyushResponse('SOP for Ksharasutra in Shalya Tantra', ctx);
  assert.ok(kshara.text.includes('Snuhi Ksheera'));

  const pancha = generateLocalAyushResponse('Panchakarma Vamana and Basti protocol', ctx);
  assert.ok(pancha.text.includes('Samsarjana Krama'));

  const abdm = generateLocalAyushResponse('AyushGrid ABDM NAMASTE portal ICD-11', ctx);
  assert.strictEqual(abdm.actionType, 'enroll_bridge');
  assert.strictEqual(abdm.actionPayload?.skillId, 'clinical-documentation');

  const internships = generateLocalAyushResponse('Which internship matches Dabur or CSIR?', ctx);
  assert.strictEqual(internships.actionType, 'apply_opportunity');

  const abc = generateLocalAyushResponse('Check my ABC APAAR credits', ctx);
  assert.strictEqual(abc.actionType, 'sync_abc');
  assert.ok(abc.text.includes('152 / 160'));

  const dravya = generateLocalAyushResponse('Dravyaguna TLC botanical herb identification', ctx);
  assert.strictEqual(dravya.actionPayload?.skillId, 'dravyaguna-identification');

  const fallback = generateLocalAyushResponse('Tell me about Nadi Pariksha history', ctx);
  assert.ok(fallback.text.includes('Ananya'));
  assert.strictEqual(fallback.actionType, undefined);
});
