import { z } from 'zod';
import messages from './default-copy';

export const siteLocales = ['ko', 'en', 'es', 'pt'] as const;
export type SiteLocale = typeof siteLocales[number];
export type ContentSection = 'hero' | 'missionary';
export const localeNames: Record<SiteLocale, string> = {
  ko: '한국어', en: 'English', es: 'Español', pt: 'Português',
};

const shortText = z.string().trim().min(1).max(180);
const imageUrl = z.string().regex(/^\/(?:images\/[a-zA-Z0-9/_\-.]+|api\/site-images\/[a-f0-9-]+\.webp)$/);
const heroText = z.object({
  title: shortText,
  description: z.string().trim().max(600),
  imageAlt: z.string().trim().max(200),
}).strict();
const missionaryText = z.object({
  label: z.string().trim().max(80),
  title: shortText,
  role: z.string().trim().max(200),
  description: z.string().trim().min(1).max(6000),
  imageAlt: z.string().trim().max(200),
  buttonLabel: z.string().trim().max(80),
  badgeTitle: z.string().trim().max(80),
  badgeSubtitle: z.string().trim().max(80),
}).strict();

export const heroSchema = z.object({
  imageUrl,
  alignment: z.enum(['left', 'center', 'right']),
  translations: z.object({ ko: heroText, en: heroText, es: heroText, pt: heroText }).strict(),
}).strict();
export const missionarySchema = z.object({
  imageUrl,
  translations: z.object({ ko: missionaryText, en: missionaryText, es: missionaryText, pt: missionaryText }).strict(),
}).strict();

export type HeroContent = z.infer<typeof heroSchema>;
export type MissionaryContent = z.infer<typeof missionarySchema>;
export interface SiteContent {
  hero: HeroContent;
  missionary: MissionaryContent;
  version: number;
  updatedAt: string | null;
}

export function createDefaultContent(): SiteContent {
  const heroTranslations = {} as HeroContent['translations'];
  const missionaryTranslations = {} as MissionaryContent['translations'];
  for (const locale of siteLocales) {
    const copy = messages[locale];
    heroTranslations[locale] = {
      title: copy.hero.main_title,
      description: copy.hero.description,
      imageAlt: copy.hero.image_alt,
    };
    missionaryTranslations[locale] = {
      label: copy.missionary.title + ' ' + copy.missionary.highlight,
      title: copy.missionary.name,
      role: copy.missionary.role,
      description: copy.missionary.description1 + '\n\n' + copy.missionary.description2,
      imageAlt: copy.missionary.name,
      buttonLabel: copy.missionary.btn_contact,
      badgeTitle: 'EST. 2006',
      badgeSubtitle: 'South America',
    };
  }
  return {
    hero: { imageUrl: '/images/heroSection/hero_slide_01.webp', alignment: 'center', translations: heroTranslations },
    missionary: { imageUrl: '/images/mock/missionary_family.png', translations: missionaryTranslations },
    version: 0,
    updatedAt: null,
  };
}

export function parseSiteContent(value: unknown): SiteContent {
  return z.object({
    hero: heroSchema,
    missionary: missionarySchema,
    version: z.number().int().nonnegative(),
    updatedAt: z.string().nullable(),
  }).parse(value);
}
