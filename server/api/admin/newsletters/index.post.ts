import { z } from 'zod';
import { getDatabase } from '../../../lib/firebase';
import {
  newsletterInputSchema,
  newsletterId,
} from '../../../../shared/newsletter';
import {
  cleanNewsletter,
  newsletterCountries,
  newsletterDto,
  plainNewsletterText,
} from '../../../lib/newsletter';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const admin = await requireAdmin(event);
  const input = z
    .object({ id: newsletterId, content: newsletterInputSchema })
    .strict()
    .safeParse(await readLimitedJson(event, 768 * 1024));
  if (!input.success)
    throw createError({
      statusCode: 400,
      statusMessage: '제목, 본문, 국가와 첨부파일을 확인해주세요.',
    });
  const content = cleanNewsletter(input.data.content);
  if (content.attachmentId)
    throw createError({
      statusCode: 400,
      statusMessage: '글을 저장한 뒤 PDF를 첨부해주세요.',
    });
  if (!(await newsletterCountries()).some((c) => c.id === content.countryId))
    throw createError({
      statusCode: 400,
      statusMessage: '등록된 국가를 선택해주세요.',
    });
  const { attachmentId, ...fields } = content;
  const now = new Date().toISOString();
  const data = {
    ...fields,
    attachment: null,
    version: 1,
    createdAt: now,
    updatedAt: now,
    publishedAt: content.status === 'published' ? now : null,
    createdBy: admin.username,
    updatedBy: admin.username,
    readTime: Math.max(
      1,
      Math.ceil(
        plainNewsletterText(content.translations.ko.body).split(/\s+/).length /
          150,
      ),
    ),
  };
  const ref = getDatabase().collection('newsletters').doc(input.data.id);
  await getDatabase().runTransaction(async (tx) => {
    if ((await tx.get(ref)).exists)
      throw createError({
        statusCode: 409,
        statusMessage: '이미 저장된 글입니다. 목록에서 다시 열어주세요.',
      });
    tx.create(ref, data);
  });
  return newsletterDto(ref.id, data);
});
