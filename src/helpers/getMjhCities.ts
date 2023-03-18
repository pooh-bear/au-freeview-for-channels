import fetch from "node-fetch";
import cheerio from "cheerio";

const mjh_au_cities = "https://i.mjh.nz/au/";

// Fetch cities that MJH feeds support
const citiesScraper = async (url: string): Promise<string[]> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    // Extract city names from HTML resp
    const cities: string[] = [];
    $("pre a").each((_index, element) => {
      const href = $(element).attr("href");
      const cityName = $(element).text();
      if (href && href.endsWith("/") && !href.startsWith("all") && !href.startsWith("../")) {
        cities.push(cityName.replace(/\/$/, ''));
      }
    });

    return cities;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const fetchCities = async (): Promise<string[]> => {
    const cities = await citiesScraper(mjh_au_cities);
    return cities;
}

export default fetchCities;