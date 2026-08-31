import { z } from 'zod';
import { siteLocales, type SiteLocale } from './site-content';

export const newsletterId = z.string().uuid();
export const countryNameSchema = z.string().trim().min(1).max(60);
export interface NewsletterCountry {
  id: string;
  name: string;
  labels?: Partial<Record<SiteLocale, string>>;
}
export const defaultCountries: NewsletterCountry[] = [
  {
    id: 'brazil',
    name: '브라질',
    labels: { en: 'Brazil', es: 'Brasil', pt: 'Brasil' },
  },
  { id: 'peru', name: '페루', labels: { en: 'Peru', es: 'Perú', pt: 'Peru' } },
  {
    id: 'mexico',
    name: '멕시코',
    labels: { en: 'Mexico', es: 'México', pt: 'México' },
  },
  {
    id: 'general',
    name: '기타',
    labels: { en: 'Other', es: 'Otros', pt: 'Outros' },
  },
];
export const newsletterTextSchema = z
  .object({
    title: z.string().trim().max(180),
    excerpt: z.string().trim().max(600),
    body: z.string().max(50_000),
  })
  .strict();
export const newsletterInputSchema = z
  .object({
    countryId: z.string().regex(/^[a-z0-9-]{1,80}$/),
    thumbnail: z
      .string()
      .regex(
        /^\/(?:images\/[a-zA-Z0-9/_\-.]+|api\/site-images\/[a-f0-9-]+\.webp)$/,
      )
      .or(z.literal('')),
    status: z.enum(['hidden', 'published']),
    attachmentId: newsletterId.nullable(),
    translations: z
      .object({
        ko: newsletterTextSchema,
        en: newsletterTextSchema,
        es: newsletterTextSchema,
        pt: newsletterTextSchema,
      })
      .strict(),
  })
  .strict();
export type NewsletterInput = z.infer<typeof newsletterInputSchema>;
export type NewsletterText = z.infer<typeof newsletterTextSchema>;
export interface PdfAttachment {
  id: string;
  name: string;
  size: number;
}
export interface NewsletterPost
  extends Omit<NewsletterInput, 'status' | 'attachmentId'> {
  id: string;
  status: 'hidden' | 'published' | 'deleted';
  attachment: PdfAttachment | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  readTime: number;
}
export type NewsletterSummary = Omit<NewsletterPost, 'translations'> & {
  translations: Record<SiteLocale, Pick<NewsletterText, 'title' | 'excerpt'>>;
};
export function emptyNewsletter(): NewsletterInput {
  return {
    countryId: 'brazil',
    thumbnail: '',
    status: 'hidden',
    attachmentId: null,
    translations: Object.fromEntries(
      siteLocales.map((locale) => [
        locale,
        { title: '', excerpt: '', body: '' },
      ]),
    ) as NewsletterInput['translations'],
  };
}
export function newsletterCopy<T extends { title: string }>(
  translations: Record<SiteLocale, T>,
  locale: string,
): T {
  const copy = translations[locale as SiteLocale];
  return copy?.title?.trim() ? copy : translations.ko;
}
export function countryLabel(
  country: NewsletterCountry | undefined,
  locale: string,
) {
  return country?.labels?.[locale as SiteLocale] || country?.name || '';
}
export function formatFileSize(size: number) {
  return size >= 1024 ** 3
    ? (size / 1024 ** 3).toFixed(1) + ' GB'
    : (size / 1024 ** 2).toFixed(1) + ' MB';
}
export const PDF_CHUNK_BYTES = 3 * 1024 * 1024;
export const PDF_MAX_BYTES = 500 * 1024 * 1024;
