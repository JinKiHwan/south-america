import { getDatabase, isFirebaseConfigured } from '../../lib/firebase';
import {
  newsletterSummary,
  newsletterSummaryFields,
} from '../../lib/newsletter';
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');
  if (!isFirebaseConfigured()) return [];
  const docs = await getDatabase()
    .collection('newsletters')
    .where('status', '==', 'published')
    .select(...newsletterSummaryFields)
    .get();
  return docs.docs
    .map((doc) => newsletterSummary(doc.id, doc.data()))
    .sort(
      (a, b) =>
        (b.publishedAt || '').localeCompare(a.publishedAt || '') ||
        b.id.localeCompare(a.id),
    );
});
