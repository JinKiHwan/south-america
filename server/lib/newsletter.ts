import sanitizeHtml from 'sanitize-html';
import { createError } from 'h3';
import { getDatabase, isFirebaseConfigured } from './firebase';
import {
  defaultCountries,
  type NewsletterCountry,
  type NewsletterInput,
  type NewsletterPost,
  type NewsletterSummary,
} from '../../shared/newsletter';
import { siteLocales } from '../../shared/site-content';

interface CountrySettings {
  version: number;
  order: string[];
  names: Record<string, string>;
  hidden: string[];
}
const emptyCountrySettings = (): CountrySettings => ({
  version: 0,
  order: [],
  names: {},
  hidden: [],
});

export function mergeCountries(custom: NewsletterCountry[], settings: CountrySettings) {
  const all = [...structuredClone(defaultCountries), ...custom];
  const positions = new Map(settings.order.map((id, index) => [id, index]));
  return all
    .filter((country) => !settings.hidden.includes(country.id))
    .map((country, initial) => ({
      ...country,
      name: settings.names[country.id] || country.name,
      labels: settings.names[country.id] ? undefined : country.labels,
      initial,
    }))
    .sort((a, b) =>
      (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
        (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
      a.initial - b.initial,
    )
    .map(({ initial: _initial, ...country }) => country);
}

export async function newsletterCountrySnapshot(): Promise<{
  version: number;
  countries: NewsletterCountry[];
}> {
  if (!isFirebaseConfigured())
    return { version: 0, countries: structuredClone(defaultCountries) };
  const db = getDatabase();
  const [settingsDoc, docs] = await Promise.all([
    db.collection('newsletterCountrySettings').doc('current').get(),
    db.collection('newsletterCountries').get(),
  ]);
  const settings = (settingsDoc.data() || emptyCountrySettings()) as CountrySettings;
  return {
    version: settings.version || 0,
    countries: mergeCountries(
      docs.docs.map((doc) => ({ id: doc.id, name: doc.data().name as string })),
      settings,
    ),
  };
}

export function cleanNewsletterHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'code',
      'pre',
      'a',
    ],
    allowedAttributes: { a: ['href', 'title', 'rel'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}
export function plainNewsletterText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .trim();
}
export function cleanNewsletter(input: NewsletterInput): NewsletterInput {
  const result = structuredClone(input);
  for (const locale of siteLocales)
    result.translations[locale].body = cleanNewsletterHtml(
      result.translations[locale].body,
    );
  const primaryLocale = result.translations.en.title ? 'en' : 'ko';
  if (!result.translations[primaryLocale].title)
    throw createError({
      statusCode: 400,
      statusMessage: '영어 제목을 입력해주세요. 기존 한국어 소식지는 그대로 수정할 수 있습니다.',
    });
  if (
    result.status === 'published' &&
    !plainNewsletterText(result.translations[primaryLocale].body)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: '공개할 소식지의 본문을 입력해주세요.',
    });
  }
  for (const locale of siteLocales.filter((item) => item !== primaryLocale)) {
    const copy = result.translations[locale];
    if (
      result.status === 'published' &&
      copy.title &&
      !plainNewsletterText(copy.body)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: '번역 제목을 입력한 언어는 본문도 입력해주세요.',
      });
    }
  }
  return result;
}
export async function newsletterCountries(): Promise<NewsletterCountry[]> {
  return (await newsletterCountrySnapshot()).countries;
}
export function newsletterDto(id: string, data: any): NewsletterPost {
  return {
    id,
    countryId: data.countryId,
    thumbnail: data.thumbnail,
    status: data.status,
    attachment: data.attachment
      ? {
          id: data.attachment.id,
          name: data.attachment.name,
          size: data.attachment.size,
        }
      : null,
    translations: Object.fromEntries(
      siteLocales.map((locale) => [
        locale,
        {
          ...data.translations[locale],
          body: cleanNewsletterHtml(data.translations[locale].body),
        },
      ]),
    ) as NewsletterPost['translations'],
    version: data.version,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    readTime: data.readTime,
  };
}
export function newsletterSummary(id: string, data: any): NewsletterSummary {
  return {
    id,
    countryId: data.countryId,
    thumbnail: data.thumbnail,
    status: data.status,
    attachment: data.attachment
      ? {
          id: data.attachment.id,
          name: data.attachment.name,
          size: data.attachment.size,
        }
      : null,
    version: data.version,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    readTime: data.readTime,
    translations: Object.fromEntries(
      siteLocales.map((locale) => [
        locale,
        {
          title: data.translations[locale].title,
          excerpt: data.translations[locale].excerpt,
        },
      ]),
    ) as NewsletterSummary['translations'],
  };
}
export const newsletterSummaryFields = [
  'countryId',
  'thumbnail',
  'status',
  'attachment',
  'version',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'readTime',
  ...siteLocales.flatMap((locale) => [
    'translations.' + locale + '.title',
    'translations.' + locale + '.excerpt',
  ]),
];
