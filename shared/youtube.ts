import { z } from 'zod';

export const youtubeSettingsSchema = z.object({
  channelId: z.string().regex(/^UC[A-Za-z0-9_-]{22}$/),
}).strict();
export type YoutubeSettings = z.infer<typeof youtubeSettingsSchema>;
export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export function normalizeYoutubeChannelId(input: string): string | null {
  const value = input.trim();
  if (youtubeSettingsSchema.shape.channelId.safeParse(value).success) return value;
  try {
    const url = new URL(value);
    if (!['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(url.hostname) || url.protocol !== 'https:') return null;
    const match = url.pathname.match(/^\/channel\/(UC[A-Za-z0-9_-]{22})\/?$/);
    return match?.[1] || null;
  } catch { return null; }
}

export function youtubeHandle(input: string): string | null {
  let value = input.trim();
  if (value.startsWith('https://')) {
    try {
      const url = new URL(value);
      if (!['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(url.hostname)) return null;
      value = decodeURIComponent(url.pathname.replace(/\/$/, '').slice(1));
    } catch { return null; }
  }
  return /^@[\p{L}\p{N}_.-]{3,30}$/u.test(value) ? value : null;
}
