<template>
  <main class="relative h-full w-full">
    <SideMenu
      :recents="recents"
      :favorites="favorites"
      :is-loading="isRecentsLoading || isFavoritesLoading"
      @location-click="handleLocationClick"
    />

    <MapComponent
      :theme="currentMapTheme"
      :is-transitioning="isMapTransitioning"
      @map-click="handleMapClick"
    />

    <TimeDisplay
      :data="locationData"
      :forecast="forecastData"
      :loading="isLocationLoading"
      :error="locationError"
      :is-favorite="isCurrentLocationFavorite"
      @toggle-favorite="handleToggleFavorite"
      @show-news="handleShowNews"
      @show-country-info="handleShowCountryInfo"
      @time-change="handleTimeChange"
    />

    <NewsModal
      v-if="isNewsModalVisible"
      :news="newsData"
      :loading="isNewsLoading"
      :error="newsError"
      :country-name="locationData?.country || 'this country'"
      @close="closeNewsModal"
    />

    <CountryModal
      v-if="isCountryModalVisible && locationData"
      :data="locationData"
      @close="closeCountryModal"
    />
  </main>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";

import { useWorldTime } from "@/composables/useWorldTime";
import { useFavorites } from "@/composables/useFavorites";
import { useRecentLocations } from "@/composables/useRecentLocations";
import { useMapTheme } from "@/composables/useMapTheme";

import SideMenu from "@/components/SideMenu.vue";
import MapComponent from "@/components/MapComponent.vue";
import TimeDisplay from "@/components/TimeDisplay.vue";
import NewsModal from "@/components/NewsModal.vue";
import CountryModal from "@/components/CountryModal.vue";

import { API_LIMITS } from "@/constants/api";

const {
  locationData,
  forecastData,
  newsData,
  isLoading: isLocationLoading,
  isNewsLoading,
  error: locationError,
  newsError,
  fetchLocationData,
  fetchNewsForCountry,
  getTimeCalculationData,
} = useWorldTime();

const {
  favorites,
  isLoading: isFavoritesLoading,
  toggleFavorite,
  isFavorite,
} = useFavorites();

const {
  recents,
  isLoading: isRecentsLoading,
  addRecent,
} = useRecentLocations();

const {
  currentTheme: currentMapTheme,
  isTransitioning: isMapTransitioning,
  updateThemeFromLocation,
  updateThemeFromProjectedTime,
} = useMapTheme();

const isNewsModalVisible = ref(false);
const isCountryModalVisible = ref(false);
const lastClickedCoords = ref(null);
let debounceTimer = null;

const isCurrentLocationFavorite = computed(() => {
  return locationData.value ? isFavorite(locationData.value) : false;
});

const handleMapClick = ({ lat, lng }) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    lastClickedCoords.value = { lat, lng };
    fetchLocationData(lat, lng);
  }, API_LIMITS.DEBOUNCE_DELAY);
};

const handleLocationClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};

const handleToggleFavorite = () => {
  if (!locationData.value || !lastClickedCoords.value) return;

  const locationWithCoords = {
    ...locationData.value,
    ...lastClickedCoords.value,
  };

  toggleFavorite(locationWithCoords);
};

const handleShowNews = () => {
  if (!locationData.value?.countryCode) return;

  isNewsModalVisible.value = true;
  fetchNewsForCountry(locationData.value.countryCode);
};

const handleShowCountryInfo = () => {
  if (!locationData.value) return;
  isCountryModalVisible.value = true;
};

const handleTimeChange = (projectedTime) => {
  const timeData = getTimeCalculationData();
  if (!timeData) return;

  updateThemeFromProjectedTime(projectedTime, { _internal: timeData });
};

const closeNewsModal = () => {
  isNewsModalVisible.value = false;
};

const closeCountryModal = () => {
  isCountryModalVisible.value = false;
};

watch(
  locationData,
  (newData) => {
    if (!newData || !lastClickedCoords.value) return;

    updateThemeFromLocation(newData);

    const locationWithCoords = {
      ...newData,
      ...lastClickedCoords.value,
    };
    addRecent(locationWithCoords);
  },
  { immediate: false }
);

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<style scoped></style>
