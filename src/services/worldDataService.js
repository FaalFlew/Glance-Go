import locationService from "./locationService";
import weatherService from "./weatherService";
import timezoneService from "./timezoneService";
import countryService from "./countryService";
import newsService from "./newsService";
import { validateCoordinates } from "@/utils/validation";
import { isDayTime } from "@/utils/time";
import { API_ENDPOINTS } from "@/constants/api";

class WorldDataService {
  async getLocationData(lat, lng) {
    if (!validateCoordinates(lat, lng)) {
      throw new Error("Invalid coordinates provided");
    }
    const [locationData, sunData, weatherData, timezoneData] =
      await Promise.all([
        locationService.getLocationData(lat, lng),
        locationService.getSunriseSunset(lat, lng),
        weatherService.getCurrentWeather(lat, lng),
        timezoneService.getTimezoneData(lat, lng),
      ]);

    const countryData = await countryService.getCountryData(
      timezoneData.countryCode
    );

    return this.combineLocationData(
      locationData,
      sunData,
      timezoneData,
      weatherData,
      countryData
    );
  }

  async getForecast(lat, lng) {
    return weatherService.getForecast(lat, lng);
  }

  async getNewsForCountry(countryCode) {
    return newsService.getNewsForCountry(countryCode);
  }

  combineLocationData(
    locationData,
    sunData,
    timezoneData,
    weatherData,
    countryData
  ) {
    const isDay = isDayTime(
      timezoneData.currentTime,
      sunData.sunrise,
      sunData.sunset
    );
    return {
      locationName: locationData.displayName,
      country: locationData.country,
      countryCode: timezoneData.countryCode,
      timezone: timezoneData.timezone,
      datetime: timezoneData.datetime,
      abbreviation: timezoneData.abbreviation,
      utcOffset: timezoneData.utcOffset,
      timeDifference: timezoneData.timeDifference,
      isDay,
      sunrise: sunData.sunrise.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: sunData.sunset.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      flagUrl: `${
        API_ENDPOINTS.FLAGS
      }/${timezoneData.countryCode.toLowerCase()}.png`,
      ...weatherData,
      ...countryData,
      _sunriseTime: sunData.sunrise,
      _sunsetTime: sunData.sunset,
      _currentTime: timezoneData.currentTime,
    };
  }
}

export default new WorldDataService();
