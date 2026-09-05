import nodemailer from 'nodemailer';
import { createContactMail, parseContactInput } from '../lib/contact-email';

const attempts = new Map<string, { count: number; resetAt: number }>();
const LIMIT_WINDOW = 15 * 60 * 1000;
const LIMIT_COUNT = 5;

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + LIMIT_WINDOW });
    return;
  }
  if (current.count >= LIMIT_COUNT) {
    throw createError({
      statusCode: 429,
      message: '문의가 연속으로 접수되었습니다. 잠시 후 다시 시도해주세요.',
    });
  }
  current.count += 1;
  if (attempts.size > 1000) {
    for (const [storedKey, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(storedKey);
    }
  }
}

export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const input = parseContactInput(await readLimitedJson(event, 24 * 1024));
  const client =
    getRequestIP(event, { xForwardedFor: Boolean(process.env.VERCEL) }) ||
    'unknown';
  checkRateLimit(client);

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);
  if (
    !smtpUser ||
    !smtpPass ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw createError({
      statusCode: 503,
      message: '문의 메일 설정을 확인해주세요.',
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail(createContactMail(input, smtpUser));
    return { success: true };
  } catch (error: any) {
    console.error('Contact email delivery failed.', {
      code: typeof error?.code === 'string' ? error.code : 'unknown',
    });
    throw createError({
      statusCode: 502,
      message: '문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
  } finally {
    transporter.close();
  }
});
