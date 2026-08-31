import { z } from 'zod';
import {
  newsletterId,
  newsletterInputSchema,
} from '../../../../shared/newsletter';
import { getDatabase } from '../../../lib/firebase';
import {
  cleanNewsletter,
  newsletterCountries,
  newsletterDto,
  plainNewsletterText,
} from '../../../lib/newsletter';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const admin = await requireAdmin(event);
  const id = newsletterId.safeParse(getRouterParam(event, 'id'));
  const input = z
    .object({
      version: z.number().int().positive(),
      content: newsletterInputSchema,
    })
    .strict()
    .safeParse(await readLimitedJson(event, 768 * 1024));
  if (!id.success || !input.success)
    throw createError({
      statusCode: 400,
      statusMessage: '입력 내용을 확인해주세요.',
    });
  const content = cleanNewsletter(input.data.content);
  if (!(await newsletterCountries()).some((c) => c.id === content.countryId))
    throw createError({
      statusCode: 400,
      statusMessage: '등록된 국가를 선택해주세요.',
    });
  const db = getDatabase();
  const ref = db.collection('newsletters').doc(id.data);
  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.data();
    if (!current || current.status === 'deleted')
      throw createError({
        statusCode: 404,
        statusMessage: '소식지를 찾을 수 없습니다.',
      });
    if (current.version !== input.data.version)
      throw createError({
        statusCode: 409,
        statusMessage:
          '다른 창에서 수정되었습니다. 다시 열어 최신 내용을 확인해주세요.',
      });
    let attachment = null;
    if (content.attachmentId) {
      const file = (
        await tx.get(
          db.collection('newsletterUploads').doc(content.attachmentId),
        )
      ).data();
      if (!file || file.postId !== id.data || file.state !== 'complete')
        throw createError({
          statusCode: 400,
          statusMessage: '업로드가 완료된 이 글의 PDF만 첨부할 수 있습니다.',
        });
      attachment = {
        id: content.attachmentId,
        name: file.name,
        size: file.size,
      };
    }
    const { attachmentId, ...fields } = content;
    const now = new Date().toISOString();
    const next = {
      ...current,
      ...fields,
      attachment,
      version: current.version + 1,
      updatedAt: now,
      updatedBy: admin.username,
      publishedAt:
        content.status === 'published'
          ? current.publishedAt || now
          : current.publishedAt,
      readTime: Math.max(
        1,
        Math.ceil(
          plainNewsletterText(content.translations.ko.body).split(/\s+/)
            .length / 150,
        ),
      ),
    };
    tx.set(ref, next);
    return newsletterDto(id.data, next);
  });
});
