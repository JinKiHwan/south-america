import { z } from 'zod';
import { newsletterId } from '../../../../../shared/newsletter';
import { getDatabase } from '../../../../lib/firebase';
import { newsletterDto, cleanNewsletter } from '../../../../lib/newsletter';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const admin = await requireAdmin(event);
  const id = newsletterId.safeParse(getRouterParam(event, 'id'));
  const input = z
    .object({
      version: z.number().int().positive(),
      status: z.enum(['published', 'hidden', 'deleted']),
    })
    .strict()
    .safeParse(await readLimitedJson(event, 2048));
  if (!id.success || !input.success)
    throw createError({
      statusCode: 400,
      statusMessage: '변경할 상태를 확인해주세요.',
    });
  const db = getDatabase();
  const ref = db.collection('newsletters').doc(id.data);
  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.data();
    if (!current)
      throw createError({
        statusCode: 404,
        statusMessage: '소식지를 찾을 수 없습니다.',
      });
    if (current.version !== input.data.version)
      throw createError({
        statusCode: 409,
        statusMessage: '다른 창에서 변경되었습니다. 목록을 새로고침해주세요.',
      });
    if (current.status === 'deleted' && input.data.status === 'published')
      throw createError({
        statusCode: 400,
        statusMessage: '휴지통의 글은 숨김 상태로 복원한 뒤 공개해주세요.',
      });
    if (input.data.status === 'published')
      cleanNewsletter({
        ...current,
        status: 'published',
        attachmentId: current.attachment?.id || null,
      });
    const now = new Date().toISOString();
    const next = {
      ...current,
      status: input.data.status,
      version: current.version + 1,
      updatedAt: now,
      updatedBy: admin.username,
      publishedAt:
        input.data.status === 'published'
          ? current.publishedAt || now
          : current.publishedAt,
    };
    tx.update(ref, next);
    return newsletterDto(doc.id, next);
  });
});
