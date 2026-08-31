import type { H3Event } from 'h3';
import { createError, deleteCookie, getCookie, getHeader, getRequestURL, setCookie, setHeader } from 'h3';
import { getDatabase, isFirebaseConfigured } from '../lib/firebase';
import { hashToken } from '../lib/password';

export const SESSION_COOKIE = 'sa_admin_session';
export const SESSION_DURATION = 60 * 60 * 8;

export function requireFirebase() {
  if (!isFirebaseConfigured()) {
    throw createError({ statusCode: 503, statusMessage: 'Firebase 서버 연결 설정이 필요합니다.' });
  }
}

export function privateResponse(event: H3Event) {
  setHeader(event, 'Cache-Control', 'no-store, private');
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
}

export function requireSameOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin');
  const expected = process.env.ADMIN_ORIGIN || getRequestURL(event).origin;
  if (!origin || origin !== expected || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, statusMessage: '허용되지 않은 요청입니다.' });
  }
}

export async function requireAdmin(event: H3Event) {
  privateResponse(event);
  requireFirebase();
  const token = getCookie(event, SESSION_COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    throw createError({ statusCode: 401, statusMessage: '로그인이 필요합니다.' });
  }
  const database = getDatabase();
  const session = await database.collection('adminSessions').doc(hashToken(token)).get();
  const sessionData = session.data();
  if (!sessionData || sessionData.expiresAt.toMillis() <= Date.now()) {
    deleteCookie(event, SESSION_COOKIE, { path: '/' });
    throw createError({ statusCode: 401, statusMessage: '로그인이 만료되었습니다.' });
  }
  const account = await database.collection('adminAccounts').doc(sessionData.username).get();
  const data = account.data();
  if (!data || !data.active || data.role !== 'master' || data.sessionVersion !== sessionData.sessionVersion) {
    throw createError({ statusCode: 401, statusMessage: '계정을 확인해주세요.' });
  }
  return { username: account.id, role: 'master' as const, sessionId: session.id };
}

export function setAdminCookie(event: H3Event, token: string) {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION,
  });
}

// Read a bounded stream instead of buffering an unbounded upload.
export async function readLimitedBody(event: H3Event, limit: number): Promise<Buffer> {
  if (Number(getHeader(event, 'content-length') || 0) > limit) {
    throw createError({ statusCode: 413, statusMessage: '파일 또는 입력 내용이 너무 큽니다.' });
  }
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > limit) throw createError({ statusCode: 413, statusMessage: '허용된 용량을 초과했습니다.' });
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

export async function readLimitedJson(event: H3Event, limit = 96 * 1024) {
  if (!getHeader(event, 'content-type')?.startsWith('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'JSON 형식의 요청이 필요합니다.' });
  }
  try {
    return JSON.parse((await readLimitedBody(event, limit)).toString('utf8'));
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 400, statusMessage: '입력 내용을 확인해주세요.' });
  }
}
