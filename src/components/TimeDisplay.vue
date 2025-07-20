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

      <div v-else-if="data" key="data" class="flex flex-col space-y-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <img
              :src="data.flagUrl"
              :alt="data.locationName"
              class="w-10 h-auto rounded-md shadow-md"
            />
            <div>
              <p class="text-xl font-bold leading-tight">
                {{ data.locationName }}
              </p>
              <div class="flex items-center space-x-2 text-sm text-slate-400">
                <span>{{ data.abbreviation }}</span
                ><span class="text-slate-600">•</span
                ><span>{{ data.utcOffset }}</span>
              </div>
            </div>
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
          <!-- Time View -->
          <div v-if="activeView === 'time'" key="time">
            <!-- Current Time and Weather Icon (Unchanged) -->
            <div class="flex items-center space-x-4">
              <div class="flex-1 text-right">
                <p class="text-6xl font-bold tracking-tight">
                  {{ currentTime }}
                </p>
                <p class="text-lg text-slate-300">{{ currentDate }}</p>
                <p class="text-sm text-yellow-400 font-semibold mt-1">
                  {{ data.timeDifference }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
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
import { Star } from "lucide-vue-next";

const props = defineProps({
  data: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  isFavorite: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle-favorite"]);

const activeView = ref("time");
const localTime = ref(null);
let clockInterval = null;

watch(
  () => props.data,
  () => {
    activeView.value = "time";
  }
);

const startClock = (initialDateTime) => {
  if (clockInterval) clearInterval(clockInterval);
  localTime.value = new Date(initialDateTime);
  clockInterval = setInterval(() => {
    localTime.value = new Date(localTime.value.getTime() + 1000);
  }, 1000);
};

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

watch(
  () => props.data,
  (newData) => {
    if (newData?.datetime) {
      startClock(newData.datetime);
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
