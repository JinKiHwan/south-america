import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getDatabase } from '../../lib/firebase';
import { createSessionToken, hashPassword, hashToken, verifyPassword } from '../../lib/password';

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{3,40}$/),
  password: z.string().min(1).max(128),
}).strict();
const dummyHash = hashPassword('invalid-account-timing-placeholder');

export default defineEventHandler(async event => {
  privateResponse(event);
  requireSameOrigin(event);
  requireFirebase();
  const input = loginSchema.safeParse(await readLimitedJson(event, 2048));
  if (!input.success) throw createError({ statusCode: 400, statusMessage: '아이디와 비밀번호를 확인해주세요.' });

  const { username, password } = input.data;
  const database = getDatabase();
  // Both the username and the client have persistent, transaction-safe attempt limits.
  const client = getRequestIP(event, { xForwardedFor: Boolean(process.env.VERCEL) }) || 'unknown';
  const limits = [
    database.collection('adminLoginLimits').doc(hashToken('username:' + username)),
    database.collection('adminLoginLimits').doc(hashToken('client:' + client)),
  ];
  await database.runTransaction(async transaction => {
    const snapshots = await transaction.getAll(...limits);
    const now = Date.now();
    snapshots.forEach(snapshot => {
      const data = snapshot.data();
      if (data && data.resetAt.toMillis() > now && data.count >= 10) {
        throw createError({ statusCode: 429, statusMessage: '로그인 시도가 많습니다. 15분 후 다시 시도해주세요.' });
      }
    });
    snapshots.forEach((snapshot, index) => {
      const data = snapshot.data();
      const current = data && data.resetAt.toMillis() > now;
      transaction.set(limits[index]!, {
        count: current ? data.count + 1 : 1,
        resetAt: current ? data.resetAt : Timestamp.fromMillis(now + 15 * 60 * 1000),
      });
    });
  });

  const account = await database.collection('adminAccounts').doc(username).get();
  const data = account.data();
  const valid = await verifyPassword(password, data?.passwordHash || await dummyHash);
  if (!valid || !data?.active || data.role !== 'master') {
    throw createError({ statusCode: 401, statusMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
  const token = createSessionToken();
  const previousToken = getCookie(event, SESSION_COOKIE);
  const batch = database.batch();
  if (previousToken && /^[a-f0-9]{64}$/.test(previousToken)) {
    batch.delete(database.collection('adminSessions').doc(hashToken(previousToken)));
  }
  batch.set(database.collection('adminSessions').doc(hashToken(token)), {
    username, role: 'master', sessionVersion: data.sessionVersion,
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromMillis(Date.now() + SESSION_DURATION * 1000),
  });
  batch.update(account.ref, { lastLoginAt: Timestamp.now() });
  await batch.commit();
  setAdminCookie(event, token);
  return { username, role: 'master' };
});
