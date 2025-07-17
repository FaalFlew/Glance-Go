<template>
  <div
    class="absolute top-4 right-4 w-[calc(100%-2rem)] max-w-sm p-5 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl text-slate-100 font-sans z-20"
  >
    <Transition name="panel-fade" mode="out-in">
      <!-- Loading State -->
      <div
        v-if="loading"
        key="loading"
        class="flex items-center justify-center h-56"
      >
        <LoaderCircle class="w-10 h-10 text-slate-400 animate-spin" />
      </div>
      <!-- Error State -->
      <div
        v-else-if="error"
        key="error"
        class="flex flex-col items-center justify-center text-center h-56 space-y-2"
      >
        <AlertTriangle class="w-10 h-10 text-red-400" />
        <p class="font-bold text-lg">An Error Occurred</p>
        <p class="text-sm text-slate-300">{{ error }}</p>
      </div>

      <!-- Initial State -->
      <div
        v-else
        key="initial"
        class="flex flex-col items-center justify-center text-center h-56 space-y-2"
      >
        <Globe class="w-10 h-10 text-slate-400" />
        <p class="font-bold text-lg">Welcome to World Time</p>
        <p class="text-sm text-slate-300">
          Click anywhere on the map to begin.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import {
  Hourglass,
  CircleDollarSign,
  Star,
  Globe,
  LoaderCircle,
  AlertTriangle,
  Sun,
  Moon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  X,
  Newspaper,
} from "lucide-vue-next";

// --- 1. PROPS & EMITS ---
const props = defineProps({
  data: { type: Object, default: null },
  forecast: { type: Array, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  isFavorite: { type: Boolean, default: false },
});

const emit = defineEmits([
  "toggle-favorite",
  "show-news",
  "show-country-info",
  "time-change",
]);

// --- 2. COMPONENT STATE ---
const activeView = ref("time");
const localTime = ref(null);
let clockInterval = null;
const localTimeSlider = ref(12);

// --- 3. COMPUTED PROPERTIES (THE DEFINITIVE FIX IS HERE) ---

const timeDifferenceHours = computed(() => {
  if (!props.data) return 0;
  const remoteOffset = parseFloat(props.data.utcOffset.replace("UTC", ""));
  const localOffset = parseFloat(
    (new Date().getTimezoneOffset() / -60).toString()
  );
  return remoteOffset - localOffset;
});

// This is where the main fix is applied.
const projectedRemoteTime = computed(() => {
  if (!props.data) return "--:--";

  // Use parseFloat() to ensure all values are numbers before addition.
  const sliderValue = parseFloat(localTimeSlider.value);
  const difference = parseFloat(timeDifferenceHours.value);

  let remoteHours = sliderValue + difference;

  if (remoteHours >= 24) {
    remoteHours -= 24;
  } else if (remoteHours < 0) {
    remoteHours += 24;
  }

  const hours = Math.floor(remoteHours).toString().padStart(2, "0");
  const minutes = Math.round((remoteHours - Math.floor(remoteHours)) * 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}`;
});

const projectedRemoteDateObj = computed(() => {
  const sliderValue = parseFloat(localTimeSlider.value);
  const difference = parseFloat(timeDifferenceHours.value);
  let remoteHours = sliderValue + difference;

  const now = new Date();
  let dayOffset = 0;

  if (remoteHours >= 24) {
    remoteHours -= 24;
    dayOffset = 1;
  } else if (remoteHours < 0) {
    remoteHours += 24;
    dayOffset = -1;
  }

  const hours = Math.floor(remoteHours);
  const minutes = Math.round((remoteHours - hours) * 60);

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayOffset,
    hours,
    minutes
  );
});

const projectedRemoteDate = computed(() => {
  if (!props.data) return "";
  return projectedRemoteDateObj.value.toLocaleDateString("en-US", {
    weekday: "long",
  });
});

const localTimeDisplay = computed(() => {
  const hours = Math.floor(localTimeSlider.value).toString().padStart(2, "0");
  const minutes = Math.round(
    (localTimeSlider.value - Math.floor(localTimeSlider.value)) * 60
  )
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
});

// Other computed properties are unchanged
const currentTime = computed(() => {
  if (!localTime.value) return "--:--:--";
  return localTime.value.toLocaleTimeString("en-GB");
});
const currentDate = computed(() => {
  if (!localTime.value) return "";
  return localTime.value.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
});
const weatherIconComponent = computed(() => {
  if (!props.data?.weatherIcon) return Thermometer;
  const iconCode = props.data.weatherIcon.slice(0, 2);
  switch (iconCode) {
    case "01":
      return props.data.isDay ? Sun : Moon;
    case "02":
      return Cloud;
    case "03":
    case "04":
      return CloudDrizzle;
    case "09":
    case "10":
      return CloudRain;
    case "11":
      return Wind;
    case "13":
      return CloudSnow;
    case "50":
      return Wind;
    default:
      return Thermometer;
  }
});

// --- 4. FUNCTIONS ---
const startClock = (initialDateTime) => {
  if (clockInterval) clearInterval(clockInterval);
  localTime.value = new Date(initialDateTime);
  clockInterval = setInterval(() => {
    localTime.value = new Date(localTime.value.getTime() + 1000);
  }, 1000);
};

// --- 5. WATCHERS & LIFECYCLE HOOKS ---
watch(localTimeSlider, () => {
  if (!props.data) return;
  emit("time-change", projectedRemoteDateObj.value);
});

watch(
  () => props.data,
  (newData) => {
    activeView.value = "time";
    if (newData?.datetime) {
      startClock(newData.datetime);
      const now = new Date();
      localTimeSlider.value = now.getHours() + now.getMinutes() / 60;
    } else {
      if (clockInterval) clearInterval(clockInterval);
      localTime.value = null;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});
</script>
