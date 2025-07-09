import { API_LIMITS } from "@/constants/api";
import { validateApiResponse } from "@/utils/validation";

class ApiService {
  constructor() {
    this.timeout = API_LIMITS.REQUEST_TIMEOUT;
  }

  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "WorldTimeApp/1.0",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      validateApiResponse(response);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error("Request timeout - please check your connection");
      }

      throw error;
    }
  }

  async get(url, options = {}) {
    const response = await this.request(url, { ...options, method: "GET" });
    return await response.json();
  }

  buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    return url.toString();
  }
}

export default new ApiService();
