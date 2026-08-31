import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  countryNameSchema,
  defaultCountries,
} from '../../../shared/newsletter';
import { getDatabase } from '../../lib/firebase';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  await requireAdmin(event);
  const input = z
    .object({ name: countryNameSchema })
    .strict()
    .safeParse(await readLimitedJson(event, 2048));
  if (!input.success)
    throw createError({
      statusCode: 400,
      statusMessage: '국가 이름을 1~60자로 입력해주세요.',
    });
  const name = input.data.name.normalize('NFKC').replace(/\s+/g, ' ');
  const normalized = name.toLocaleLowerCase();
  if (
    defaultCountries.some((c) =>
      [c.name, c.id, ...Object.values(c.labels || {})].some(
        (n) => n.toLocaleLowerCase() === normalized,
      ),
    )
  ) {
    throw createError({
      statusCode: 409,
      statusMessage: '이미 등록된 국가입니다.',
    });
  }
  const id =
    'country-' +
    createHash('sha256').update(normalized).digest('hex').slice(0, 24);
  const ref = getDatabase().collection('newsletterCountries').doc(id);
  await getDatabase().runTransaction(async (tx) => {
    if ((await tx.get(ref)).exists)
      throw createError({
        statusCode: 409,
        statusMessage: '이미 등록된 국가입니다.',
      });
    tx.create(ref, { name, createdAt: new Date().toISOString() });
  });
  return { id, name };
});
