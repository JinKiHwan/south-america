import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { IMAGE_MAX_BYTES, NEWSLETTER_THUMBNAIL_MAX_BYTES, NEWSLETTER_THUMBNAIL_MAX_DIMENSION } from '../shared/image.ts';
import { createWebpUpload } from '../server/lib/image-upload.ts';

test('uploaded images are WebP and never exceed 1MB', async () => {
  const width = 1800;
  const height = 1800;
  const source = await sharp(randomBytes(width * height * 3), {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer();
  const result = await createWebpUpload(source);
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.format, 'webp');
  assert.ok(result.length <= IMAGE_MAX_BYTES);
});

test('newsletter thumbnails are downscaled without distortion', async () => {
  const source = await sharp({
    create: { width: 2400, height: 1350, channels: 3, background: '#a8755b' },
  }).png().toBuffer();
  const result = await createWebpUpload(source, {
    maxDimension: NEWSLETTER_THUMBNAIL_MAX_DIMENSION,
    maxBytes: NEWSLETTER_THUMBNAIL_MAX_BYTES,
  });
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 675);
  assert.ok(result.length <= NEWSLETTER_THUMBNAIL_MAX_BYTES);
});
