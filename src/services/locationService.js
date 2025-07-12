import apiService from "./apiService";
import { API_ENDPOINTS } from "@/constants/api";
import { sanitizeLocationName } from "@/utils/validation";

class LocationService {
  async getLocationData(lat, lng) {
    const url = apiService.buildUrl(API_ENDPOINTS.NOMINATIM, {
      format: "json",
      lat,
      lon: lng,
      zoom: 10,
      "accept-language": "en",
    });

    const data = await apiService.get(url);

    if (data.error) {
      throw new Error("Unable to geocode location");
    }

    return this.transformLocationData(data);
  }

  async getSunriseSunset(lat, lng) {
    const url = apiService.buildUrl(API_ENDPOINTS.SUNRISE_SUNSET, {
      latitude: lat,
      longitude: lng,
      daily: "sunrise,sunset",
      timezone: "auto",
    });

    const data = await apiService.get(url);

    if (!data?.daily?.sunrise?.length || !data?.daily?.sunset?.length) {
      throw new Error("Could not get sunrise/sunset times from Open-Meteo");
    }

    return {
      sunrise: new Date(data.daily.sunrise[0]),
      sunset: new Date(data.daily.sunset[0]),
    };
  }

  transformLocationData(data) {
    const { address } = data;

    const city =
      address.village ||
      address.town ||
      address.city ||
      address.municipality ||
      address.county ||
      address.state;

    const country = address.country;

    if (!country) {
      throw new Error("Could not identify country");
    }

    return {
      city: sanitizeLocationName(city),
      country: sanitizeLocationName(country),
      displayName: `${city || "Location"}, ${country}`,
    };
  }
}

export default new LocationService();
