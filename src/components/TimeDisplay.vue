<template>
  <div
    class="absolute top-4 right-4 w-[calc(100%-2rem)] max-w-sm p-5 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl text-slate-100 font-sans z-20"
  >
    <Transition name="panel-fade" mode="out-in">
      <div
        v-if="loading"
        key="loading"
        class="flex items-center justify-center h-56"
      >
        <LoaderCircle class="w-10 h-10 text-slate-400 animate-spin" />
      </div>
      <div
        v-else-if="error"
        key="error"
        class="flex flex-col items-center justify-center text-center h-56 space-y-2"
      >
        <AlertTriangle class="w-10 h-10 text-red-400" />
        <p class="font-bold text-lg">An Error Occurred</p>
        <p class="text-sm text-slate-300">{{ error }}</p>
      </div>

      <div v-else-if="data" key="data" class="flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <button
            @click="$emit('show-country-info')"
            title="View country facts"
            class="flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 rounded-md"
          >
            <img
              :src="data.flagUrl"
              :alt="data.locationName"
              class="w-10 h-auto rounded-md shadow-md"
            />
            <div>
              <p
                class="text-xl font-bold leading-tight transition-colors hover:text-slate-300"
              >
                {{ data.locationName }}
              </p>
              <div class="flex items-center space-x-2 text-sm text-slate-400">
                <span>{{ data.abbreviation }}</span
                ><span class="text-slate-600">•</span
                ><span>{{ data.utcOffset }}</span>
              </div>
            </div>
          </button>
          <div class="flex items-center space-x-1">
            <button
              @click="$emit('show-news')"
              class="p-2 -mt-1 text-slate-500 hover:text-blue-400 transition-colors"
              title="View Traveler's Headlines"
            >
              <Newspaper class="w-6 h-6" />
            </button>
            <button
              @click="$emit('toggle-favorite')"
              class="p-2 -mr-2 -mt-1 text-slate-500 hover:text-yellow-400 transition-colors"
              title="Toggle Favorite"
            >
              <Star
                :class="[
                  'w-6 h-6 transition-all',
                  { 'text-yellow-400 fill-current': isFavorite },
                ]"
              />
            </button>
          </div>
        </div>

        <Transition name="view-fade" mode="out-in">
          <div v-if="activeView === 'time'" key="time" class="space-y-4">
            <div class="flex items-center justify-between w-full">
              <button
                @click="activeView = 'weather'"
                class="flex flex-col items-center text-center focus:outline-none group"
                title="View detailed weather"
              >
                <component
                  :is="weatherIconComponent"
                  class="w-12 h-12 mb-1 group-hover:text-slate-300 transition-colors"
                />
                <p
                  class="text-xs capitalize group-hover:text-slate-300 transition-colors"
                >
                  {{ data.weatherDescription }}
                </p>
              </button>

              <button
                @click="activeView = 'timeTravel'"
                class="group p-2 -mt-1 text-right"
                title="Time Travel"
              >
                <div class="w-[120px] lg:w-[160px] flex flex-col items-end">
                  <p
                    class="text-5xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors whitespace-nowrap tabular-nums"
                  >
                    {{ currentTime }}
                  </p>

                  <p class="text-lg text-slate-300 whitespace-nowrap">
                    {{ currentDate }}
                  </p>
                  <p
                    class="text-sm text-yellow-400 font-semibold mt-1 whitespace-nowrap"
                  >
                    {{ data.timeDifference }}
                  </p>
                </div>
              </button>
            </div>

            <div
              class="grid grid-cols-2 gap-4 text-center border-t border-slate-700 pt-4"
            >
              <div>
                <p class="text-sm text-slate-400">Sunrise</p>
                <p class="text-xl font-semibold">{{ data.sunrise }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Sunset</p>
                <p class="text-xl font-semibold">{{ data.sunset }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="activeView === 'weather'" key="weather">
            <div
              class="flex items-center justify-between pb-2 mb-2 border-b border-slate-700"
            >
              <h3 class="font-bold text-lg">Detailed Weather</h3>
              <button
                @click="activeView = 'time'"
                class="p-2 -m-2 text-slate-400 hover:text-white"
                title="Back to time view"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div class="flex items-center">
                <Thermometer class="w-4 h-4 mr-2 text-slate-400" /><span
                  >Feels Like</span
                ><span class="ml-auto font-semibold"
                  >{{ data.feelsLike }}°C</span
                >
              </div>
              <div class="flex items-center">
                <Droplets class="w-4 h-4 mr-2 text-slate-400" /><span
                  >Humidity</span
                ><span class="ml-auto font-semibold">{{ data.humidity }}%</span>
              </div>
              <div class="flex items-center">
                <Wind class="w-4 h-4 mr-2 text-slate-400" /><span
                  >Wind Speed</span
                ><span class="ml-auto font-semibold"
                  >{{ data.windSpeed }} m/s</span
                >
              </div>
              <div class="flex items-center">
                <Gauge class="w-4 h-4 mr-2 text-slate-400" /><span
                  >Pressure</span
                ><span class="ml-auto font-semibold"
                  >{{ data.pressure }} hPa</span
                >
              </div>
            </div>
            <div
              v-if="forecast && forecast.length > 0"
              class="border-t border-slate-700 pt-4 mt-4"
            >
              <h3 class="font-bold text-lg mb-3">5-Day Forecast</h3>
              <div class="flex flex-col space-y-2">
                <div
                  v-for="day in forecast"
                  :key="day.date"
                  class="flex items-center justify-between text-sm p-1 bg-slate-800/50 rounded-md"
                >
                  <span class="font-semibold w-12 text-slate-300">{{
                    day.date.toLocaleDateString("en-US", { weekday: "short" })
                  }}</span>
                  <img :src="day.iconUrl" alt="weather icon" class="w-8 h-8" />
                  <div class="text-right w-16">
                    <span class="font-semibold text-slate-200"
                      >{{ day.maxTemp }}°</span
                    >
                    <span class="text-slate-400 ml-2">{{ day.minTemp }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeView === 'timeTravel'" key="timeTravel">
            <div
              class="flex items-center justify-between pb-2 mb-2 border-b border-slate-700"
            >
              <h3 class="font-bold text-lg">Time Converter</h3>
              <button
                @click="activeView = 'time'"
                class="p-2 -m-2 text-slate-400 hover:text-white"
                title="Back to live time"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="text-center py-4">
              <p class="text-xs text-slate-400">Their Time</p>
              <p class="text-6xl font-bold tracking-tight">
                {{ projectedRemoteTime }}
              </p>
              <p class="text-lg text-slate-300">{{ projectedRemoteDate }}</p>
            </div>

            <div class="space-y-2">
              <label
                for="local-time"
                class="block text-sm font-medium text-slate-300 mb-1 text-center"
                >Your Time</label
              >
              <input
                id="local-time"
                type="range"
                min="0"
                max="23.99"
                step="0.01"
                v-model="localTimeSlider"
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <p class="text-center font-mono text-lg text-slate-100">
                {{ localTimeDisplay }}
              </p>
            </div>
          </div>
        </Transition>

        <div
          v-if="data.currency"
          class="flex items-center justify-center space-x-3 border-t border-slate-700 pt-3 mt-4"
        >
          <CircleDollarSign class="w-5 h-5 text-slate-500 flex-shrink-0" />
          <div class="text-center">
            <p
              class="font-semibold text-sm text-slate-200"
              :title="data.currency.name"
            >
              {{ data.currency.code }} ({{ data.currency.symbol }})
            </p>
            <p class="text-xs text-slate-400 truncate">
              {{ data.currency.name }}
            </p>
          </div>
        </div>
      </div>

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

const activeView = ref("time");
const localTime = ref(null);
let clockInterval = null;
const localTimeSlider = ref(12);

const timeDifferenceHours = computed(() => {
  if (!props.data) return 0;
  const remoteOffset = parseFloat(props.data.utcOffset.replace("UTC", ""));
  const localOffset = parseFloat(
    (new Date().getTimezoneOffset() / -60).toString()
  );
  return remoteOffset - localOffset;
});

const projectedRemoteTime = computed(() => {
  if (!props.data) return "--:--";

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

const startClock = (initialDateTime) => {
  if (clockInterval) clearInterval(clockInterval);
  localTime.value = new Date(initialDateTime);
  clockInterval = setInterval(() => {
    localTime.value = new Date(localTime.value.getTime() + 1000);
  }, 1000);
};

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
