//@ts-ignore
import { getPlaylist } from '@/controllers/playlist';

describe('getPlaylist', () => {
  test('should return processed playlist for valid city', async () => {
    const baseUrl = 'http://example.com';
    const city = 'Sydney';
    const processedPlaylist = await getPlaylist(city, baseUrl);

    expect(processedPlaylist).toBeDefined();
    expect(processedPlaylist).toContain('#EXTM3U');
    expect(processedPlaylist).toContain('#EXTINF');
    expect(processedPlaylist).toContain(city);
  });

  test('should throw error for invalid city', async () => {
    const baseUrl = 'http://example.com';
    const city = '';
    await expect(getPlaylist(city, baseUrl)).rejects.toThrow('City name not provided');
  });

  test('should throw error for failed fetch', async () => {
    const baseUrl = 'http://example.com';
    const city = 'invalid-city';
    await expect(getPlaylist(city, baseUrl)).rejects.toThrow(`Failed to fetch data from https://i.mjh.nz/au/${city}/raw-tv.m3u8`);
  });
});