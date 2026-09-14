const cityCoords: Record<string, { lat: number; lon: number }> = {
  "El Paso": { lat: 31.7619, lon: -106.485 },
  "Wichita Falls": { lat: 33.9137, lon: -98.4934 },
};

// Statewide view for listings where neither real coordinates nor a known
// city are available — still honest (no fabricated pin), just zoomed out.
const TEXAS_BBOX = "-106.6,25.8,-93.5,36.5";

// Nudges a listing's real coordinates by ~150-300m in a direction derived
// from its id, so the map centers on the actual neighborhood without
// pinpointing the exact building — the listing page already tells guests
// the exact address is shared after booking, this keeps the map honest to
// that same promise while still being real data (not a city centroid).
function jitter(seed: string): { dLat: number; dLon: number } {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const angle = ((hash % 360) + 360) % 360 * (Math.PI / 180);
  const distanceDeg = 0.0015 + (Math.abs(hash) % 100) / 100000; // ~150-260m
  return { dLat: Math.sin(angle) * distanceDeg, dLon: Math.cos(angle) * distanceDeg };
}

export type MapLocation = {
  id: string;
  lat?: number | null;
  lng?: number | null;
  city?: string;
};

// True when we have the listing's real (jittered) coordinates rather than
// just a city centroid — used to pick a tighter, more useful zoom level.
export function hasPreciseCoord(location: MapLocation): boolean {
  return location.lat != null && location.lng != null;
}

export function approximateCoord(location: MapLocation): { lat: number; lon: number } | undefined {
  if (location.lat != null && location.lng != null) {
    const { dLat, dLon } = jitter(location.id);
    return { lat: location.lat + dLat, lon: location.lng + dLon };
  }
  const coord = location.city ? cityCoords[location.city] : undefined;
  return coord;
}

// Statewide fallback view, as a { lat, lon } pair centered on Texas — for
// listings where neither real coordinates nor a known city are available.
export const TEXAS_CENTER = { lat: 31.15, lon: -100.05 };
export { TEXAS_BBOX };

export function externalMapUrl(location: MapLocation): string {
  const coord = approximateCoord(location);
  if (coord) {
    return `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`;
  }
  const query = location.city ? `${location.city}, Texas` : "Texas";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
