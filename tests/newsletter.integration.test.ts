import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getDatabase } from '../server/lib/firebase.ts';
import { hashPassword } from '../server/lib/password.ts';
import {
  emptyNewsletter,
  PDF_CHUNK_BYTES,
  PDF_MAX_BYTES,
} from '../shared/newsletter.ts';

const base = process.env.TEST_BASE_URL;
test(
  'newsletter lifecycle, dynamic countries, private resumable PDFs and hidden/deleted access',
  { skip: !base },
  async () => {
    assert.ok(process.env.FIREBASE_PROJECT_ID?.startsWith('demo-'));
    assert.match(
      process.env.FIRESTORE_EMULATOR_HOST || '',
      /^127\.0\.0\.1:\d+$/,
    );
    const db = getDatabase();
    const id = randomUUID();
    const secondId = randomUUID();
    const username = 'qa_newsletter_' + randomBytes(4).toString('hex');
    const password = randomBytes(20).toString('hex');
    await db
      .collection('adminAccounts')
      .doc(username)
      .set({
        username,
        passwordHash: await hashPassword(password),
        role: 'master',
        active: true,
        sessionVersion: 1,
      });
    const req = (path: string, options: RequestInit = {}) =>
      fetch(base + path, { redirect: 'manual', ...options });
    const headers: Record<string, string> = {
      Origin: base!,
      'Content-Type': 'application/json',
    };
    let uploadId = '';
    let countryId = '';
    try {
      const login = await req('/api/admin/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, password }),
      });
      assert.equal(login.status, 200);
      headers.Cookie = login.headers.get('set-cookie')!.split(';')[0]!;
      assert.equal((await req('/api/admin/newsletters')).status, 401);
      const configured = await (
        await req('/api/admin/pdf/status', { headers })
      ).json();
      assert.equal(
        configured.provider,
        'emulator',
        'Never send integration fixtures to Google Drive.',
      );
      const name = '테스트 국가 ' + id.slice(0, 8);
      const country = await req('/api/admin/newsletter-countries', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name }),
      });
      assert.equal(country.status, 200);
      countryId = (await country.json()).id;
      assert.equal(
        (
          await req('/api/admin/newsletter-countries', {
            method: 'POST',
            headers,
            body: JSON.stringify({ name }),
          })
        ).status,
        409,
      );
      assert.ok(
        (await (await req('/api/newsletter-countries')).json()).some(
          (c: any) => c.id === countryId,
        ),
      );
      const content = emptyNewsletter();
      content.countryId = countryId;
      content.translations.ko.title = '공개 전 소식지';
      content.translations.ko.body =
        '<h2>기도 소식</h2><p>함께해주세요.<script>alert(1)</script><img src=x onerror=alert(1)></p>';
      const created = await req('/api/admin/newsletters', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id, content }),
      });
      assert.equal(created.status, 200, await created.clone().text());
      let post = await created.json();
      assert.doesNotMatch(post.translations.ko.body, /script|onerror|<img/);
      assert.equal((await req('/api/newsletters/' + id)).status, 404);
      assert.equal((await req('/api/newsletters/' + id + '/pdf')).status, 404);
      assert.ok(
        !(await (await req('/api/newsletters')).json()).some(
          (p: any) => p.id === id,
        ),
      );

      const pdf = Buffer.alloc(PDF_CHUNK_BYTES * 2 + 1024, 32);
      pdf.write('%PDF-1.7\n');
      pdf.write('\n%%EOF', pdf.length - 6);
      const fingerprint = createHash('sha256')
        .update(pdf.subarray(0, 65536))
        .digest('hex');
      const meta = {
        postId: id,
        name: '기도 소식.pdf',
        size: pdf.length,
        fingerprint,
      };
      assert.equal(
        (
          await req('/api/admin/pdf', {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...meta, size: PDF_MAX_BYTES + 1 }),
          })
        ).status,
        400,
      );
      const started = await req('/api/admin/pdf', {
        method: 'POST',
        headers,
        body: JSON.stringify(meta),
      });
      assert.equal(started.status, 200);
      let upload = await started.json();
      uploadId = upload.id;
      assert.equal('sessionUrl' in upload, false);
      assert.equal('remoteId' in upload, false);
      assert.equal((await req('/api/admin/pdf/' + uploadId)).status, 401);
      const sendChunk = (offset: number, chunk: Buffer, origin = base!) =>
        req('/api/admin/pdf/' + uploadId, {
          method: 'PUT',
          headers: {
            ...headers,
            Origin: origin,
            'Content-Type': 'application/pdf',
            'Content-Range': `bytes ${offset}-${offset + chunk.length - 1}/${pdf.length}`,
          },
          body: chunk,
        });
      assert.equal(
        (
          await sendChunk(
            0,
            pdf.subarray(0, PDF_CHUNK_BYTES),
            'https://evil.example',
          )
        ).status,
        403,
      );
      assert.equal(
        (await sendChunk(0, Buffer.alloc(PDF_CHUNK_BYTES, 32))).status,
        400,
      );
      assert.equal(
        (await sendChunk(256, pdf.subarray(0, PDF_CHUNK_BYTES))).status,
        409,
      );
      const first = await sendChunk(0, pdf.subarray(0, PDF_CHUNK_BYTES));
      assert.equal(first.status, 200);
      upload = await first.json();
      assert.equal(upload.offset, PDF_CHUNK_BYTES);
      assert.equal(
        (await sendChunk(0, pdf.subarray(0, PDF_CHUNK_BYTES))).status,
        409,
      );
      upload = await (
        await req('/api/admin/pdf/' + uploadId, { headers })
      ).json();
      assert.equal(upload.offset, PDF_CHUNK_BYTES);
      for (
        let offset = upload.offset;
        offset < pdf.length;
        offset += PDF_CHUNK_BYTES
      ) {
        const response = await sendChunk(
          offset,
          pdf.subarray(offset, Math.min(offset + PDF_CHUNK_BYTES, pdf.length)),
        );
        assert.equal(response.status, 200);
        upload = await response.json();
      }
      assert.equal(upload.state, 'complete');
      content.attachmentId = uploadId;
      content.status = 'published';
      const saved = await req('/api/admin/newsletters/' + id, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ version: post.version, content }),
      });
      assert.equal(saved.status, 200, await saved.clone().text());
      post = await saved.json();
      assert.equal(
        (
          await req('/api/admin/newsletters/' + id, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ version: 1, content }),
          })
        ).status,
        409,
      );
      const visible = await req('/api/newsletters/' + id);
      assert.equal(visible.status, 200);
      const publicPost = await visible.json();
      assert.equal('createdBy' in publicPost, false);
      assert.equal(publicPost.attachment.id, uploadId);
      const downloaded = await req('/api/newsletters/' + id + '/pdf');
      assert.equal(downloaded.status, 200);
      assert.match(
        downloaded.headers.get('content-disposition')!,
        /^attachment;/,
      );
      assert.equal(
        createHash('sha256')
          .update(Buffer.from(await downloaded.arrayBuffer()))
          .digest('hex'),
        createHash('sha256').update(pdf).digest('hex'),
      );
      const partial = await req('/api/newsletters/' + id + '/pdf', {
        headers: { Range: 'bytes=0-7' },
      });
      assert.equal(partial.status, 206);
      assert.equal(await partial.text(), '%PDF-1.7');
      assert.equal(
        (
          await req('/api/newsletters/' + id + '/pdf', {
            headers: { Range: 'bytes=999999999-' },
          })
        ).status,
        416,
      );

      const other = emptyNewsletter();
      other.translations.ko.title = '다른 글';
      other.translations.ko.body = '<p>다른 내용</p>';
      assert.equal(
        (
          await req('/api/admin/newsletters', {
            method: 'POST',
            headers,
            body: JSON.stringify({ id: secondId, content: other }),
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await req('/api/admin/newsletters/' + secondId, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              version: 1,
              content: { ...other, attachmentId: uploadId },
            }),
          })
        ).status,
        400,
      );
      for (const status of ['hidden', 'deleted', 'hidden']) {
        const changed = await req('/api/admin/newsletters/' + id + '/state', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status, version: post.version }),
        });
        assert.equal(changed.status, 200);
        post = await changed.json();
        assert.equal((await req('/api/newsletters/' + id)).status, 404);
        assert.equal(
          (await req('/api/newsletters/' + id + '/pdf')).status,
          404,
        );
      }
      assert.equal(post.status, 'hidden');
      assert.equal(
        (
          await req('/api/admin/newsletters/' + id + '/state', {
            method: 'PATCH',
            headers: { ...headers, Origin: 'https://evil.example' },
            body: JSON.stringify({
              status: 'published',
              version: post.version,
            }),
          })
        ).status,
        403,
      );
      await req('/api/admin/logout', { method: 'POST', headers });
    } finally {
      await Promise.all([
        db.collection('newsletters').doc(id).delete(),
        db.collection('newsletters').doc(secondId).delete(),
        db.collection('adminAccounts').doc(username).delete(),
      ]);
      if (countryId)
        await db.collection('newsletterCountries').doc(countryId).delete();
      if (uploadId) {
        await db.collection('newsletterUploads').doc(uploadId).delete();
        await unlink(resolve('.data/newsletter-pdfs', uploadId + '.pdf')).catch(
          () => {},
        );
      }
      await db.terminate();
    }
  },
);
