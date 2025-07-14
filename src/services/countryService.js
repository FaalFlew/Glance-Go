import apiService from "./apiService";
import { API_ENDPOINTS } from "@/constants/api";
import powerData from "@/data/powerInfo.json";
import { FALLBACK } from "@/constants/app";

class CountryService {
  async getCountryData(countryCode) {
    const url = `${API_ENDPOINTS.REST_COUNTRIES}/${countryCode}`;

    const data = await apiService.get(url);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Country data not found");
    }

    return this.transformCountryData(data[0]);
  }

  transformCountryData(data) {
    const currencyInfo = Object.values(data.currencies || {})[0] || {};
    const currencyCode = Object.keys(data.currencies || {})[0] || FALLBACK;

    const countryCode = data.cca2;
    const powerInfo = powerData[countryCode] || {
      plugs: [FALLBACK],
      voltage: FALLBACK,
      frequency: FALLBACK,
    };
    return {
      currency: {
        name: currencyInfo.name || FALLBACK,
        code: currencyCode,
        symbol: currencyInfo.symbol || FALLBACK,
      },
      facts: {
        currency: {
          name: currencyInfo.name || FALLBACK,
          code: currencyCode,
          symbol: currencyInfo.symbol || FALLBACK,
        },
        capital: data.capital?.[0] || FALLBACK,
        population: data.population || 0,
        region: data.region || FALLBACK,
        subregion: data.subregion || FALLBACK,
        languages: Object.values(data.languages || {}).join(", ") || FALLBACK,
        callingCode: `${data.idd?.root || ""}${data.idd?.suffixes?.[0] || ""}`,
        drivingSide: data.car?.side || FALLBACK,
        tld: data.tld?.[0] || FALLBACK,
        demonym: data.demonyms?.eng?.m || FALLBACK,
        vehicleSign: data.car?.signs?.[0] || FALLBACK,
        power: powerInfo || FALLBACK,
      },
    };
  }
}

export default new CountryService();
