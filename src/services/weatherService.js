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

  async getForecast(lat, lng) {
    if (!this.apiKey) {
      throw new Error("OpenWeather API key is not configured");
    }

    const url = apiService.buildUrl(API_ENDPOINTS.OPENWEATHER_FORECAST, {
      lat,
      lon: lng,
      appid: this.apiKey,
      units: "metric",
    });

    const data = await apiService.get(url);

    if (data.cod !== "200") {
      throw new Error(`Forecast service error: ${data.message}`);
    }

    return this.transformForecast(data);
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

  transformForecast(data) {
    const dailyData = {};

    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = { temps: [], icons: [] };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].icons.push(item.weather[0].icon);
    });

    return Object.keys(dailyData)
      .slice(1, 6)
      .map((date) => {
        const day = dailyData[date];
        return {
          date: new Date(date),
          maxTemp: Math.round(Math.max(...day.temps)),
          minTemp: Math.round(Math.min(...day.temps)),
          iconUrl: `${API_ENDPOINTS.WEATHER_ICONS}/${
            day.icons[Math.floor(day.icons.length / 2)]
          }@2x.png`,
        };
      });
  }
}

export default new WeatherService();
