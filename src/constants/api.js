export const API_ENDPOINTS = {
  NOMINATIM: "https://nominatim.openstreetmap.org/reverse",
  TIMEZONE_DB: "https://api.timezonedb.com/v2.1/get-time-zone",
  SUNRISE_SUNSET: "https://api.open-meteo.com/v1/forecast",
  OPENWEATHER_CURRENT: "https://api.openweathermap.org/data/2.5/weather",
  OPENWEATHER_FORECAST: "https://api.openweathermap.org/data/2.5/forecast",
  REST_COUNTRIES: "https://restcountries.com/v3.1/alpha",
};

export const API_KEYS = {
  TIMEZONE_DB: import.meta.env.VITE_TIMEZONEDB_API_KEY,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
};

export const API_LIMITS = {
  FORECAST_DAYS: 5,
  REQUEST_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 300,
};
