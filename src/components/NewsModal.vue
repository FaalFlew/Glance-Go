<template>
  <Transition name="modal-fade">
    <div
      class="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="w-full max-w-lg mx-4 p-5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl"
      >
        <div
          class="flex items-center justify-between pb-3 mb-3 border-b border-slate-600"
        >
          <h2 class="text-xl font-bold">
            Traveler's Headlines for {{ countryName }}
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 -m-2 text-slate-400 hover:text-white"
            title="Close"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto pr-2">
          <Transition name="panel-fade" mode="out-in">
            <div
              v-if="loading"
              key="loading"
              class="flex items-center justify-center h-48"
            >
              <LoaderCircle class="w-10 h-10 text-slate-400 animate-spin" />
            </div>
            <div
              v-else-if="error"
              key="error"
              class="text-center h-48 flex flex-col justify-center"
            >
              <AlertTriangle class="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p class="font-bold">Could not fetch news</p>
              <p class="text-sm text-slate-300">{{ error }}</p>
            </div>
            <div
              v-else-if="news && news.length > 0"
              key="news"
              class="flex flex-col space-y-4"
            >
              <a
                v-for="(article, index) in news"
                :key="index"
                :href="article.url"
                target="_blank"
                rel="noopener noreferrer"
                class="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <p class="font-bold text-slate-100 leading-tight">
                  {{ article.title }}
                </p>
                <p class="text-xs text-slate-400 mt-1">
                  {{ article.source.name }} -
                  {{ formatTimeAgo(article.publishedAt) }}
                </p>
              </a>
            </div>
            <div
              v-else
              key="no-news"
              class="text-center h-48 flex flex-col justify-center"
            >
              <Newspaper class="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p class="font-bold">No recent travel news found</p>
              <p class="text-sm text-slate-300">Try another location.</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X, LoaderCircle, AlertTriangle, Newspaper } from "lucide-vue-next";

defineProps({
  news: { type: Array, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  countryName: { type: String, default: "this country" },
});

defineEmits(["close"]);

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
