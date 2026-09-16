import { z } from 'zod';
import { countryNameSchema, defaultCountries } from '../../../shared/newsletter';
import { getDatabase } from '../../lib/firebase';
import { mergeCountries } from '../../lib/newsletter';

const inputSchema = z.object({
  version: z.number().int().nonnegative(),
  countries: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]{1,80}$/),
    name: countryNameSchema,
  }).strict()).min(1).max(100),
}).strict();

export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  await requireAdmin(event);
  const input = inputSchema.safeParse(await readLimitedJson(event, 16 * 1024));
  if (!input.success) throw createError({ statusCode: 400, statusMessage: '국가 목록을 확인해주세요.' });
  const db = getDatabase();
  const settingsRef = db.collection('newsletterCountrySettings').doc('current');
  const submitted = input.data.countries.map((country) => ({
    id: country.id,
    name: country.name.normalize('NFKC').replace(/\s+/g, ' ').trim(),
  }));
  if (new Set(submitted.map((country) => country.id)).size !== submitted.length ||
      new Set(submitted.map((country) => country.name.toLocaleLowerCase())).size !== submitted.length)
    throw createError({ statusCode: 409, statusMessage: '국가 이름이나 순서가 중복되었습니다.' });

  await db.runTransaction(async (tx) => {
    const [settingsDoc, customDocs] = await Promise.all([
      tx.get(settingsRef),
      tx.get(db.collection('newsletterCountries')),
    ]);
    const settings = settingsDoc.data() || { version: 0, order: [], names: {}, hidden: [] };
    if ((settings.version || 0) !== input.data.version)
      throw createError({ statusCode: 409, statusMessage: '다른 창에서 국가 목록이 수정되었습니다. 새로고침 후 다시 시도해주세요.' });
    const all = mergeCountries(
      customDocs.docs.map((doc) => ({ id: doc.id, name: doc.data().name as string })),
      settings as any,
    );
    const originalNames = new Map([
      ...defaultCountries.map((country) => [country.id, country.name] as const),
      ...customDocs.docs.map((doc) => [doc.id, doc.data().name as string] as const),
    ]);
    const currentIds = new Set(all.map((country) => country.id));
    if (submitted.some((country) => !currentIds.has(country.id)))
      throw createError({ statusCode: 400, statusMessage: '등록되지 않은 국가가 포함되어 있습니다.' });
    const submittedIds = new Set(submitted.map((country) => country.id));
    const removed = all.filter((country) => !submittedIds.has(country.id));
    for (const country of removed) {
      const used = await tx.get(db.collection('newsletters').where('countryId', '==', country.id).limit(1));
      if (!used.empty)
        throw createError({ statusCode: 409, statusMessage: `${country.name}에 연결된 게시글이 있어 삭제할 수 없습니다.` });
    }
    tx.set(settingsRef, {
      version: input.data.version + 1,
      order: submitted.map((country) => country.id),
      names: Object.fromEntries(submitted.filter((country) => country.name !== originalNames.get(country.id)).map((country) => [country.id, country.name])),
      hidden: [...new Set([...(settings.hidden || []), ...removed.map((country) => country.id)])],
    });
  });
  return { version: input.data.version + 1, countries: submitted };
});
