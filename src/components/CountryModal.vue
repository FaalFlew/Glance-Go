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
          <div class="flex items-center space-x-3">
            <img
              :src="data.flagUrl"
              :alt="data.country"
              class="w-10 h-auto rounded-md shadow-md"
            />
            <h2 class="text-2xl font-bold">{{ data.country }}</h2>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 -m-2 text-slate-400 hover:text-white"
            title="Close"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto pr-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <FactItem
              :icon="Building"
              label="Capital City"
              :value="data.facts.capital"
            />
            <FactItem
              :icon="Globe"
              label="Region"
              :value="`${data.facts.subregion}, ${data.facts.region}`"
            />
            <FactItem
              :icon="Users"
              label="Population"
              :value="data.facts.population.toLocaleString('en-US')"
            />
            <FactItem
              :icon="Languages"
              label="Languages"
              :value="data.facts.languages"
            />
            <FactItem
              :icon="Phone"
              label="Calling Code"
              :value="data.facts.callingCode"
            />
            <FactItem
              :icon="Car"
              label="Driving Side"
              :value="data.facts.drivingSide"
              class="capitalize"
            />
            <FactItem
              :icon="AtSign"
              label="Internet TLD"
              :value="data.facts.tld"
            />
            <FactItem
              :icon="Smile"
              label="Demonym"
              :value="data.facts.demonym"
            />
            <FactItem
              :icon="RectangleHorizontal"
              label="Vehicle Sign"
              :value="data.facts.vehicleSign"
            />
            <FactItem
              :icon="CircleDollarSign"
              label="Currency"
              :value="`${data.facts.currency.code} ${data.facts.currency.symbol}`"
            />
          </div>

          <div class="mt-4 pt-4 border-t border-slate-600">
            <h3 class="text-lg font-semibold mb-3 text-slate-300">
              Power & Sockets
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm"
            >
              <FactItem
                :icon="Zap"
                label="Voltage"
                :value="data.facts.power.voltage"
              />
              <FactItem
                :icon="Waves"
                label="Frequency"
                :value="data.facts.power.frequency"
              />
              <div class="sm:col-span-2">
                <FactItem
                  :icon="Plug"
                  label="Common Plug Types"
                  :value="data.facts.power.plugs.join(', ')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  X,
  CircleDollarSign,
  Building,
  Globe,
  Users,
  Languages,
  Phone,
  Car,
  AtSign,
  Smile,
  RectangleHorizontal,
  Zap,
  Waves,
  Plug,
} from "lucide-vue-next";
import FactItem from "./FactItem.vue";

defineProps({
  data: { type: Object, required: true },
});

defineEmits(["close"]);
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
