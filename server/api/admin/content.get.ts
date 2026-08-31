import { getDatabase } from '../../lib/firebase';
import { createDefaultContent, parseSiteContent } from '#shared/site-content';

export default defineEventHandler(async event => {
  await requireAdmin(event);
  const snapshot = await getDatabase().collection('siteContent').doc('home').get();
  return snapshot.exists ? parseSiteContent(snapshot.data()) : createDefaultContent();
});
