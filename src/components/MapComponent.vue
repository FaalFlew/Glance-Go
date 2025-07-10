<template>
  <div
    id="map-container"
    ref="mapContainer"
    class="h-full w-full bg-slate-800"
  ></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, markRaw, watch } from "vue";
import L from "leaflet";

const TILE_URLS = {
  night:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  day: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
};

const ATTRIBUTIONS = {
  night:
    '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  day: "Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
};

const props = defineProps({
  theme: {
    type: String,
    required: true,
    default: "night",
  },
});

const emit = defineEmits(["map-click"]);

const mapContainer = ref(null);
let map = null;
let marker = null;
let lightLayer = null;
let darkLayer = null;

onMounted(() => {
  if (map || !mapContainer.value) return;

  map = markRaw(
    L.map(mapContainer.value, { zoomControl: false }).setView([20, 10], 3)
  );
  L.control.zoom({ position: "bottomright" }).addTo(map);

  lightLayer = L.tileLayer(TILE_URLS.day, {
    maxZoom: 20,
    attribution: ATTRIBUTIONS.day,
  });
  darkLayer = L.tileLayer(TILE_URLS.night, {
    maxZoom: 20,
    attribution: ATTRIBUTIONS.night,
  });

  darkLayer.addTo(map);
  lightLayer.addTo(map);
  lightLayer.setOpacity(0);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng.wrap();
    emit("map-click", { lat, lng });
    map.flyTo(e.latlng, map.getZoom());
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
  });
});

watch(
  () => props.theme,
  (newTheme) => {
    if (!lightLayer || !darkLayer) return;

    if (newTheme === "day") {
      lightLayer.setOpacity(1);
    } else {
      lightLayer.setOpacity(0);
    }
  }
);

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style>
.leaflet-pane .leaflet-tile-pane {
  transition: opacity 0.8s ease-in-out !important;
}

#map-container {
  z-index: 10;
}
.leaflet-control-attribution a {
  color: #555;
}
</style>
