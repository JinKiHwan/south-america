import { getDatabase, isFirebaseConfigured } from './firebase';
import { youtubeSettingsSchema, type YoutubeVideo } from '../../shared/youtube';

export async function youtubeSettingsSnapshot(): Promise<{ version: number; channelId: string }> {
  if (!isFirebaseConfigured()) return { version: 0, channelId: '' };
  const doc = await getDatabase().collection('siteSettings').doc('youtube').get();
  const channelId = doc.data()?.channelId || '';
  return { version: doc.data()?.version ?? 0, channelId: youtubeSettingsSchema.shape.channelId.safeParse(channelId).success ? channelId : '' };
}

const cache = new Map<string, { expires: number; videos: YoutubeVideo[] }>();

async function youtubeData(path: string, params: Record<string, string>, key: string): Promise<any> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set('key', key);
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`YouTube API returned HTTP ${response.status}`);
  return response.json();
}

export async function latestYoutubeVideos(channelId: string, key: string): Promise<YoutubeVideo[]> {
  const cached = cache.get(channelId);
  if (cached && cached.expires > Date.now()) return cached.videos;
  const channel = await youtubeData('channels', { part: 'contentDetails', id: channelId }, key);
  const uploadsId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (typeof uploadsId !== 'string') throw new Error('YouTube channel uploads playlist not found');
  const playlist = await youtubeData('playlistItems', {
    part: 'snippet,contentDetails', playlistId: uploadsId, maxResults: '12',
  }, key);
  const videos = (Array.isArray(playlist.items) ? playlist.items : []).flatMap((item: any) => {
    const id = item.contentDetails?.videoId;
    const title = item.snippet?.title;
    const thumbnail = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url;
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(id) ||
        typeof title !== 'string' || title === 'Private video' || title === 'Deleted video' ||
        typeof thumbnail !== 'string') return [];
    try {
      const host = new URL(thumbnail).hostname;
      if (!['i.ytimg.com', 'img.youtube.com'].includes(host)) return [];
    } catch { return []; }
    return [{ id, title, thumbnail, publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || '' }];
  });
  cache.set(channelId, { expires: Date.now() + 15 * 60 * 1000, videos });
  return videos;
}

export async function resolveYoutubeHandle(handle: string, key: string): Promise<string | null> {
  const result = await youtubeData('channels', { part: 'id', forHandle: handle }, key);
  const id = result.items?.[0]?.id;
  return youtubeSettingsSchema.shape.channelId.safeParse(id).success ? id : null;
}
