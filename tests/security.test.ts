import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, createSessionToken, hashToken } from '../server/lib/password.ts';
import { createDefaultContent, heroSchema, missionarySchema, parseSiteContent } from '../shared/site-content.ts';

test('passwords use unique salted hashes; wrong and malformed credentials fail', async () => {
  const password = 'Example-only-test-pass!';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('wrong password', first), false);
  for (const value of ['', password, 'scrypt$bad$bad']) {
    assert.equal(await verifyPassword(password, value), false);
  }
});

test('sessions use unguessable tokens and store only a hash', () => {
  const token = createSessionToken();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.notEqual(token, createSessionToken());
  assert.notEqual(token, hashToken(token));
});

test('content accepts all languages and rejects unsafe image sources and oversized text', () => {
  const defaults = createDefaultContent();
  assert.equal(heroSchema.safeParse(defaults.hero).success, true);
  assert.equal(missionarySchema.safeParse(defaults.missionary).success, true);
  for (const imageUrl of ['https://untrusted.example/image.png', 'javascript:alert(1)', 'data:image/svg+xml,<svg/>', '//evil.example/image.png']) {
    assert.equal(heroSchema.safeParse({ ...defaults.hero, imageUrl }).success, false);
  }
  const oversized = structuredClone(defaults.hero);
  oversized.translations.ko.title = '가'.repeat(181);
  assert.equal(heroSchema.safeParse(oversized).success, false);
  assert.equal(heroSchema.safeParse({ ...defaults.hero, alignment: 'bottom' }).success, false);
  assert.equal(heroSchema.safeParse({ ...defaults.hero, passwordHash: 'unexpected' }).success, false);
});

test('public content excludes internal audit fields and preserves authored line breaks', () => {
  const defaults = createDefaultContent();
  defaults.hero.translations.ko.title = '첫 번째 줄\n두 번째 줄';
  const parsed = parseSiteContent({ ...defaults, updatedBy: 'private-admin-id', secret: 'never public' });
  assert.equal(parsed.hero.translations.ko.title, '첫 번째 줄\n두 번째 줄');
  assert.equal('updatedBy' in parsed, false);
  assert.equal('secret' in parsed, false);
  assert.notEqual(createDefaultContent().hero.translations.ko.title, defaults.hero.translations.ko.title);
});
