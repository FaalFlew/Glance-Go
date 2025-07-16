export const MAP_THEMES = {
  NIGHT: {
    name: "night",
    tileUrl:
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution:
      '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  DAY: {
    name: "day",
    tileUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  },
};

export const MAP_CONFIG = {
  DEFAULT_CENTER: [20, 10],
  DEFAULT_ZOOM: 3,
  MAX_ZOOM: 20,
  ZOOM_CONTROL_POSITION: "bottomright",
  TRANSITION_DURATION: 800,
};
