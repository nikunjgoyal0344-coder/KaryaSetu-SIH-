import test from 'node:test';
import assert from 'node:assert/strict';
import { AYUSH_SKILLS_TAXONOMY, COMPETENCY_FRAMEWORK } from '../lib/taxonomy.ts';
import { translations, t } from '../lib/translations.ts';
import type { TranslationKey } from '../lib/translations.ts';
import { isFirebaseConfigured } from '../lib/firebase/config.ts';

test('AYUSH skills taxonomy has unique IDs, valid NSQF levels, and normalized domain weights', () => {
  const ids = new Set<string>();
  for (const item of AYUSH_SKILLS_TAXONOMY) {
    assert.ok(item.id.length > 0);
    assert.ok(!ids.has(item.id), `Duplicate skill ID found: ${item.id}`);
    ids.add(item.id);
    assert.ok(item.nsqfLevel >= 4 && item.nsqfLevel <= 8);
  }

  const totalWeight = Object.values(COMPETENCY_FRAMEWORK.domainWeights).reduce((sum, w) => sum + w, 0);
  assert.ok(Math.abs(totalWeight - 1.0) < 0.01, `Domain weights should sum to 1.0, got ${totalWeight}`);
});

test('Bilingual EN and HI translations have 100% key parity and non-empty values', () => {
  const enKeys = Object.keys(translations.en) as TranslationKey[];
  const hiKeys = new Set(Object.keys(translations.hi));

  for (const key of enKeys) {
    assert.ok(hiKeys.has(key), `Missing Hindi translation for key: ${key}`);
    assert.ok(translations.en[key].trim().length > 0, `Empty EN translation for ${key}`);
    assert.ok(translations.hi[key].trim().length > 0, `Empty HI translation for ${key}`);
    assert.strictEqual(t(key, 'hi'), translations.hi[key]);
  }
});

test('isFirebaseConfigured returns false with demo defaults and true when live keys exist', () => {
  const prevKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const prevProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    assert.strictEqual(isFirebaseConfigured(), false);

    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'demo-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'karyasetu-dev';
    assert.strictEqual(isFirebaseConfigured(), false);

    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'AIzaSyLiveRealKey123';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'karyasetu-prod';
    assert.strictEqual(isFirebaseConfigured(), true);
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = prevKey;
    if (prevProject === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = prevProject;
  }
});
