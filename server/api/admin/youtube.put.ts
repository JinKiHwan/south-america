import { z } from 'zod';
import { normalizeYoutubeChannelId, youtubeHandle } from '../../../shared/youtube';
import { getDatabase } from '../../lib/firebase';
import { resolveYoutubeHandle } from '../../lib/youtube';

const schema = z.object({ version: z.number().int().nonnegative(), channel: z.string().max(300) }).strict();

export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  await requireAdmin(event);
  const parsed = schema.safeParse(await readLimitedJson(event, 1024));
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: '채널 주소 또는 ID를 확인해주세요.' });
  let channelId = parsed.data.channel.trim() ? normalizeYoutubeChannelId(parsed.data.channel) : '';
  if (channelId === null) {
    const handle = youtubeHandle(parsed.data.channel);
    if (!handle) throw createError({ statusCode: 400, statusMessage: '유효한 YouTube 채널 주소, ID 또는 @핸들을 입력해주세요.' });
    const key = process.env.YOUTUBE_API_KEY?.trim();
    if (!key) throw createError({ statusCode: 503, statusMessage: '@핸들을 사용하려면 먼저 서버에 YouTube API 키를 설정해주세요.' });
    try { channelId = await resolveYoutubeHandle(handle, key); }
    catch { throw createError({ statusCode: 502, statusMessage: 'YouTube 채널을 확인하지 못했습니다. API 키와 채널 주소를 확인해주세요.' }); }
    if (!channelId) throw createError({ statusCode: 404, statusMessage: '해당 YouTube 채널을 찾지 못했습니다.' });
  }
  const db = getDatabase();
  const ref = db.collection('siteSettings').doc('youtube');
  await db.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    if ((current.data()?.version ?? 0) !== parsed.data.version)
      throw createError({ statusCode: 409, statusMessage: '다른 창에서 유튜브 설정이 변경되었습니다. 새로고침 후 다시 시도해주세요.' });
    tx.set(ref, { version: parsed.data.version + 1, channelId, updatedAt: new Date().toISOString() });
  });
  return { version: parsed.data.version + 1, channelId };
});
