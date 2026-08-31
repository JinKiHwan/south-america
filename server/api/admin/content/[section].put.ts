import { z } from 'zod';
import { getDatabase } from '../../../lib/firebase';
import { createDefaultContent, heroSchema, missionarySchema, parseSiteContent } from '#shared/site-content';

export default defineEventHandler(async event => {
  requireSameOrigin(event);
  const account = await requireAdmin(event);
  const section = getRouterParam(event, 'section');
  if (section !== 'hero' && section !== 'missionary') {
    throw createError({ statusCode: 404, statusMessage: '수정할 영역을 찾을 수 없습니다.' });
  }
  const validation = z.object({
    content: section === 'hero' ? heroSchema : missionarySchema,
    version: z.number().int().nonnegative(),
  }).strict().safeParse(await readLimitedJson(event));
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: '필수 항목, 글자 수 또는 이미지 형식을 확인해주세요.' });
  }

  const reference = getDatabase().collection('siteContent').doc('home');
  return await getDatabase().runTransaction(async transaction => {
    const snapshot = await transaction.get(reference);
    const current = snapshot.exists ? parseSiteContent(snapshot.data()) : createDefaultContent();
    if (current.version !== validation.data.version) {
      throw createError({ statusCode: 409, statusMessage: '다른 창에서 변경된 내용이 있습니다. 최신 내용을 불러온 뒤 다시 저장해주세요.' });
    }
    const next = {
      ...current,
      [section]: validation.data.content,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };
    transaction.set(reference, { ...next, updatedBy: account.username });
    return next;
  });
});
