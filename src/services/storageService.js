/**
 * Storage service for managing local storage operations
 * Implements the repository pattern for data persistence
 */

import { STORAGE_KEYS } from "@/constants/api";

class StorageService {
  /**
   * Get data from localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed data or default value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Set data in localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all app-related storage
   * @returns {boolean} Success status
   */
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

  /**
   * Get favorites from storage
   * @returns {Array} Array of favorite locations
   */
  getFavorites() {
    return this.get(STORAGE_KEYS.FAVORITES, []);
  }

  /**
   * Save favorites to storage
   * @param {Array} favorites - Array of favorite locations
   * @returns {boolean} Success status
   */
  setFavorites(favorites) {
    return this.set(STORAGE_KEYS.FAVORITES, favorites);
  }

  /**
   * Get recent locations from storage
   * @returns {Array} Array of recent locations
   */
  getRecents() {
    return this.get(STORAGE_KEYS.RECENTS, []);
  }

  /**
   * Save recent locations to storage
   * @param {Array} recents - Array of recent locations
   * @returns {boolean} Success status
   */
  setRecents(recents) {
    return this.set(STORAGE_KEYS.RECENTS, recents);
  }
}

export default new StorageService();
