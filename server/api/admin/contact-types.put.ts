import { z } from 'zod';
import { contactTypeSchema } from '../../../shared/contact-types';
import { getDatabase } from '../../lib/firebase';

const schema = z.object({
  version: z.number().int().nonnegative(),
  types: z.array(contactTypeSchema).min(1).max(30),
}).strict();

export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  await requireAdmin(event);
  const parsed = schema.safeParse(await readLimitedJson(event, 20 * 1024));
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: '문의 유형과 네 언어의 이름을 확인해주세요.' });
  const { version, types } = parsed.data;
  if (new Set(types.map((type) => type.id)).size !== types.length)
    throw createError({ statusCode: 400, statusMessage: '문의 유형이 중복되었습니다.' });
  const ref = getDatabase().collection('siteSettings').doc('contactTypes');
  await getDatabase().runTransaction(async (tx) => {
    const current = await tx.get(ref);
    if ((current.data()?.version ?? 0) !== version)
      throw createError({ statusCode: 409, statusMessage: '다른 창에서 문의 유형이 수정되었습니다. 새로고침 후 다시 시도해주세요.' });
    tx.set(ref, { version: version + 1, types, updatedAt: new Date().toISOString() });
  });
  return { version: version + 1, types };
});
