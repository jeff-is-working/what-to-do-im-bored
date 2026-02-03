let cachedPosition = null;

export function getUserLocation() {
  if (cachedPosition) return Promise.resolve(cachedPosition);

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedPosition = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        resolve(cachedPosition);
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}

export function getSearchRadiusKm(timeHours) {
  if (timeHours <= 2) return 5;
  if (timeHours <= 4) return 15;
  if (timeHours <= 8) return 30;
  if (timeHours <= 24) return 60;
  if (timeHours <= 72) return 100;
  return 150;
}

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  const miles = km * 0.621371;
  if (miles < 0.1) return 'nearby';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}
