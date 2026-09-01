import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { IMAGE_MAX_BYTES } from '../shared/image.ts';
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

