import fetch from "node-fetch";

const getEpg = async (city: string) => {
    try {
        if (city) {
            const epgUrl = buildEpgUrl(city);
            const response = await fetch(epgUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${epgUrl}`);
            }

            const originalEpg = await response.text();
            return filterLcn(originalEpg);
        } else {
            throw new Error('City name not provided');
        }
    } catch (e) {
        throw e;
    }
}

const filterLcn = (content: string) => {
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => !line.includes('<lcn>'));
    return filteredLines.join('\n');
}

const buildEpgUrl = (city: string) => {
    if (city.toLowerCase() === 'foxtel') {
        return `https://i.mjh.nz/Foxtel/epg.xml`;
    } else {
        return `https://i.mjh.nz/au/${city}/epg.xml`;
    }
}

export { getEpg };