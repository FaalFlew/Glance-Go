import apiService from "./apiService";
import { API_ENDPOINTS, API_KEYS } from "@/constants/api";
import { formatTimeDifference } from "@/utils/time";

class TimezoneService {
  constructor() {
    this.apiKey = API_KEYS.TIMEZONE_DB;
  }

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

  transformTimezoneData(data) {
    const remoteOffsetHours = data.gmtOffset / 3600;
    const localOffsetHours = (new Date().getTimezoneOffset() / 60) * -1;

    return {
      countryCode: data.countryCode,
      timezone: data.zoneName,
      datetime: data.formatted,
      abbreviation: data.abbreviation,
      utcOffset: `UTC${remoteOffsetHours >= 0 ? "+" : ""}${remoteOffsetHours}`,
      timeDifference: formatTimeDifference(remoteOffsetHours, localOffsetHours),
      currentTime: new Date(data.formatted),
    };
  }
}

export default new TimezoneService();
