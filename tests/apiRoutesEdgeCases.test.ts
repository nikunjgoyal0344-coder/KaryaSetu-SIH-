import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { resetRateLimiter } from '@/lib/security';
import { INITIAL_STUDENT } from '@/lib/seedData';
import { POST as chatPost } from '@/app/api/ai/chat/route';
import { POST as explainPost } from '@/app/api/ai/explain/route';
import { POST as diagnosticsPost } from '@/app/api/skills/diagnostics/route';
import { POST as loginPost } from '@/app/api/auth/login/route';

function makePost(url: string, body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

test('POST /api/ai/chat handles live Gemini success, non-OK fallback, and network error fallback cleanly', async () => {
  resetRateLimiter();

  const invalidJsonReq = new NextRequest('http://localhost/api/ai/chat', {
    method: 'POST',
    body: '{invalid-json',
  });
  assert.strictEqual((await chatPost(invalidJsonReq)).status, 400);

  const originalFetch = globalThis.fetch;
  try {
    // 1. Live Gemini response path (validates x-goog-api-key header forwarding)
    let seenHeaderKey = '';
    globalThis.fetch = (async (_url, init) => {
      const headers = new Headers(init?.headers);
      seenHeaderKey = headers.get('x-goog-api-key') || '';
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'Gemini AFI verified guidance response.' }] } }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    }) as typeof fetch;

    const okRes = await chatPost(
      makePost('http://localhost/api/ai/chat', {
        apiKey: 'AIzaSyTestMockKeyWithSufficientLength12345',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi' },
          { role: 'user', content: 'Explain Bhasma AFI limits' },
        ],
        context: { readinessScore: 88, gaps: ['Rasashastra QA'] },
      })
    );
    assert.strictEqual(okRes.status, 200);
    const okData = await okRes.json();
    assert.strictEqual(seenHeaderKey, 'AIzaSyTestMockKeyWithSufficientLength12345');
    assert.strictEqual(okData.provider, 'Google Gemini 1.5 Flash');
    assert.match(okData.reply, /Gemini AFI verified/);

    // 2. Non-200 HTTP from Gemini falls back gracefully to offline clinical engine
    globalThis.fetch = (async () => new Response('Quota exceeded', { status: 429 })) as typeof fetch;
    const fallbackRes = await chatPost(
      makePost('http://localhost/api/ai/chat', {
        apiKey: 'AIzaSyTestMockKeyWithSufficientLength12345',
        messages: [{ role: 'user', content: 'Check ABC credits' }],
      })
    );
    assert.strictEqual(fallbackRes.status, 200);
    const fallbackData = await fallbackRes.json();
    assert.match(fallbackData.provider, /Offline \/ Local Mode/);

    // 3. Thrown fetch timeout/network error falls back cleanly without crashing
    globalThis.fetch = (async () => {
      throw new Error('Network timeout');
    }) as typeof fetch;
    const errFallbackRes = await chatPost(
      makePost('http://localhost/api/ai/chat', {
        apiKey: 'AIzaSyTestMockKeyWithSufficientLength12345',
        messages: [{ role: 'user', content: 'Panchakarma protocols' }],
      })
    );
    assert.strictEqual(errFallbackRes.status, 200);
    assert.match((await errFallbackRes.json()).reply, /Panchakarma/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('POST /api/ai/explain and POST /api/skills/diagnostics validate payloads, RBAC, and clamping', async () => {
  resetRateLimiter();

  // Explain edge cases
  const explainMalformed = new NextRequest('http://localhost/api/ai/explain', { method: 'POST', body: 'bad' });
  assert.strictEqual((await explainPost(explainMalformed)).status, 400);
  assert.strictEqual((await explainPost(makePost('http://localhost/api/ai/explain', {}))).status, 400);
  assert.strictEqual(
    (await explainPost(makePost('http://localhost/api/ai/explain', { opportunityId: 'opp-does-not-exist' }))).status,
    404
  );

  const customExplainRes = await explainPost(
    makePost('http://localhost/api/ai/explain', {
      opportunityId: 'opp-2',
      student: INITIAL_STUDENT,
    })
  );
  assert.strictEqual(customExplainRes.status, 200);
  const explainJson = await customExplainRes.json();
  assert.ok(typeof explainJson.cosineSimilarity === 'number');

  // Diagnostics validation & RBAC
  const diagBadJson = new NextRequest('http://localhost/api/skills/diagnostics', { method: 'POST', body: 'bad' });
  assert.strictEqual((await diagnosticsPost(diagBadJson)).status, 400);
  assert.strictEqual((await diagnosticsPost(makePost('http://localhost/api/skills/diagnostics', {}))).status, 400);

  const indLogin = await loginPost(makePost('http://localhost/api/auth/login', { role: 'industry' }));
  const { token: industryToken } = await indLogin.json();
  const forbiddenDiag = await diagnosticsPost(
    makePost(
      'http://localhost/api/skills/diagnostics',
      { skillId: 'nadi-pariksha', levelGain: 1 },
      { authorization: `Bearer ${industryToken}` }
    )
  );
  assert.strictEqual(forbiddenDiag.status, 403);

  const validDiag = await diagnosticsPost(
    makePost('http://localhost/api/skills/diagnostics', {
      skillId: 'nadi-pariksha',
      levelGain: 100, // Clamped safely to 5
      moduleTitle: 'Advanced Nadi Module',
    })
  );
  assert.strictEqual(validDiag.status, 200);
});
