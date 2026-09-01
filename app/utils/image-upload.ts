import { IMAGE_MAX_BYTES, IMAGE_MAX_DIMENSION } from '#shared/image';

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const qualities = [0.86, 0.76, 0.66, 0.56, 0.46, 0.36, 0.28];

function canvasWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('이 브라우저에서는 WebP 변환을 지원하지 않습니다.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality,
    );
  });
}

export async function prepareImageUpload(file: File) {
  if (!acceptedTypes.has(file.type)) {
    throw new Error('JPG, PNG, WebP 이미지만 선택해주세요.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('손상되었거나 지원하지 않는 이미지입니다.');
  }

  try {
    const initialScale = Math.min(
      1,
      IMAGE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    let width = Math.max(1, Math.round(bitmap.width * initialScale));
    let height = Math.max(1, Math.round(bitmap.height * initialScale));

    for (let resizeAttempt = 0; resizeAttempt < 10; resizeAttempt++) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { alpha: true });
      if (!context) throw new Error('이미지를 변환하지 못했습니다.');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(bitmap, 0, 0, width, height);

      let smallest: Blob | null = null;
      for (const quality of qualities) {
        const blob = await canvasWebp(canvas, quality);
        smallest = blob;
        if (blob.size <= IMAGE_MAX_BYTES) {
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
          return new File([blob], baseName + '.webp', {
            type: 'image/webp',
            lastModified: Date.now(),
          });
        }
      }

      if (!smallest) break;
      const scale = Math.min(
        0.86,
        Math.sqrt(IMAGE_MAX_BYTES / smallest.size) * 0.92,
      );
      const nextWidth = Math.max(1, Math.floor(width * scale));
      const nextHeight = Math.max(1, Math.floor(height * scale));
      if (nextWidth === width && nextHeight === height) break;
      width = nextWidth;
      height = nextHeight;
    }
  } finally {
    bitmap.close();
  }

  throw new Error('이미지를 1MB 이하로 변환하지 못했습니다.');
}

