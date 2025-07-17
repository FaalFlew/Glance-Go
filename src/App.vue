<template>
  <div class="h-screen w-screen">
    <MapComponent
      :theme="currentMapTheme"
      :is-transitioning="isMapTransitioning"
      @map-click="handleMapClick"
    />

    <TimeDisplay
      :data="locationData"
      :loading="isLocationLoading"
      :error="locationError"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MapComponent from "@/components/MapComponent.vue";
import TimeDisplay from "@/components/TimeDisplay.vue";

const theme = ref("night");

const handleMapClick = ({ lat, lng }) => {};
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #1e293b;
}
</style>
