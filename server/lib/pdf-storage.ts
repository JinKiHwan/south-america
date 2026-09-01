import { createReadStream, readFileSync } from 'node:fs';
import { mkdir, open, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { createError } from 'h3';

export type PdfProvider = 'drive' | 'emulator';
export interface PdfUploadRecord {
  id: string;
  postId: string;
  owner: string;
  name: string;
  size: number;
  fingerprint: string;
  provider: PdfProvider;
  sessionUrl: string | null;
  remoteId: string | null;
  offset: number;
  state: 'uploading' | 'complete';
  expiresAt: string;
  leaseUntil?: number;
  leaseId?: string;
}
interface DriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  folderId: string;
}
function driveConfig(): DriveConfig | null {
  if (
    process.env.GOOGLE_DRIVE_CLIENT_ID &&
    process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN &&
    process.env.GOOGLE_DRIVE_PDF_FOLDER_ID
  ) {
    return {
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
      folderId: process.env.GOOGLE_DRIVE_PDF_FOLDER_ID,
    };
  }
  if (!process.env.GOOGLE_DRIVE_CREDENTIALS) return null;
  try {
    const value = JSON.parse(
      readFileSync(
        resolve(process.cwd(), process.env.GOOGLE_DRIVE_CREDENTIALS),
        'utf8',
      ),
    );
    if (
      typeof value.clientId !== 'string' ||
      typeof value.clientSecret !== 'string' ||
      typeof value.refreshToken !== 'string' ||
      typeof value.folderId !== 'string' ||
      !value.clientId.endsWith('.apps.googleusercontent.com') ||
      !/^[a-zA-Z0-9_-]+$/.test(value.folderId)
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
export function pdfStorageProvider(): PdfProvider | null {
  if (driveConfig()) return 'drive';
  // Local development keeps PDFs on disk so attachment testing does not
  // depend on production Drive credentials. Production never uses this path.
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production')
    return 'emulator';
  return null;
}
function localPath(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id))
    throw createError({
      statusCode: 503,
      statusMessage: '로컬 PDF 저장소에 접근할 수 없습니다.',
    });
  return resolve(process.cwd(), '.data/newsletter-pdfs', id + '.pdf');
}
let accessToken = '';
let expiresAt = 0;
let refreshPromise: Promise<string> | null = null;
async function driveAccessToken() {
  if (accessToken && expiresAt > Date.now() + 60_000) return accessToken;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const config = driveConfig();
    if (!config)
      throw createError({
        statusCode: 503,
        statusMessage: 'Google Drive 연결 설정을 확인해주세요.',
      });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      signal: AbortSignal.timeout(15_000),
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    if (!response.ok)
      throw createError({
        statusCode: 503,
        statusMessage: 'Google Drive 계정 연결을 다시 확인해주세요.',
      });
    const result = await response.json();
    if (!result.access_token)
      throw createError({
        statusCode: 503,
        statusMessage: 'Google Drive 인증에 실패했습니다.',
      });
    accessToken = result.access_token;
    expiresAt = Date.now() + Number(result.expires_in || 3600) * 1000;
    return accessToken;
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
export function validDriveUploadUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.origin === 'https://www.googleapis.com' &&
      url.pathname === '/upload/drive/v3/files' &&
      url.searchParams.get('uploadType') === 'resumable' &&
      !!url.searchParams.get('upload_id')
    );
  } catch {
    return false;
  }
}
function driveSession(record: PdfUploadRecord) {
  if (!record.sessionUrl || !validDriveUploadUrl(record.sessionUrl))
    throw createError({
      statusCode: 503,
      statusMessage: '업로드 연결을 다시 시작해주세요.',
    });
  return record.sessionUrl;
}
async function uploadResult(response: Response, record: PdfUploadRecord) {
  if (response.status === 308) {
    const range = response.headers.get('range');
    const end = range?.match(/^bytes=0-(\d+)$/)?.[1];
    const offset = end ? Number(end) + 1 : 0;
    if (offset > record.size)
      throw createError({
        statusCode: 502,
        statusMessage: '저장소의 업로드 상태가 올바르지 않습니다.',
      });
    return { offset, remoteId: null, state: 'uploading' as const };
  }
  if (response.ok) {
    const file = await response.json();
    if (
      !file.id ||
      Number(file.size) !== record.size ||
      file.mimeType !== 'application/pdf'
    )
      throw createError({
        statusCode: 502,
        statusMessage: '업로드된 PDF 정보를 확인하지 못했습니다.',
      });
    return {
      offset: record.size,
      remoteId: String(file.id),
      state: 'complete' as const,
    };
  }
  if (response.status === 404 || response.status === 410)
    throw createError({
      statusCode: 410,
      statusMessage: '업로드가 만료되었습니다. 파일을 다시 선택해주세요.',
    });
  if (response.status === 403 || response.status === 429)
    throw createError({
      statusCode: 503,
      statusMessage: 'Drive 용량·사용 한도 또는 폴더 권한을 확인해주세요.',
    });
  throw createError({
    statusCode: 502,
    statusMessage: 'Drive 전송이 중단되었습니다. 이어 올리기를 눌러주세요.',
  });
}
export async function beginPdfStorage(record: PdfUploadRecord) {
  if (record.provider === 'emulator') {
    const path = localPath(record.id);
    await mkdir(resolve(path, '..'), { recursive: true });
    const file = await open(path, 'wx', 0o600);
    await file.close();
    return null;
  }
  const config = driveConfig();
  if (!config)
    throw createError({
      statusCode: 503,
      statusMessage: 'Google Drive 연결 설정을 확인해주세요.',
    });
  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,size,mimeType',
    {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: 'Bearer ' + (await driveAccessToken()),
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'application/pdf',
        'X-Upload-Content-Length': String(record.size),
      },
      body: JSON.stringify({
        name: record.name,
        mimeType: 'application/pdf',
        parents: [config.folderId],
        appProperties: {
          newsletterPostId: record.postId,
          newsletterUploadId: record.id,
        },
      }),
    },
  );
  const session = response.headers.get('location');
  if (!response.ok || !session || !validDriveUploadUrl(session))
    throw createError({
      statusCode: 503,
      statusMessage:
        'Drive 업로드를 시작하지 못했습니다. 연결과 폴더 권한을 확인해주세요.',
    });
  return session;
}
export async function pdfUploadState(record: PdfUploadRecord) {
  if (record.state === 'complete')
    return {
      offset: record.size,
      remoteId: record.remoteId,
      state: 'complete' as const,
    };
  if (record.provider === 'emulator') {
    const info = await stat(localPath(record.id));
    return {
      offset: info.size,
      remoteId: record.id,
      state:
        info.size === record.size
          ? ('complete' as const)
          : ('uploading' as const),
    };
  }
  const response = await fetch(driveSession(record), {
    method: 'PUT',
    redirect: 'manual',
    signal: AbortSignal.timeout(30_000),
    headers: {
      'Content-Length': '0',
      'Content-Range': 'bytes */' + record.size,
    },
  });
  return uploadResult(response, record);
}
export async function storePdfChunk(record: PdfUploadRecord, body: Buffer) {
  if (record.provider === 'emulator') {
    const file = await open(localPath(record.id), 'r+');
    try {
      let written = 0;
      while (written < body.length) {
        const result = await file.write(
          body,
          written,
          body.length - written,
          record.offset + written,
        );
        if (!result.bytesWritten) throw new Error('Could not write PDF chunk.');
        written += result.bytesWritten;
      }
      await file.sync();
    } finally {
      await file.close();
    }
    return pdfUploadState(record);
  }
  const response = await fetch(driveSession(record), {
    method: 'PUT',
    redirect: 'manual',
    signal: AbortSignal.timeout(75_000),
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(body.length),
      'Content-Range': `bytes ${record.offset}-${record.offset + body.length - 1}/${record.size}`,
    },
    body: new Uint8Array(body),
  });
  return uploadResult(response, record);
}
export function pdfByteRange(
  value: string | undefined,
  size: number,
): { start: number; end: number } | null {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]))
    throw createError({
      statusCode: 416,
      statusMessage: '요청한 파일 범위를 제공할 수 없습니다.',
    });
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, size - Number(match[2]));
  const end =
    match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start > end ||
    start >= size
  )
    throw createError({
      statusCode: 416,
      statusMessage: '요청한 파일 범위를 제공할 수 없습니다.',
    });
  return { start, end };
}
export async function readPdfStream(
  record: PdfUploadRecord,
  range: ReturnType<typeof pdfByteRange>,
) {
  if (record.provider === 'emulator')
    return createReadStream(localPath(record.id), range || {});
  if (!record.remoteId || !/^[a-zA-Z0-9_-]+$/.test(record.remoteId))
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF를 찾을 수 없습니다.',
    });
  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files/' +
      record.remoteId +
      '?alt=media',
    {
      headers: {
        Authorization: 'Bearer ' + (await driveAccessToken()),
        ...(range ? { Range: `bytes=${range.start}-${range.end}` } : {}),
      },
      signal: AbortSignal.timeout(280_000),
    },
  );
  if (!response.ok || !response.body || (range && response.status !== 206))
    throw createError({
      statusCode: 503,
      statusMessage: 'PDF를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.',
    });
  return Readable.fromWeb(response.body as any);
}
