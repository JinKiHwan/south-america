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
  if (!result.translations.ko.title)
    throw createError({
      statusCode: 400,
      statusMessage: '한국어 제목을 입력해주세요.',
    });
  if (
    result.status === 'published' &&
    !plainNewsletterText(result.translations.ko.body)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: '공개할 소식지의 본문을 입력해주세요.',
    });
  }
  for (const locale of siteLocales.filter((item) => item !== 'ko')) {
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
  if (!isFirebaseConfigured()) return structuredClone(defaultCountries);
  const docs = await getDatabase().collection('newsletterCountries').get();
  return [
    ...structuredClone(defaultCountries),
    ...docs.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
    })),
  ];
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
