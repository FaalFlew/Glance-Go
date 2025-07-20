<template>
  <div class="h-screen w-screen">
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
      :loading="isLoading"
      :error="error"
      :is-favorite="isCurrentLocationFavorite"
      @toggle-favorite="handleToggleFavorite"
      @show-country-info="handleShowCountryInfo"
      @show-news="handleShowNews"
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
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import MapComponent from "@/components/MapComponent.vue";
import TimeDisplay from "@/components/TimeDisplay.vue";
import { useWorldTime } from "./composables/useWorldTime.js";
import SideMenu from "@/components/SideMenu.vue";
import { useRecentLocations } from "@/composables/useRecentLocations";
import { useFavorites } from "@/composables/useFavorites";
import CountryModal from "@/components/CountryModal.vue";
import { API_LIMITS } from "@/constants/api";
import NewsModal from "@/components/NewsModal.vue";

const currentMapTheme = ref("night");
const lastClickedCoords = ref(null);
const isCountryModalVisible = ref(false);
const isNewsModalVisible = ref(false);

const handleMapClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};

const {
  locationData,
  forecastData,
  newsData,
  isNewsLoading,
  newsError,
  fetchLocationData,
  fetchNewsForCountry,
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

const isCurrentLocationFavorite = computed(() => {
  return locationData.value ? isFavorite(locationData.value) : false;
});

const handleLocationClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};

watch(locationData, (newData) => {
  if (newData) {
    currentMapTheme.value = newData.isDay ? "day" : "night";
  }
});
const handleToggleFavorite = () => {
  if (!locationData.value || !lastClickedCoords.value) return;

  const locationWithCoords = {
    ...locationData.value,
    ...lastClickedCoords.value,
  };

  toggleFavorite(locationWithCoords);
};
const handleShowCountryInfo = () => {
  if (!locationData.value) return;
  isCountryModalVisible.value = true;
};
const handleShowNews = () => {
  if (!locationData.value?.countryCode) return;

  isNewsModalVisible.value = true;
  fetchNewsForCountry(locationData.value.countryCode);
};
const closeCountryModal = () => {
  isCountryModalVisible.value = false;
};
const closeNewsModal = () => {
  isNewsModalVisible.value = false;
};
watch(
  locationData,
  (newData) => {
    if (!newData || !lastClickedCoords.value) return;

    const locationWithCoords = {
      ...newData,
      ...lastClickedCoords.value,
    };
    addRecent(locationWithCoords);
  },
  { immediate: false }
);
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #1e293b;
}
</style>
