import { getDatabase } from '../../lib/firebase';

export default defineEventHandler(async event => {
  requireSameOrigin(event);
  const account = await requireAdmin(event);
  await getDatabase().collection('adminSessions').doc(account.sessionId).delete();
  deleteCookie(event, SESSION_COOKIE, { path: '/' });
  return { success: true };
});
