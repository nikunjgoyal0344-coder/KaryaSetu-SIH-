import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextRequest } from 'next/server';
import { computeFormatBits, generateQrMatrix } from '@/lib/qrEncoder';
import {
  computeWeightedCompetencyScore,
  signStudentCredential,
  verifyCredentialSignature,
} from '@/lib/credentialAttestation';
import { INITIAL_STUDENT } from '@/lib/seedData';
import { resetRateLimiter } from '@/lib/security';
import { GET as profileGenGet } from '@/app/api/ai/profile-generate/route';
import { GET as verifyGet, POST as verifyPost } from '@/app/api/verify/route';
import QrCodeSvg from '@/components/QrCodeSvg';

test('ISO QR encoder generates valid finder patterns, timing tracks, dark module, and BCH format bits', () => {
  // Known ISO/IEC 18004 EC-L Mask 0 format string: 111011111000100 (0x77c4)
  assert.strictEqual(computeFormatBits(0), 0x77c4);
  const allFormatWords = new Set(Array.from({ length: 8 }, (_, mask) => computeFormatBits(mask)));
  assert.strictEqual(allFormatWords.size, 8);

  const v1 = generateQrMatrix('https://a.in');
  assert.strictEqual(v1.length, 21);

  const v4 = generateQrMatrix('https://karyasetu.gov.in/verify?studentId=stu-1&sig=0x1234567890abcdef12345678');
  assert.ok(v4.length >= 33 && v4.length <= 37);

  const size = v4.length;
  // Top-left finder center (3,3), top-right finder center (3, size-4), bottom-left center (size-4, 3)
  assert.strictEqual(v4[3][3], true);
  assert.strictEqual(v4[3][size - 4], true);
  assert.strictEqual(v4[size - 4][3], true);
  // White finder rings
  assert.strictEqual(v4[1][1], false);
  assert.strictEqual(v4[1][size - 6], false);
  assert.strictEqual(v4[size - 6][1], false);
  // Mandatory dark module at (size - 8, 8)
  assert.strictEqual(v4[size - 8][8], true);
});

test('signStudentCredential and verifyCredentialSignature validate full hashes, QR tokens, and tampers', () => {
  const score = computeWeightedCompetencyScore(INITIAL_STUDENT);
  assert.ok(score >= 50 && score <= 99);

  const signed = signStudentCredential(INITIAL_STUDENT);
  assert.ok(signed.digitalSignature.startsWith('0x'));
  assert.strictEqual(signed.digitalSignature.length, 66);
  assert.ok(signed.verifyPath.startsWith('/verify?studentId='));

  const fullCheck = verifyCredentialSignature(signed.digitalSignature, signed.digitalSignature);
  assert.strictEqual(fullCheck.isAuthentic, true);
  assert.strictEqual(fullCheck.matchMode, 'full-digest');

  const prefixCheck = verifyCredentialSignature(signed.compactSignature, signed.digitalSignature);
  assert.strictEqual(prefixCheck.isAuthentic, true);
  assert.strictEqual(prefixCheck.matchMode, 'qr-prefix');

  // Single-character tamper fails strictly
  const lastChar = signed.digitalSignature.endsWith('0') ? '1' : '0';
  const tampered = signed.digitalSignature.slice(0, -1) + lastChar;
  const failCheck = verifyCredentialSignature(tampered, signed.digitalSignature);
  assert.strictEqual(failCheck.isAuthentic, false);
  assert.strictEqual(failCheck.matchMode, 'mismatch');

  // Too-short or malformed signature rejected
  assert.strictEqual(verifyCredentialSignature('0x1234', signed.digitalSignature).isAuthentic, false);
  assert.strictEqual(verifyCredentialSignature('non-hex-$$$$$$$', signed.digitalSignature).isAuthentic, false);
});

test('GET/POST /api/verify authenticates generated passports and catches forged signatures', async () => {
  resetRateLimiter();

  const genRes = await profileGenGet();
  assert.strictEqual(genRes.status, 200);
  const { profile } = await genRes.json();
  assert.ok(profile.verifyPath);

  // Full digest verification via POST
  const postOk = await verifyPost(
    new NextRequest('http://localhost/api/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        studentId: profile.studentId,
        signature: profile.digitalSignature,
      }),
    })
  );
  assert.strictEqual(postOk.status, 200);
  const postData = await postOk.json();
  assert.strictEqual(postData.verified, true);
  assert.strictEqual(postData.status, 'AUTHENTIC');
  assert.ok(postData.credential.endorsedSkills.length > 0);

  // Compact QR link query verification via GET
  const compactSig = new URL(`https://example.com${profile.verifyPath}`).searchParams.get('sig')!;
  const getOk = await verifyGet(
    new NextRequest(`http://localhost/api/verify?studentId=${profile.studentId}&sig=${compactSig}`)
  );
  assert.strictEqual(getOk.status, 200);
  assert.strictEqual((await getOk.json()).verified, true);

  // Tampered signature flagged cleanly
  const tamperRes = await verifyPost(
    new NextRequest('http://localhost/api/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        studentId: profile.studentId,
        signature: '0xdeadbeef00001111222233334444555566667777',
      }),
    })
  );
  assert.strictEqual(tamperRes.status, 200);
  const tamperData = await tamperRes.json();
  assert.strictEqual(tamperData.verified, false);
  assert.strictEqual(tamperData.status, 'TAMPERED');

  // Missing params -> 400; unknown student -> 404
  assert.strictEqual((await verifyGet(new NextRequest('http://localhost/api/verify'))).status, 400);
  assert.strictEqual(
    (
      await verifyPost(
        new NextRequest('http://localhost/api/verify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ studentId: 'stu-unknown', signature: profile.digitalSignature }),
        })
      )
    ).status,
    404
  );
});

test('QrCodeSvg renders accessible crisp SVG matrix markup', () => {
  const html = renderToStaticMarkup(
    React.createElement(QrCodeSvg, {
      value: 'https://karyasetu.gov.in/verify?studentId=stu-1&sig=0xabcdef1234567890',
      size: 112,
    })
  );
  assert.ok(html.includes('role="img"'));
  assert.ok(html.includes('shape-rendering="crispEdges"'));
  assert.ok(html.includes('<path'));
});
