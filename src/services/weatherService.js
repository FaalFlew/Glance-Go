import apiService from "./apiService";
import { API_ENDPOINTS, API_KEYS } from "@/constants/api";

class WeatherService {
  constructor() {
    this.apiKey = API_KEYS.OPENWEATHER;
  }

  async getCurrentWeather(lat, lng) {
    if (!this.apiKey) {
      throw new Error("OpenWeather API key is not configured");
    }

    const url = apiService.buildUrl(API_ENDPOINTS.OPENWEATHER_CURRENT, {
      lat,
      lon: lng,
      appid: this.apiKey,
      units: "metric",
    });

    const data = await apiService.get(url);

    if (data.cod !== 200) {
      throw new Error(`Weather service error: ${data.message}`);
    }

    return this.transformCurrentWeather(data);
  }

  transformCurrentWeather(data) {
    return {
      temperature: Math.round(data.main.temp),
      weatherDescription: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
    };
  }
}

export default new WeatherService();
