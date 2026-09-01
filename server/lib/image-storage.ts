import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getImageBucket } from './firebase';

export type ImageProvider = 'firebase' | 'local';

export function imageStorageProvider(): ImageProvider | null {
  if (process.env.FIREBASE_STORAGE_BUCKET) return 'firebase';
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') return 'local';
  return null;
}

function localImagePath(filename: string) {
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) {
    throw new Error('Invalid image filename.');
  }
  return resolve(process.cwd(), '.data/site-images', filename);
}

export async function saveSiteImage(
  filename: string,
  image: Buffer,
  uploadedBy: string,
) {
  if (imageStorageProvider() === 'local') {
    const path = localImagePath(filename);
    await mkdir(resolve(path, '..'), { recursive: true });
    await writeFile(path, image, { flag: 'wx', mode: 0o600 });
    return;
  }
  if (imageStorageProvider() !== 'firebase') {
    throw new Error('Image storage is not configured.');
  }
  await getImageBucket()
    .file('site-images/' + filename)
    .save(image, {
      resumable: false,
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { uploadedBy },
      },
    });
}

export async function readSiteImage(filename: string) {
  if (imageStorageProvider() === 'local') {
    return readFile(localImagePath(filename));
  }
  if (imageStorageProvider() !== 'firebase') {
    throw new Error('Image storage is not configured.');
  }
  const [image] = await getImageBucket()
    .file('site-images/' + filename)
    .download();
  return image;
}

