"use client";

import { useState } from "react";
import { amenityIcon } from "@/lib/amenity-icons";

const INITIAL_COUNT = 6;

export default function AmenitiesList({ amenities }: { amenities: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? amenities : amenities.slice(0, INITIAL_COUNT);
  const remaining = amenities.length - INITIAL_COUNT;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((amenity) => {
          const Icon = amenityIcon(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-2.5 rounded-xl border border-wood/25 bg-card px-3.5 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/10">
                <Icon className="h-4 w-4 text-sage" strokeWidth={2} />
              </div>
              <span className="text-sm text-ink-soft">{amenity}</span>
            </div>
          );
        })}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-fit text-sm font-semibold text-denim hover:text-denim-dark"
        >
          {expanded ? "Show less" : `Show all ${amenities.length} amenities`}
        </button>
      )}
    </>
  );
}
