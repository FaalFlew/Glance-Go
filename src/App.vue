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

const { locationData, forecastData, isLoading, error, fetchLocationData } =
  useWorldTime();
const currentMapTheme = ref("night");
const lastClickedCoords = ref(null);
const handleMapClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};

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
