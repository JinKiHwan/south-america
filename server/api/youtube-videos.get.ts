import { latestYoutubeVideos, youtubeSettingsSnapshot } from '../lib/youtube';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const { channelId } = await youtubeSettingsSnapshot();
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!channelId || !key) return { channelId, videos: [] };
  try {
    return { channelId, videos: await latestYoutubeVideos(channelId, key) };
  } catch (error) {
    console.error('Could not load YouTube videos.', error instanceof Error ? error.message : 'unknown');
    return { channelId, videos: [] };
  }
});
