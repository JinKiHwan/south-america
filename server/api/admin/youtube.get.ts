import { youtubeSettingsSnapshot } from '../../lib/youtube';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  return { ...await youtubeSettingsSnapshot(), apiKeyConfigured: Boolean(process.env.YOUTUBE_API_KEY?.trim()) };
});
