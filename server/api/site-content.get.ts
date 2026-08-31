import { getDatabase, isFirebaseConfigured } from '../lib/firebase';
import { createDefaultContent, parseSiteContent } from '#shared/site-content';

export default defineEventHandler(async event => {
  setHeader(event, 'Cache-Control', 'no-store');
  if (!isFirebaseConfigured()) return createDefaultContent();
  try {
    const snapshot = await getDatabase().collection('siteContent').doc('home').get();
    return snapshot.exists ? parseSiteContent(snapshot.data()) : createDefaultContent();
  } catch {
    // The public page stays readable if the backing service is unavailable.
    console.error('[site-content] Could not load saved homepage content.');
    setHeader(event, 'X-Content-Fallback', '1');
    return createDefaultContent();
  }
});
