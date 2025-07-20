<template>
  <div class="flex items-start space-x-3">
    <component :is="icon" class="w-5 h-5 mt-0.5 text-slate-500 flex-shrink-0" />
    <div>
      <p class="text-xs text-slate-400">{{ label }}</p>
      <p class="font-bold text-base text-slate-100">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: Object, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
});
</script>
