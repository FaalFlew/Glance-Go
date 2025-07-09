/**
 * Timezone service for TimeZoneDB API integration
 */

import apiService from "./apiService";
import { API_ENDPOINTS, API_KEYS } from "@/constants/api";
import { formatTimeDifference } from "@/utils/time";

class TimezoneService {
  constructor() {
    this.apiKey = API_KEYS.TIMEZONE_DB;
  }

  /**
   * Get timezone data for coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Timezone data
   */
  async getTimezoneData(lat, lng) {
    if (!this.apiKey) {
      throw new Error("TimeZoneDB API key is not configured");
    }

    const url = apiService.buildUrl(API_ENDPOINTS.TIMEZONE_DB, {
      key: this.apiKey,
      format: "json",
      by: "position",
      lat,
      lng,
    });

    const data = await apiService.get(url);

    if (data.status !== "OK") {
      throw new Error(`Time service error: ${data.message}`);
    }

    return this.transformTimezoneData(data);
  }

  /**
   * Transform timezone data to app format
   * @param {Object} data - Raw TimeZoneDB response
   * @returns {Object} Transformed timezone data
   */
  transformTimezoneData(data) {
    const remoteOffsetHours = data.gmtOffset / 3600;
    const localOffsetHours = (new Date().getTimezoneOffset() / 60) * -1;

    return {
      countryCode: data.countryCode,
      timezone: data.zoneName.replace(/_/g, " "),
      datetime: data.formatted,
      abbreviation: data.abbreviation,
      utcOffset: `UTC${remoteOffsetHours >= 0 ? "+" : ""}${remoteOffsetHours}`,
      timeDifference: formatTimeDifference(remoteOffsetHours, localOffsetHours),
      currentTime: new Date(data.formatted),
    };
  }
}

export default new TimezoneService();
