export function validateCoordinates(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function validateApiResponse(response) {
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}

export function validateApiKeys(keys) {
  const missing = [];

  Object.entries(keys).forEach(([name, value]) => {
    if (!value || value.trim() === "") {
      missing.push(name);
    }
  });

  return missing;
}

export function sanitizeLocationName(name) {
  if (!name || typeof name !== "string") {
    return "Unknown Location";
  }

  return name.trim().replace(/\s+/g, " ");
}
