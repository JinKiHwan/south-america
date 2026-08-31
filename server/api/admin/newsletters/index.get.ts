import { getDatabase } from '../../../lib/firebase';
import {
  newsletterSummary,
  newsletterSummaryFields,
} from '../../../lib/newsletter';
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const docs = await getDatabase()
    .collection('newsletters')
    .orderBy('updatedAt', 'desc')
    .select(...newsletterSummaryFields)
    .get();
  return docs.docs.map((doc) => newsletterSummary(doc.id, doc.data()));
});
