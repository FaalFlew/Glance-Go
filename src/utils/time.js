export function formatTimeDifference(remoteOffsetHours, localOffsetHours) {
  const differenceHours = remoteOffsetHours - localOffsetHours;

  if (differenceHours === 0) {
    return "Same as your timezone";
  }

  return `${Math.abs(differenceHours)} hours ${
    differenceHours > 0 ? "ahead of" : "behind"
  } you`;
}

export function isDayTime(currentTime, sunrise, sunset) {
  return currentTime > sunrise && currentTime < sunset;
}

export function formatTimeAgo(dateString) {
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

export function formatTime(hours) {
  const h = Math.floor(hours).toString().padStart(2, "0");
  const m = Math.round((hours - Math.floor(hours)) * 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}

export function calculateRemoteTime(localHours, timezoneOffset) {
  let remoteHours = localHours + timezoneOffset;

  if (remoteHours >= 24) {
    remoteHours -= 24;
  } else if (remoteHours < 0) {
    remoteHours += 24;
  }

  return remoteHours;
}
