import apiService from "./apiService";
import { API_ENDPOINTS, API_KEYS, API_LIMITS } from "@/constants/api";

class NewsService {
  constructor() {
    this.apiKey = API_KEYS.GNEWS;
  }

  async getNewsForCountry(countryCode) {
    if (!this.apiKey) {
      throw new Error("GNews API token is not configured");
    }

    const url = apiService.buildUrl(API_ENDPOINTS.GNEWS, {
      country: countryCode.toLowerCase(),
      max: API_LIMITS.NEWS_MAX_ARTICLES,
      token: this.apiKey,
    });

    const data = await apiService.get(url);

    if (data.errors) {
      throw new Error(data.errors[0] || "Could not connect to GNews service");
    }

    return data.articles || [];
  }
}

export default new NewsService();
