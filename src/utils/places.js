import { haversineDistanceKm, formatDistance } from './geo.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildQuery(lat, lon, osmTag, radiusMeters) {
  const [key, value] = osmTag.split('=');

  // For water features (lakes), add a secondary filter
  const waterFilter = key === 'natural' && value === 'water'
    ? '["water"~"lake|reservoir|pond"]'
    : '';

  // For hiking routes, query relations and ways
  if (key === 'route' && value === 'hiking') {
    return `[out:json][timeout:10];
(
  relation["route"="hiking"](around:${radiusMeters},${lat},${lon});
  way["highway"="path"]["sac_scale"](around:${radiusMeters},${lat},${lon});
  way["highway"="footway"]["name"](around:${radiusMeters},${lat},${lon});
);
out center 10;`;
  }

  return `[out:json][timeout:10];
(
  node["${key}"="${value}"]${waterFilter}(around:${radiusMeters},${lat},${lon});
  way["${key}"="${value}"]${waterFilter}(around:${radiusMeters},${lat},${lon});
  relation["${key}"="${value}"]${waterFilter}(around:${radiusMeters},${lat},${lon});
);
out center 10;`;
}

export async function fetchNearbyPlaces(lat, lon, osmTag, radiusKm) {
  if (!osmTag) return [];

  const radiusMeters = radiusKm * 1000;
  const query = buildQuery(lat, lon, osmTag, radiusMeters);

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) return [];

  const data = await response.json();

  const places = data.elements
    .map((el) => {
      const name = el.tags?.name;
      if (!name) return null;

      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (!elLat || !elLon) return null;

      const distKm = haversineDistanceKm(lat, lon, elLat, elLon);

      return {
        name,
        lat: elLat,
        lon: elLon,
        distKm,
        distLabel: formatDistance(distKm),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 3);

  return places;
}
