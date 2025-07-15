import { ref, computed } from "vue";
import worldDataService from "@/services/worldDataService";
import { validateApiKeys } from "@/utils/validation";
import { API_KEYS } from "@/constants/api";

export function useWorldTime() {
  const locationData = ref(null);
  const forecastData = ref(null);
  const newsData = ref(null);
  const isLoading = ref(false);
  const isNewsLoading = ref(false);
  const error = ref(null);
  const newsError = ref(null);

  const hasLocationData = computed(() => !!locationData.value);
  const currentLocationName = computed(
    () => locationData.value?.locationName || ""
  );

  const fetchLocationData = async (lat, lng) => {
    const missingKeys = validateApiKeys(API_KEYS);
    if (missingKeys.length > 0) {
      error.value = `Missing API keys: ${missingKeys.join(", ")}.`;
      return;
    }

    isLoading.value = true;
    error.value = null;
    locationData.value = null;
    forecastData.value = null;

    try {
      const data = await worldDataService.getLocationData(lat, lng);

      const { _sunriseTime, _sunsetTime, _currentTime, ...mainData } = data;
      locationData.value = {
        ...mainData,
        _internal: {
          sunrise: _sunriseTime,
          sunset: _sunsetTime,
          currentTime: _currentTime,
        },
      };

      forecastData.value =
        (await worldDataService.getForecast?.(lat, lng)) || [];
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching location data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNewsForCountry = async (countryCode) => {
    if (!countryCode) {
      newsError.value = "No country code provided";
      return;
    }
    isNewsLoading.value = true;
    newsError.value = null;
    newsData.value = null;
    try {
      const articles = await worldDataService.getNewsForCountry(countryCode);
      newsData.value = articles;
    } catch (err) {
      newsError.value = err.message;
      console.error("Error fetching news:", err);
    } finally {
      isNewsLoading.value = false;
    }
  };

  const clearData = () => {
    locationData.value = null;
    forecastData.value = null;
    newsData.value = null;
    error.value = null;
    newsError.value = null;
  };

  const getTimeCalculationData = () => {
    if (!locationData.value?._internal) return null;
    return {
      sunrise: locationData.value._internal.sunrise,
      sunset: locationData.value._internal.sunset,
      currentTime: locationData.value._internal.currentTime,
      utcOffset: locationData.value.utcOffset,
    };
  };

  return {
    locationData: computed(() => locationData.value),
    forecastData: computed(() => forecastData.value),
    newsData: computed(() => newsData.value),
    isLoading: computed(() => isLoading.value),
    isNewsLoading: computed(() => isNewsLoading.value),
    error: computed(() => error.value),
    newsError: computed(() => newsError.value),
    hasLocationData,
    currentLocationName,
    fetchLocationData,
    fetchNewsForCountry,
    clearData,
    getTimeCalculationData,
  };
}
