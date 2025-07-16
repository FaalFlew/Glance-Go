import { ref, computed, onMounted } from "vue";
import storageService from "@/services/storageService";

const MAX_FAVORITES = 20;

export function useFavorites() {
  const favorites = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const favoritesCount = computed(() => favorites.value.length);
  const hasFavorites = computed(() => favorites.value.length > 0);
  const isFull = computed(() => favorites.value.length >= MAX_FAVORITES);

  onMounted(() => {
    loadFavorites();
  });

  const loadFavorites = () => {
    try {
      isLoading.value = true;
      const storedFavorites = storageService.getFavorites();
      favorites.value = Array.isArray(storedFavorites) ? storedFavorites : [];
      error.value = null;
    } catch (err) {
      console.error("Error loading favorites:", err);
      error.value = "Failed to load favorites";
      favorites.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const saveFavorites = () => {
    try {
      const success = storageService.setFavorites(favorites.value);
      if (!success) {
        throw new Error("Failed to save to storage");
      }
      error.value = null;
    } catch (err) {
      console.error("Error saving favorites:", err);
      error.value = "Failed to save favorites";
    }
  };

  const isFavorite = (location) => {
    if (!location?.locationName) return false;
    return favorites.value.some(
      (fav) => fav.locationName === location.locationName
    );
  };

  const addFavorite = (location) => {
    if (!location?.locationName) {
      error.value = "Invalid location data";
      return false;
    }

    if (isFavorite(location)) {
      error.value = "Location is already in favorites";
      return false;
    }

    if (isFull.value) {
      error.value = `Cannot add more than ${MAX_FAVORITES} favorites`;
      return false;
    }

    const favoriteLocation = {
      locationName: location.locationName,
      timezone: location.timezone || "Unknown",
      lat: location.lat,
      lng: location.lng,
      country: location.country || "",
      addedAt: new Date().toISOString(),
    };

    favorites.value.unshift(favoriteLocation);
    saveFavorites();
    return true;
  };

  const removeFavorite = (location) => {
    if (!location?.locationName) {
      error.value = "Invalid location data";
      return false;
    }

    const initialLength = favorites.value.length;
    favorites.value = favorites.value.filter(
      (fav) => fav.locationName !== location.locationName
    );

    if (favorites.value.length === initialLength) {
      error.value = "Location not found in favorites";
      return false;
    }

    saveFavorites();
    return true;
  };

  const toggleFavorite = (location) => {
    if (isFavorite(location)) {
      removeFavorite(location);
      return false;
    } else {
      addFavorite(location);
      return true;
    }
  };

  const clearAllFavorites = () => {
    favorites.value = [];
    saveFavorites();
  };

  const getFavoriteByName = (locationName) => {
    return (
      favorites.value.find((fav) => fav.locationName === locationName) || null
    );
  };

  return {
    favorites: computed(() => favorites.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    favoritesCount,
    hasFavorites,
    isFull,

    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    getFavoriteByName,
    loadFavorites,
  };
}
