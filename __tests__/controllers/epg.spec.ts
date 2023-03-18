//@ts-ignore
import { getEpg } from '@/controllers/epg';

describe('getEpg', () => {
  test('should return filtered EPG data for valid city', async () => {
    const city = 'Sydney';
    const epgData = await getEpg(city);

    expect(epgData).toBeDefined();
    expect(epgData).not.toContain('<lcn>');
  });

  test('should throw error for invalid city', async () => {
    const city = '';
    await expect(getEpg(city)).rejects.toThrow('City name not provided');
  });

  test('should throw error for failed fetch', async () => {
    const city = 'invalid-city';
    await expect(getEpg(city)).rejects.toThrow(`Failed to fetch data from https://i.mjh.nz/au/${city}/epg.xml`);
  });
});