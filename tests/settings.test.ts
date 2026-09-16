import test from 'node:test';
import assert from 'node:assert/strict';
import { contactTypeSchema, defaultContactTypes } from '../shared/contact-types.ts';
import { parseContactInput, createContactMail } from '../server/lib/contact-email.ts';
import { mergeCountries } from '../server/lib/newsletter.ts';
import { normalizeYoutubeChannelId, youtubeHandle } from '../shared/youtube.ts';
import { latestYoutubeVideos } from '../server/lib/youtube.ts';

test('country settings preserve IDs and apply reordered, renamed and removed countries', () => {
  const countries = mergeCountries([{ id: 'country-colombia', name: '콜롬비아' }], {
    version: 1,
    order: ['country-colombia', 'peru', 'brazil'],
    names: { peru: '페루 수정' },
    hidden: ['mexico'],
  });
  assert.deepEqual(countries.map((country) => country.id), ['country-colombia', 'peru', 'brazil', 'general']);
  assert.equal(countries[1]?.name, '페루 수정');
  assert.equal(countries[1]?.labels, undefined);
});

test('custom contact type is accepted only when configured; header injection is rejected', () => {
  const input = { name: 'Sender', email: 'test@example.com', type: 'type-custom', message: 'Hello from the site', website: '' };
  assert.throws(() => parseContactInput(input));
  const parsed = parseContactInput(input, ['type-custom']);
  assert.match(createContactMail(parsed, 'mailer@gmail.com', '새 문의').subject, /새 문의/);
  assert.equal(defaultContactTypes.length, 3);
  assert.equal(contactTypeSchema.safeParse({ id: 'type-x', labels: { ko: 'hello\nBcc: x', en: 'x', es: 'x', pt: 'x' } }).success, false);
});

test('YouTube channel ID accepts only channel URLs and latest uploads use the official API', async (t) => {
  const channelId = 'UC' + 'A'.repeat(22);
  assert.equal(normalizeYoutubeChannelId(channelId), channelId);
  assert.equal(normalizeYoutubeChannelId(`https://www.youtube.com/channel/${channelId}`), channelId);
  assert.equal(normalizeYoutubeChannelId(`https://evil.example/channel/${channelId}`), null);
  assert.equal(normalizeYoutubeChannelId('https://www.youtube.com/@unverified'), null);
  assert.equal(youtubeHandle('https://www.youtube.com/@sample-channel'), '@sample-channel');
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (url: URL) => {
    calls++;
    assert.equal(url.searchParams.get('key'), 'test-key');
    if (calls === 1) {
      assert.equal(url.pathname, '/youtube/v3/channels');
      return Response.json({ items: [{ contentDetails: { relatedPlaylists: { uploads: 'UUtest' } } }] });
    }
    assert.equal(url.pathname, '/youtube/v3/playlistItems');
    return Response.json({ items: [{
      contentDetails: { videoId: 'abcdefghijk', videoPublishedAt: '2026-08-01T00:00:00Z' },
      snippet: { title: 'Recent sermon', thumbnails: { high: { url: 'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg' } } },
    }] });
  });
  const videos = await latestYoutubeVideos(channelId, 'test-key');
  assert.equal(videos.length, 1);
  assert.equal(videos[0]?.title, 'Recent sermon');
  assert.equal((await latestYoutubeVideos(channelId, 'test-key')).length, 1);
  assert.equal(calls, 2);
});
