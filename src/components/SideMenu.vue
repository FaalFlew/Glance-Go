<template>
  <Transition name="menu-fade">
    <div
      v-if="recents.length > 0 || favorites.length > 0"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-60 max-h-[60vh] flex flex-col p-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl text-slate-100 font-sans z-20"
    >
      <div class="flex border-b border-slate-700 mb-2">
        <button
          @click="activeTab = 'recents'"
          :class="[
            'flex-1 p-2 text-sm font-bold transition-colors',
            activeTab === 'recents'
              ? 'text-white'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          Recents
        </button>
        <button
          @click="activeTab = 'favorites'"
          :class="[
            'flex-1 p-2 text-sm font-bold transition-colors',
            activeTab === 'favorites'
              ? 'text-white'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          Favorites
        </button>
      </div>

      <div
        class="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-1"
      >
        <ul>
          <li v-for="item in activeList" :key="item.locationName">
            <button
              @click="$emit('location-click', { lat: item.lat, lng: item.lng })"
              class="w-full text-left p-2 rounded-md hover:bg-slate-700/50 focus:outline-none focus:bg-slate-700 transition-colors"
            >
              <span class="block font-semibold text-slate-200 truncate">{{
                item.locationName
              }}</span>
              <span class="block text-xs text-slate-400">{{
                item.timezone
              }}</span>
            </button>
          </li>
        </ul>
        <p
          v-if="activeList.length === 0"
          class="text-center text-xs text-slate-400 p-4"
        >
          {{
            activeTab === "recents"
              ? "No recent locations."
              : "No favorite locations yet."
          }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  recents: { type: Array, required: true },
  favorites: { type: Array, required: true },
});

defineEmits(["location-click"]);

const activeTab = ref("recents");

watch(
  () => props.recents,
  (newRecents) => {
    if (newRecents.length === 0 && props.favorites.length > 0) {
      activeTab.value = "favorites";
    }
  }
);

const activeList = computed(() => {
  return activeTab.value === "recents" ? props.recents : props.favorites;
});
</script>

<style>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px) translateY(-50%);
}
.menu-fade-enter-to,
.menu-fade-leave-to {
  transform: translateX(0) translateY(-50%);
}
</style>
