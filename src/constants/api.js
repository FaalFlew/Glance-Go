export const API_ENDPOINTS = {
  NOMINATIM: "https://nominatim.openstreetmap.org/reverse",
  SUNRISE_SUNSET: "https://api.open-meteo.com/v1/forecast",
  TIMEZONE_DB: "https://api.timezonedb.com/v2.1/get-time-zone",
  OPENWEATHER_CURRENT: "https://api.openweathermap.org/data/2.5/weather",
  OPENWEATHER_FORECAST: "https://api.openweathermap.org/data/2.5/forecast",
  GNEWS: "https://gnews.io/api/v4/top-headlines",
  REST_COUNTRIES: "https://restcountries.com/v3.1/alpha",
  FLAGS: "https://flagcdn.com/w40",
  WEATHER_ICONS: "https://openweathermap.org/img/wn",
};

export const API_KEYS = {
  TIMEZONE_DB: import.meta.env.VITE_TIMEZONEDB_API_KEY,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  GNEWS: import.meta.env.VITE_GNEWS_API_TOKEN,
};

export const API_LIMITS = {
  NEWS_MAX_ARTICLES: 5,
  FORECAST_DAYS: 5,
  REQUEST_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 300,
};

export const STORAGE_KEYS = {
  FAVORITES: "world_time_favorites",
  RECENTS: "world_time_recents",
};
