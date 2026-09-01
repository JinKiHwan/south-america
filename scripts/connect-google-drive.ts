import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const clientFile = process.argv[2];
if (!clientFile) {
  throw new Error('OAuth 클라이언트 JSON 파일 경로가 필요합니다.');
}
const source = JSON.parse(await readFile(resolve(clientFile), 'utf8'));
const client = source.web || source.installed;
if (!client?.client_id || !client?.client_secret) {
  throw new Error('올바른 Google OAuth 클라이언트 JSON이 아닙니다.');
}

const host = '127.0.0.1';
const port = 53682;
const callbackPath = '/oauth2callback';
const redirectUri = `http://${host}:${port}${callbackPath}`;
const state = randomBytes(24).toString('hex');
const scope = 'https://www.googleapis.com/auth/drive.file';
const folderName = 'SouthAmerica Newsletter PDFs';

function html(message: string) {
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><title>Google Drive 연결</title><body style="font-family:system-ui;padding:48px"><h1>${message}</h1><p>이 창을 닫고 Codex로 돌아가세요.</p></body></html>`;
}

let finish!: (value: { refreshToken: string; accessToken: string }) => void;
let fail!: (error: Error) => void;
const callback = new Promise<{ refreshToken: string; accessToken: string }>(
  (resolvePromise, rejectPromise) => {
    finish = resolvePromise;
    fail = rejectPromise;
  },
);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', redirectUri);
  if (url.pathname !== callbackPath) {
    response.writeHead(404).end();
    return;
  }
  try {
    if (url.searchParams.get('state') !== state) {
      throw new Error('OAuth state가 일치하지 않습니다.');
    }
    const oauthError = url.searchParams.get('error');
    const code = url.searchParams.get('code');
    if (oauthError || !code) {
      throw new Error('Google 승인이 취소되었거나 실패했습니다.');
    }
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: client.client_id,
        client_secret: client.client_secret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token || !tokens.refresh_token) {
      throw new Error(
        tokens.error_description ||
          'Google 갱신 토큰을 발급받지 못했습니다.',
      );
    }
    response
      .writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(html('Google Drive 연결이 승인되었습니다.'));
    finish({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } catch (error: any) {
    response
      .writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(html(error.message || 'Google Drive 연결에 실패했습니다.'));
    fail(error);
  }
});

await new Promise<void>((resolvePromise, rejectPromise) => {
  server.once('error', rejectPromise);
  server.listen(port, host, resolvePromise);
});

const authorizationUrl = new URL(
  'https://accounts.google.com/o/oauth2/v2/auth',
);
authorizationUrl.search = new URLSearchParams({
  client_id: client.client_id,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope,
  access_type: 'offline',
  prompt: 'consent',
  include_granted_scopes: 'true',
  state,
}).toString();
console.log('AUTH_URL=' + authorizationUrl.toString());

try {
  const tokens = await Promise.race([
    callback,
    new Promise<never>((_, rejectPromise) =>
      setTimeout(
        () => rejectPromise(new Error('Google 승인을 기다리는 시간이 만료되었습니다.')),
        10 * 60_000,
      ),
    ),
  ]);
  const headers = {
    Authorization: 'Bearer ' + tokens.accessToken,
    'Content-Type': 'application/json',
  };
  const query = new URLSearchParams({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id,name)',
  });
  const listResponse = await fetch(
    'https://www.googleapis.com/drive/v3/files?' + query,
    { headers },
  );
  const list = await listResponse.json();
  if (!listResponse.ok) {
    throw new Error(list.error?.message || 'Drive 폴더를 확인하지 못했습니다.');
  }
  let folderId = list.files?.[0]?.id;
  let created = false;
  if (!folderId) {
    const createResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?fields=id',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        }),
      },
    );
    const folder = await createResponse.json();
    if (!createResponse.ok || !folder.id) {
      throw new Error(
        folder.error?.message || 'Drive 전용 폴더를 만들지 못했습니다.',
      );
    }
    folderId = folder.id;
    created = true;
  }
  const secretDir = resolve(process.cwd(), '.secrets');
  await mkdir(secretDir, { recursive: true });
  await writeFile(
    resolve(secretDir, 'google-drive.json'),
    JSON.stringify(
      {
        clientId: client.client_id,
        clientSecret: client.client_secret,
        refreshToken: tokens.refreshToken,
        folderId,
      },
      null,
      2,
    ) + '\n',
    { mode: 0o600 },
  );
  console.log(JSON.stringify({ connected: true, folderCreated: created }));
} finally {
  server.close();
}
