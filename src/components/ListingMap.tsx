"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  approximateCoord,
  hasPreciseCoord,
  TEXAS_CENTER,
  type MapLocation,
} from "@/lib/city-coords";

const APPROX_RADIUS_METERS = 500;

export default function ListingMap({ location }: { location: MapLocation }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { id, lat, lng, city } = location;
  const label = city ? `Map showing the approximate area near ${city}, Texas` : "Map of Texas";

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const coord = approximateCoord({ id, lat, lng, city });
      const precise = hasPreciseCoord({ id, lat, lng, city });
      const center: [number, number] = coord
        ? [coord.lat, coord.lon]
        : [TEXAS_CENTER.lat, TEXAS_CENTER.lon];
      const zoom = coord ? (precise ? 14 : 11) : 6;

      map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
        // Default zoom control sits top-left, which is exactly where the
        // "Approximate area" badge overlays the map — move it out of the way.
        zoomControl: false,
      });
      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // A circle, not a pin — a marker would visually claim precision we
      // don't want to show pre-booking; the circle honestly communicates
      // "somewhere in here" over the real neighborhood.
      if (coord && precise) {
        L.circle(center, {
          radius: APPROX_RADIUS_METERS,
          color: "#9c3620",
          weight: 2,
          fillColor: "#9c3620",
          fillOpacity: 0.15,
        }).addTo(map);
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [id, lat, lng, city]);

  return <div ref={containerRef} role="img" aria-label={label} className="h-80 w-full" />;
}
