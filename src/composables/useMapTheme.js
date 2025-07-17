import { ref, computed } from "vue";
import { isDayTime } from "@/utils/time";

export function useMapTheme() {
  const currentTheme = ref("night");
  const isTransitioning = ref(false);

  const isDayTheme = computed(() => currentTheme.value === "day");
  const isNightTheme = computed(() => currentTheme.value === "night");

  const updateThemeFromLocation = (locationData) => {
    if (!locationData?._internal) return;

    const { sunrise, sunset, currentTime } = locationData._internal;

    const isDay = isDayTime(currentTime, sunrise, sunset);

    const newTheme = isDay ? "day" : "night";

    if (newTheme !== currentTheme.value) {
      setTheme(newTheme);
    }
  };

  const updateThemeFromProjectedTime = (projectedTime, locationData) => {
    if (!locationData?._internal || !projectedTime) return;

    const { sunrise, sunset } = locationData._internal;

    const adjustedSunrise = new Date(sunrise);
    const adjustedSunset = new Date(sunset);

    adjustedSunrise.setFullYear(
      projectedTime.getFullYear(),
      projectedTime.getMonth(),
      projectedTime.getDate()
    );
    adjustedSunset.setFullYear(
      projectedTime.getFullYear(),
      projectedTime.getMonth(),
      projectedTime.getDate()
    );

    const newTheme = isDayTime(projectedTime, adjustedSunrise, adjustedSunset)
      ? "day"
      : "night";
    setTheme(newTheme);
  };

  const setTheme = (theme) => {
    if (theme === currentTheme.value) return;

    isTransitioning.value = true;
    currentTheme.value = theme;

    setTimeout(() => {
      isTransitioning.value = false;
    }, 1000);
  };

  const resetTheme = () => {
    setTheme("night");
  };

  return {
    currentTheme: computed(() => currentTheme.value),
    isTransitioning: computed(() => isTransitioning.value),

    isDayTheme,
    isNightTheme,

    updateThemeFromLocation,
    updateThemeFromProjectedTime,
    setTheme,
    resetTheme,
  };
}
