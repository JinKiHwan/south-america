import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  countryNameSchema,
} from '../../../shared/newsletter';
import { getDatabase } from '../../lib/firebase';
import { mergeCountries } from '../../lib/newsletter';
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
  const id =
    'country-' +
    createHash('sha256').update(normalized).digest('hex').slice(0, 24);
  const db = getDatabase();
  const ref = db.collection('newsletterCountries').doc(id);
  const settingsRef = db.collection('newsletterCountrySettings').doc('current');
  await db.runTransaction(async (tx) => {
    const [settingsDoc, customDocs] = await Promise.all([
      tx.get(settingsRef),
      tx.get(db.collection('newsletterCountries')),
    ]);
    const settings = settingsDoc.data() || { version: 0, order: [], names: {}, hidden: [] };
    const countries = mergeCountries(
      customDocs.docs.map((doc) => ({ id: doc.id, name: doc.data().name as string })),
      settings as any,
    );
    if (
      customDocs.docs.some((doc) => doc.id === id) ||
      countries.some((c) =>
        [c.name, c.id, ...Object.values(c.labels || {})].some(
          (value) => value.toLocaleLowerCase() === normalized,
        ),
      )
    )
      throw createError({
        statusCode: 409,
        statusMessage: '이미 등록된 국가입니다.',
      });
    tx.create(ref, { name, createdAt: new Date().toISOString() });
    tx.set(settingsRef, {
      ...settings,
      version: (settings.version || 0) + 1,
      order: [...countries.map((country) => country.id), id],
    });
  });
  return { id, name };
});
