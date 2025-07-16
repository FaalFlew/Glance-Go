import { ref, computed, onMounted } from "vue";
import storageService from "@/services/storageService";

const MAX_RECENTS = 10;

export function useRecentLocations() {
  const recents = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const recentsCount = computed(() => recents.value.length);
  const hasRecents = computed(() => recents.value.length > 0);

  onMounted(() => {
    loadRecents();
  });

  const loadRecents = () => {
    try {
      isLoading.value = true;
      const storedRecents = storageService.getRecents();
      recents.value = Array.isArray(storedRecents) ? storedRecents : [];
      error.value = null;
    } catch (err) {
      console.error("Error loading recent locations:", err);
      error.value = "Failed to load recent locations";
      recents.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const saveRecents = () => {
    try {
      const success = storageService.setRecents(recents.value);
      if (!success) {
        throw new Error("Failed to save to storage");
      }
      error.value = null;
    } catch (err) {
      console.error("Error saving recent locations:", err);
      error.value = "Failed to save recent locations";
    }
  };

  const addRecent = (location) => {
    if (!location?.locationName) {
      error.value = "Invalid location data";
      return;
    }

    if (
      recents.value.length > 0 &&
      recents.value[0].locationName === location.locationName
    ) {
      return;
    }

    const recentLocation = {
      locationName: location.locationName,
      timezone: location.timezone || "Unknown",
      lat: location.lat,
      lng: location.lng,
      country: location.country || "",
      visitedAt: new Date().toISOString(),
    };

    recents.value = recents.value.filter(
      (recent) => recent.locationName !== location.locationName
    );

    recents.value.unshift(recentLocation);

    if (recents.value.length > MAX_RECENTS) {
      recents.value = recents.value.slice(0, MAX_RECENTS);
    }

    saveRecents();
  };

  const removeRecent = (location) => {
    if (!location?.locationName) {
      error.value = "Invalid location data";
      return false;
    }

    const initialLength = recents.value.length;
    recents.value = recents.value.filter(
      (recent) => recent.locationName !== location.locationName
    );

    if (recents.value.length === initialLength) {
      error.value = "Location not found in recent locations";
      return false;
    }

    saveRecents();
    return true;
  };

  const clearAllRecents = () => {
    recents.value = [];
    saveRecents();
  };

  const getRecentByName = (locationName) => {
    return (
      recents.value.find((recent) => recent.locationName === locationName) ||
      null
    );
  };

  const isRecent = (location) => {
    if (!location?.locationName) return false;
    return recents.value.some(
      (recent) => recent.locationName === location.locationName
    );
  };

  return {
    recents: computed(() => recents.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    recentsCount,
    hasRecents,

    addRecent,
    removeRecent,
    clearAllRecents,
    getRecentByName,
    isRecent,
    loadRecents,
  };
}
