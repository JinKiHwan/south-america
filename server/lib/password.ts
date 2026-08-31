import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';

const parameters = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const derive = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => {
  scrypt(password, salt, 64, parameters, (error, key) => error ? reject(error) : resolve(key));
});

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt);
  return 'scrypt$' + salt + '$' + key.toString('hex');
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, storedKey] = encoded.split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(storedKey || '')) {
    return false;
  }
  const key = await derive(password, salt!);
  return timingSafeEqual(key, Buffer.from(storedKey!, 'hex'));
}

export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex');
export const createSessionToken = () => randomBytes(32).toString('hex');
