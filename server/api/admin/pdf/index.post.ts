import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { newsletterId, PDF_MAX_BYTES } from '../../../../shared/newsletter';
import { getDatabase } from '../../../lib/firebase';
import {
  beginPdfStorage,
  pdfStorageProvider,
  type PdfUploadRecord,
} from '../../../lib/pdf-storage';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const admin = await requireAdmin(event);
  const provider = pdfStorageProvider();
  if (!provider)
    throw createError({
      statusCode: 503,
      statusMessage:
        'Google Drive 연결 설정이 필요합니다. 글은 PDF 없이 저장할 수 있습니다.',
    });
  const input = z
    .object({
      postId: newsletterId,
      name: z
        .string()
        .trim()
        .min(5)
        .max(160)
        .regex(/^[^/\\\u0000-\u001f]+\.pdf$/i),
      size: z.number().int().min(8).max(PDF_MAX_BYTES),
      fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict()
    .safeParse(await readLimitedJson(event, 2048));
  if (!input.success)
    throw createError({
      statusCode: 400,
      statusMessage: '500MB 이하 PDF 파일을 선택해주세요.',
    });
  const db = getDatabase();
  const post = (
    await db.collection('newsletters').doc(input.data.postId).get()
  ).data();
  if (!post || post.status === 'deleted')
    throw createError({
      statusCode: 404,
      statusMessage: '먼저 글을 저장해주세요.',
    });
  const record: PdfUploadRecord = {
    ...input.data,
    id: randomUUID(),
    owner: admin.username,
    provider,
    offset: 0,
    state: 'uploading',
    remoteId: null,
    sessionUrl: null,
    expiresAt: new Date(Date.now() + 6 * 86400_000).toISOString(),
  };
  record.sessionUrl = await beginPdfStorage(record);
  await db.collection('newsletterUploads').doc(record.id).create(record);
  return uploadDto(record);
});
