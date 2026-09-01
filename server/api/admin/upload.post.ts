import { randomUUID } from 'node:crypto';
import { createWebpUpload } from '../../lib/image-upload';
import { imageStorageProvider, saveSiteImage } from '../../lib/image-storage';

export default defineEventHandler(async event => {
  requireSameOrigin(event);
  const account = await requireAdmin(event);
  const type = getHeader(event, 'content-type')?.split(';')[0];
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(type || '')) {
    throw createError({ statusCode: 415, statusMessage: 'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.' });
  }
  if (!imageStorageProvider()) {
    throw createError({ statusCode: 503, statusMessage: '이미지 저장소 연결 설정이 필요합니다.' });
  }
  const body = await readLimitedBody(event, 4 * 1024 * 1024);
  let image: Buffer;
  try {
    image = await createWebpUpload(body);
  } catch {
    throw createError({ statusCode: 400, statusMessage: '손상되었거나 지원하지 않는 이미지입니다.' });
  }
  const filename = randomUUID() + '.webp';
  await saveSiteImage(filename, image, account.username);
  return { imageUrl: '/api/site-images/' + filename };
});
