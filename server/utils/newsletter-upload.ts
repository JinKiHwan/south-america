import { randomUUID } from 'node:crypto';
import { getDatabase } from '../lib/firebase';
import type { PdfUploadRecord } from '../lib/pdf-storage';
import { newsletterId } from '../../shared/newsletter';

export async function withPdfUpload<T>(
  id: unknown,
  owner: string,
  action: (record: PdfUploadRecord) => Promise<T>,
) {
  const parsed = newsletterId.safeParse(id);
  if (!parsed.success)
    throw createError({
      statusCode: 404,
      statusMessage: '업로드를 찾을 수 없습니다.',
    });
  const db = getDatabase();
  const ref = db.collection('newsletterUploads').doc(parsed.data);
  const leaseId = randomUUID();
  const record = await db.runTransaction(async (tx) => {
    const data = (await tx.get(ref)).data() as PdfUploadRecord | undefined;
    if (!data || data.owner !== owner)
      throw createError({
        statusCode: 404,
        statusMessage: '업로드를 찾을 수 없습니다.',
      });
    if (
      new Date(data.expiresAt).getTime() < Date.now() &&
      data.state !== 'complete'
    )
      throw createError({
        statusCode: 410,
        statusMessage: '업로드가 만료되었습니다. 새로 시작해주세요.',
      });
    const post = (
      await tx.get(db.collection('newsletters').doc(data.postId))
    ).data();
    if (!post || post.status === 'deleted')
      throw createError({
        statusCode: 404,
        statusMessage: '글이 삭제되어 업로드할 수 없습니다.',
      });
    if ((data.leaseUntil || 0) > Date.now())
      throw createError({
        statusCode: 409,
        statusMessage: '파일을 전송 중입니다. 잠시 후 이어 올려주세요.',
      });
    tx.update(ref, { leaseId, leaseUntil: Date.now() + 120_000 });
    return data;
  });
  try {
    return await action(record);
  } finally {
    await db.runTransaction(async (tx) => {
      const data = (await tx.get(ref)).data();
      if (data?.leaseId === leaseId)
        tx.update(ref, { leaseUntil: 0, leaseId: '' });
    });
  }
}
export function uploadDto(record: PdfUploadRecord) {
  return {
    id: record.id,
    postId: record.postId,
    name: record.name,
    size: record.size,
    fingerprint: record.fingerprint,
    offset: record.offset,
    state: record.state,
    provider: record.provider,
  };
}
