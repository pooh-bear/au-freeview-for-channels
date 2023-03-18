import fetch from "node-fetch";

const disableExclusions = process.env.DISABLE_EXCLUSIONS && String(process.env.DISABLE_EXCLUSIONS.toLowerCase) === 'true';
const excludePrefixes = process.env.EXCLUDE_CHANNELS_PREFIXES ? process.env.EXCLUDE_CHANNELS_PREFIXES.split(',') : ['mjh-7-cas', 'mjh-abc-90-seconds'];

const channelBlock = process.env.CHANNEL_NUMBER_BLOCK ? Number(process.env.CHANNEL_NUMBER_BLOCK) : null;

interface M3u8Entry {
    url: string;
    [key: string]: string;
}


const getPlaylist = async (city: string, baseUrl: string, childNodeBase?: string) => {
    try {
        if (city) {
            const playlistUrl = buildPlaylistUrl(city);
            const response = await fetch(playlistUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${playlistUrl}`);
            }
            const originalPlaylist = await response.text();
            const entries = parseM3u8(originalPlaylist);

            let processedPlaylist = `#EXTM3U x-tvg-url="${baseUrl}/epg/${city}"\n\n`;

            const playlistEntries = entries.map(e => createM3u8Entry(e, childNodeBase)).join('');

            processedPlaylist += playlistEntries;

            return processedPlaylist;
        } else {
            throw new Error('City name not provided');
        }
    } catch (e) {
        throw e;
    }
}

function parseM3u8(m3u8String: string): M3u8Entry[] {
    const lines = m3u8String.trim().split('\n');
    const data: M3u8Entry[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('#EXTINF:')) {
            const match = line.match(/#EXTINF:-1\s?(.*)/);
            if (match !== null) {
                const properties = match[1].trim().split(/(?<!\\) /).map(prop => prop.replace(/\\/g, ''));
                const url = lines[i + 1];
                const obj: M3u8Entry = { url };
                properties.forEach((p, index) => {
                    const [key, value] = p.split(/(?<!\\)="(.+)?"/);
                    if (value !== undefined) {
                        obj[key] = value.replace(/\\/g, '');
                    }
                });
                const channelNameArr = match[1].split(',').slice(1).join(',').trim();
                if (channelNameArr.length > 0) {
                    obj.channel_name = channelNameArr;
                }
                data.push(obj);
            }
        }
    }

    addChannelNumber(data);

    return data;
}

function addChannelNumber(data: M3u8Entry[]): void {
    const channelMap: Record<string, string> = {};
    let count = 1;
    let unknownChNumberCount = 1;
    const highestChannelNumber = data.reduce((acc: number, entry: M3u8Entry) => {
        if (entry.hasOwnProperty('tvg-chno')) {
            const channelNumber = entry['tvg-chno'];
            if (Number(channelNumber) > acc) {
                return Number(channelNumber);
            }
        }
        return acc;
    }, 0);

    let knownChIdx: number[] = [];
    let unknownChIdx: number[] = [];

    for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        if (entry.hasOwnProperty('tvg-chno')) {
            knownChIdx.push(i);
        } else {
            unknownChNumberCount++;
            unknownChIdx.push(i);
        }
    }

    const calculatedHighestChannelNumber = highestChannelNumber + unknownChNumberCount;

    knownChIdx.forEach(idx => {
        let entry = data[idx];
        
        if (channelBlock) {
            let blockLength = String(channelBlock).length;
            if (blockLength < String(calculatedHighestChannelNumber).length) {
                blockLength = String(calculatedHighestChannelNumber).length;
            }

            entry.channel_number = entry['tvg-chno'] = String(Number(String(entry['tvg-chno']).padStart(blockLength, '0')) + channelBlock);
        } else {
            entry.channel_number = entry['tvg-chno'];
        }
    });

    unknownChIdx.forEach((aidx, idx) => {
        let entry = data[aidx];
        
        if (channelBlock) {
            let blockLength = String(channelBlock).length;
            if (blockLength < String(calculatedHighestChannelNumber).length) {
                blockLength = String(calculatedHighestChannelNumber).length;
            }

            entry.channel_number = entry['tvg-chno'] = String(Number(String(highestChannelNumber + (idx + 1)).padStart(blockLength, '0')) + channelBlock);
        } else {
            entry.channel_number = entry['tvg-chno'] = String(highestChannelNumber + idx + 1);

        }
    });

}

function createM3u8Entry(entry: M3u8Entry, childNodeBase?: string): string {
    if (!disableExclusions && excludePrefixes.some(id => String(entry['tvg-id']).startsWith(id))) {
        return '';
    }

    const channelName = (entry.channel_name ?? '').replace('|', '');

    const properties = Object.entries(entry)
        .filter(([key]) => key !== 'url' && key !== 'channel_name')
        .map(([key, value]) => `${key.replace(/_/g, '-')}="${value}"`)
        .join(' ');

    if (childNodeBase) {
        entry.url = `${childNodeBase}/devices/ANY/channels/${entry.channel_number}/hls/stream.m3u8?codec=copy`;
    }
    return `#EXTINF:-1 ${properties}, ${channelName}\n${entry.url}\n\n`;
}

const buildPlaylistUrl = (city: string) => {
    return `https://i.mjh.nz/au/${city}/raw-tv.m3u8`;
}

export { getPlaylist };