import { readSiteImage } from '../../lib/image-storage';

export default defineEventHandler(async event => {
  const filename = getRouterParam(event, 'filename') || '';
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/.test(filename)) {
    throw createError({ statusCode: 404, statusMessage: '이미지를 찾을 수 없습니다.' });
  }
  try {
    const image = await readSiteImage(filename);
    setHeader(event, 'Content-Type', 'image/webp');
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
    setHeader(event, 'X-Content-Type-Options', 'nosniff');
    return image;
  } catch {
    throw createError({ statusCode: 404, statusMessage: '이미지를 찾을 수 없습니다.' });
  }
});
