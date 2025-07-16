import { STORAGE_KEYS } from "@/constants/api";

class StorageService {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
      return false;
    }
  }

  getFavorites() {
    return this.get(STORAGE_KEYS.FAVORITES, []);
  }

  setFavorites(favorites) {
    return this.set(STORAGE_KEYS.FAVORITES, favorites);
  }

  getRecents() {
    return this.get(STORAGE_KEYS.RECENTS, []);
  }

  setRecents(recents) {
    return this.set(STORAGE_KEYS.RECENTS, recents);
  }
}

export default new StorageService();
