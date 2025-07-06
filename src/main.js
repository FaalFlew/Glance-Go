import { createApp } from "vue";

// Import Leaflet's CSS directly for reliability
import "leaflet/dist/leaflet.css";

// Import our global styles
import "./style.css";

import App from "./App.vue";

createApp(App).mount("#app");
