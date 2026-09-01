import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyNewsletter,
  newsletterInputSchema,
  newsletterCopy,
} from '../shared/newsletter.ts';
import {
  cleanNewsletter,
  cleanNewsletterHtml,
} from '../server/lib/newsletter.ts';
import {
  beginPdfStorage,
  pdfUploadState,
  storePdfChunk,
  readPdfStream,
  pdfByteRange,
  validDriveUploadUrl,
  type PdfUploadRecord,
} from '../server/lib/pdf-storage.ts';

test('newsletter HTML preserves formatting and removes executable content', () => {
  const html = cleanNewsletterHtml(
    '<h2>소식</h2><p><strong>감사</strong><img src=x onerror=alert(1)><script>alert(2)</script><a href="javascript:alert(3)" onclick="x()">link</a></p><iframe src="https://evil.example"></iframe>',
  );
  assert.match(html, /<h2>소식<\/h2>/);
  assert.match(html, /<strong>감사<\/strong>/);
  assert.doesNotMatch(html, /script|onerror|onclick|javascript|iframe|<img/);
});
test('publication requires meaningful Korean content, supports drafts and translation fallback', () => {
  const draft = emptyNewsletter();
  draft.translations.ko.title = '사역 소식';
  draft.translations.ko.body = '<p><br></p>';
  assert.ok(newsletterInputSchema.safeParse(draft).success);
  assert.equal(cleanNewsletter(draft).status, 'hidden');
  assert.throws(() => cleanNewsletter({ ...draft, status: 'published' }));
  draft.translations.ko.body = '<p>기도해주세요.</p>';
  assert.equal(
    cleanNewsletter({ ...draft, status: 'published' }).status,
    'published',
  );
  assert.equal(newsletterCopy(draft.translations, 'en').title, '사역 소식');
  draft.translations.en.title = 'A letter';
  assert.throws(() => cleanNewsletter({ ...draft, status: 'published' }));
  assert.equal(
    newsletterInputSchema.safeParse({
      ...draft,
      attachmentId: 'https://private.example',
    }).success,
    false,
  );
});
test('PDF ranges support resumed downloads and reject invalid/multiple ranges', () => {
  assert.equal(pdfByteRange(undefined, 1000), null);
  assert.deepEqual(pdfByteRange('bytes=100-199', 1000), {
    start: 100,
    end: 199,
  });
  assert.deepEqual(pdfByteRange('bytes=900-', 1000), { start: 900, end: 999 });
  assert.deepEqual(pdfByteRange('bytes=-20', 1000), { start: 980, end: 999 });
  for (const value of [
    'bytes=1000-',
    'bytes=300-100',
    'bytes=0-1,5-6',
    'bytes=-0',
    'invalid',
  ])
    assert.throws(() => pdfByteRange(value, 1000));
});
test('Drive resumable requests cannot be redirected to arbitrary hosts', () => {
  assert.equal(
    validDriveUploadUrl(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=test',
    ),
    true,
  );
  for (const value of [
    'http://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=x',
    'https://evil.example/?upload_id=x',
    'https://www.googleapis.com/drive/v3/files?uploadType=resumable&upload_id=x',
  ])
    assert.equal(validDriveUploadUrl(value), false);
});

test('Drive adapter keeps authentication server-side and handles resumable and streamed responses', async (t) => {
  const driveEnvironment = {
    GOOGLE_DRIVE_CLIENT_ID: 'test.apps.googleusercontent.com',
    GOOGLE_DRIVE_CLIENT_SECRET: 'test-client-secret',
    GOOGLE_DRIVE_REFRESH_TOKEN: 'test-refresh-token',
    GOOGLE_DRIVE_PDF_FOLDER_ID: 'test-folder-id',
  };
  const previousEnvironment = Object.fromEntries(
    Object.keys(driveEnvironment).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, driveEnvironment);
  t.after(() => {
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const session =
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=test';
  const record: PdfUploadRecord = {
    id: 'test-upload',
    postId: 'test-post',
    owner: 'tester',
    name: 'test.pdf',
    size: 8,
    fingerprint: '0'.repeat(64),
    provider: 'drive',
    sessionUrl: null,
    remoteId: null,
    offset: 0,
    state: 'uploading',
    expiresAt: new Date(Date.now() + 100000).toISOString(),
  };
  let step = 0;
  t.mock.method(globalThis, 'fetch', async (url: any, options: any = {}) => {
    step++;
    if (step === 1) {
      assert.equal(url, 'https://oauth2.googleapis.com/token');
      return Response.json({
        access_token: 'test-access-token',
        expires_in: 3600,
      });
    }
    if (step === 2) {
      assert.match(url, /uploadType=resumable/);
      assert.equal(options.headers.Authorization, 'Bearer test-access-token');
      assert.equal(JSON.parse(options.body).mimeType, 'application/pdf');
      assert.deepEqual(JSON.parse(options.body).parents, ['test-folder-id']);
      return new Response(null, {
        status: 200,
        headers: { Location: session },
      });
    }
    if (step === 3) {
      assert.equal(url, session);
      assert.equal(options.headers['Content-Range'], 'bytes */8');
      return new Response(null, { status: 308 });
    }
    if (step === 4) {
      assert.equal(options.redirect, 'manual');
      return new Response(null, {
        status: 308,
        headers: { Range: 'bytes=0-3' },
      });
    }
    if (step === 5) {
      assert.equal(options.headers['Content-Range'], 'bytes 4-7/8');
      return Response.json({
        id: 'drive-file-id',
        size: '8',
        mimeType: 'application/pdf',
      });
    }
    assert.equal(step, 6);
    assert.match(url, /drive-file-id\?alt=media$/);
    assert.equal(options.headers.Authorization, 'Bearer test-access-token');
    assert.equal(options.headers.Range, 'bytes=0-3');
    return new Response('%PDF', { status: 206 });
  });
  record.sessionUrl = await beginPdfStorage(record);
  assert.equal(record.sessionUrl, session);
  assert.equal((await pdfUploadState(record)).offset, 0);
  Object.assign(record, await storePdfChunk(record, Buffer.from('%PDF')));
  assert.equal(record.offset, 4);
  assert.equal(record.state, 'uploading');
  Object.assign(record, await storePdfChunk(record, Buffer.from('-1.7')));
  assert.equal(record.state, 'complete');
  assert.equal(record.remoteId, 'drive-file-id');
  const stream = await readPdfStream(record, { start: 0, end: 3 });
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  assert.equal(Buffer.concat(chunks).toString(), '%PDF');
  assert.equal(step, 6);
});
