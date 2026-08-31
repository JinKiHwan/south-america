import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { Timestamp } from 'firebase-admin/firestore';
import { getDatabase, getImageBucket } from '../server/lib/firebase.ts';
import { hashPassword, hashToken, createSessionToken } from '../server/lib/password.ts';
import { createDefaultContent } from '../shared/site-content.ts';

const base = process.env.TEST_BASE_URL;
test('admin API: authorization, CSRF, saved content, uploads, conflicts and revocation', { skip: !base }, async () => {
  assert.ok(process.env.FIREBASE_PROJECT_ID?.startsWith('demo-'), 'Integration tests must use a demo Firebase project.');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST?.startsWith('127.0.0.1:'));
  assert.ok(process.env.FIREBASE_STORAGE_EMULATOR_HOST?.startsWith('127.0.0.1:'));
  const db = getDatabase();
  const username = 'qa_admin';
  const password = randomBytes(18).toString('hex');
  const account = db.collection('adminAccounts').doc(username);
  await account.set({ username, passwordHash: await hashPassword(password), role: 'master', active: true, sessionVersion: 1 });
  await db.collection('siteContent').doc('home').set(createDefaultContent());
  let uploadedUrl = '';

  const request = (path: string, options: RequestInit = {}) => fetch(base + path, { redirect: 'manual', ...options });
  const jsonHeaders = { 'Content-Type': 'application/json', Origin: base! };
  let cookie = '';
  try {
    assert.equal((await request('/api/admin/content')).status, 401);
    assert.equal((await request('/admin')).status, 302);
    assert.equal((await request('/api/admin/session', { headers: { Cookie: 'sa_admin_session=' + 'a'.repeat(64) } })).status, 401);
    assert.equal((await request('/api/admin/login', {
      method: 'POST', headers: { ...jsonHeaders, Origin: 'https://foreign.example' }, body: JSON.stringify({ username, password }),
    })).status, 403);

    const invalid = await request('/api/admin/login', {
      method: 'POST', headers: jsonHeaders, body: JSON.stringify({ username, password: 'wrong-password' }),
    });
    assert.equal(invalid.status, 401);
    const login = await request('/api/admin/login', {
      method: 'POST', headers: jsonHeaders, body: JSON.stringify({ username, password }),
    });
    assert.equal(login.status, 200, await login.text());
    const setCookie = login.headers.get('set-cookie')!;
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Strict/i);
    cookie = setCookie.split(';')[0]!;
    const authHeaders = { ...jsonHeaders, Cookie: cookie };
    const session = await request('/api/admin/session', { headers: authHeaders });
    assert.equal((await session.json()).username, username);
    assert.equal(session.headers.get('cache-control'), 'no-store, private');

    const home = await (await request('/api/admin/content', { headers: authHeaders })).json();
    home.hero.translations.ko.title = '테스트로 저장한 제목\n두 번째 줄';
    home.hero.alignment = 'right';
    assert.equal((await request('/api/admin/content/hero', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ content: home.hero, version: home.version }),
    })).status, 403);
    const save = await request('/api/admin/content/hero', {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ content: home.hero, version: home.version }),
    });
    assert.equal(save.status, 200, await save.text());
    const published = await (await request('/api/site-content')).json();
    assert.equal(published.hero.translations.ko.title, home.hero.translations.ko.title);
    assert.equal(published.hero.alignment, 'right');
    assert.equal('updatedBy' in published, false);
    assert.equal('passwordHash' in published, false);
    assert.equal((await request('/api/admin/content/hero', {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ content: home.hero, version: home.version }),
    })).status, 409);

    assert.equal((await request('/api/admin/upload', {
      method: 'POST', headers: { Origin: base!, 'Content-Type': 'image/png' }, body: Buffer.from('x'),
    })).status, 401);
    assert.equal((await request('/api/admin/upload', {
      method: 'POST', headers: { ...authHeaders, 'Content-Type': 'image/svg+xml' }, body: '<svg></svg>',
    })).status, 415);
    assert.equal((await request('/api/admin/upload', {
      method: 'POST', headers: { ...authHeaders, 'Content-Type': 'image/png' }, body: Buffer.from('not-an-image'),
    })).status, 400);
    assert.equal((await request('/api/admin/upload', {
      method: 'POST', headers: { ...authHeaders, 'Content-Type': 'image/png' }, body: Buffer.alloc(4 * 1024 * 1024 + 1),
    })).status, 413);
    const image = await sharp({ create: { width: 900, height: 1200, channels: 3, background: '#b77559' } }).png().toBuffer();
    const upload = await request('/api/admin/upload', {
      method: 'POST', headers: { ...authHeaders, 'Content-Type': 'image/png' }, body: image,
    });
    assert.equal(upload.status, 200);
    uploadedUrl = (await upload.json()).imageUrl;
    const downloaded = await request(uploadedUrl);
    assert.equal(downloaded.status, 200);
    assert.equal(downloaded.headers.get('content-type'), 'image/webp');
    const metadata = await sharp(Buffer.from(await downloaded.arrayBuffer())).metadata();
    assert.equal(metadata.width! / metadata.height!, 3 / 4);
    const current = await (await request('/api/admin/content', { headers: authHeaders })).json();
    current.missionary.imageUrl = uploadedUrl;
    current.missionary.translations.ko.description = '직접 입력한 소개입니다.\n\n두 번째 문단입니다.';
    assert.equal((await request('/api/admin/content/missionary', {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ content: current.missionary, version: current.version }),
    })).status, 200);
    assert.equal((await (await request('/api/site-content')).json()).missionary.imageUrl, uploadedUrl);

    const expired = createSessionToken();
    await db.collection('adminSessions').doc(hashToken(expired)).set({
      username, role: 'master', sessionVersion: 1, expiresAt: Timestamp.fromMillis(Date.now() - 1000),
    });
    assert.equal((await request('/api/admin/session', { headers: { Cookie: 'sa_admin_session=' + expired } })).status, 401);
    await db.collection('adminSessions').doc(hashToken(expired)).delete();
    await account.update({ active: false });
    assert.equal((await request('/api/admin/content', { headers: authHeaders })).status, 401);
    await account.update({ active: true });
    const logout = await request('/api/admin/logout', { method: 'POST', headers: authHeaders });
    assert.equal(logout.status, 200);
    assert.equal((await request('/api/admin/session', { headers: authHeaders })).status, 401);
    const accountRecord = (await account.get()).data()!;
    assert.ok(!JSON.stringify(accountRecord).includes(password));
  } finally {
    await account.delete();
    await db.collection('siteContent').doc('home').set(createDefaultContent());
    const limits = await db.collection('adminLoginLimits').get();
    await Promise.all(limits.docs.map(doc => doc.ref.delete()));
    if (uploadedUrl) await getImageBucket().file('site-images/' + uploadedUrl.split('/').pop()).delete();
    await db.terminate();
  }
});
