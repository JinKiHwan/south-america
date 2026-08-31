import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getImageBucket } from '../../lib/firebase';

export default defineEventHandler(async event => {
  requireSameOrigin(event);
  const account = await requireAdmin(event);
  const type = getHeader(event, 'content-type')?.split(';')[0];
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(type || '')) {
    throw createError({ statusCode: 415, statusMessage: 'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.' });
  }
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw createError({ statusCode: 503, statusMessage: 'Firebase Storage 연결 설정이 필요합니다.' });
  }
  const body = await readLimitedBody(event, 4 * 1024 * 1024);
  let image: Buffer;
  try {
    const source = sharp(body, { limitInputPixels: 40_000_000, failOn: 'error' });
    const metadata = await source.metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format || '') || (metadata.pages || 1) > 1) throw new Error('Invalid image');
    image = await source.rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
  } catch {
    throw createError({ statusCode: 400, statusMessage: '손상되었거나 지원하지 않는 이미지입니다.' });
  }
  const filename = randomUUID() + '.webp';
  await getImageBucket().file('site-images/' + filename).save(image, {
    resumable: false,
    contentType: 'image/webp',
    metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { uploadedBy: account.username } },
  });
  return { imageUrl: '/api/site-images/' + filename };
});
