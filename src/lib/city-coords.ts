const cityCoords: Record<string, { lat: number; lon: number }> = {
  "El Paso": { lat: 31.7619, lon: -106.485 },
  "Wichita Falls": { lat: 33.9137, lon: -98.4934 },
};

// Statewide view for listings where the city isn't confirmed yet — still
// honest (no fabricated pin), just zoomed out instead of showing nothing.
const TEXAS_BBOX = "-106.6,25.8,-93.5,36.5";

export function mapEmbedUrl(city?: string): string {
  const coord = city ? cityCoords[city] : undefined;
  if (coord) {
    const delta = 0.08;
    const bbox = [coord.lon - delta, coord.lat - delta, coord.lon + delta, coord.lat + delta].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coord.lat},${coord.lon}`;
  }
  return `https://www.openstreetmap.org/export/embed.html?bbox=${TEXAS_BBOX}&layer=mapnik`;
}

export function externalMapUrl(city?: string): string {
  const query = city ? `${city}, Texas` : "Texas";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
