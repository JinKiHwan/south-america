import { newsletterId } from '../../../../shared/newsletter';
import { getDatabase } from '../../../lib/firebase';
import { newsletterDto } from '../../../lib/newsletter';
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = newsletterId.safeParse(getRouterParam(event, 'id'));
  if (!id.success)
    throw createError({
      statusCode: 404,
      statusMessage: '소식지를 찾을 수 없습니다.',
    });
  const doc = await getDatabase().collection('newsletters').doc(id.data).get();
  if (!doc.exists)
    throw createError({
      statusCode: 404,
      statusMessage: '소식지를 찾을 수 없습니다.',
    });
  return newsletterDto(doc.id, doc.data());
});
