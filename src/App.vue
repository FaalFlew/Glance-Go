<template>
  <div class="h-screen w-screen">
    <SideMenu
      :recents="recents"
      :is-loading="isRecentsLoading"
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

const { locationData, forecastData, isLoading, error, fetchLocationData } =
  useWorldTime();
const currentMapTheme = ref("night");
const lastClickedCoords = ref(null);
const handleMapClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};

const {
  recents,
  isLoading: isRecentsLoading,
  addRecent,
} = useRecentLocations();

const handleLocationClick = ({ lat, lng }) => {
  lastClickedCoords.value = { lat, lng };
  fetchLocationData(lat, lng);
};
watch(locationData, (newData) => {
  if (newData) {
    currentMapTheme.value = newData.isDay ? "day" : "night";
  }
});
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #1e293b;
}
</style>
