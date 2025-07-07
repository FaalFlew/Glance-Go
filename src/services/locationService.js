/**
 * Location service for geocoding and location data
 */

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
}

export default new LocationService();
