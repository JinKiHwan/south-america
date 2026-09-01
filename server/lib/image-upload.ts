import sharp from 'sharp';
import { IMAGE_MAX_BYTES, IMAGE_MAX_DIMENSION } from '../../shared/image';

const acceptedFormats = new Set(['jpeg', 'png', 'webp']);
const qualities = [84, 72, 60, 48, 36, 28];

export async function createWebpUpload(body: Buffer) {
  const metadata = await sharp(body, {
    limitInputPixels: 40_000_000,
    failOn: 'error',
  }).metadata();
  if (
    !acceptedFormats.has(metadata.format || '') ||
    (metadata.pages || 1) > 1 ||
    !metadata.width ||
    !metadata.height
  ) {
    throw new Error('Invalid image');
  }

  let dimension = Math.min(
    IMAGE_MAX_DIMENSION,
    Math.max(metadata.width, metadata.height),
  );
  for (let resizeAttempt = 0; resizeAttempt < 10; resizeAttempt++) {
    let smallest: Buffer | null = null;
    for (const quality of qualities) {
      const image = await sharp(body, {
        limitInputPixels: 40_000_000,
        failOn: 'error',
      })
        .rotate()
        .resize({
          width: dimension,
          height: dimension,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 4 })
        .toBuffer();
      smallest = image;
      if (image.length <= IMAGE_MAX_BYTES) return image;
    }

    if (!smallest) break;
    const scale = Math.min(
      0.86,
      Math.sqrt(IMAGE_MAX_BYTES / smallest.length) * 0.92,
    );
    const nextDimension = Math.max(1, Math.floor(dimension * scale));
    if (nextDimension === dimension) break;
    dimension = nextDimension;
  }
  throw new Error('Could not create a WebP image under the size limit.');
}

