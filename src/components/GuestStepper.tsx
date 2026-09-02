"use client";

import type { Ref } from "react";
import { Minus, Plus } from "lucide-react";

export default function GuestStepper({
  guests,
  setGuests,
  min = 1,
  max = 16,
  widthClassName = "w-56",
  placement = "down",
  panelRef,
  maxHeight,
}: {
  guests: number;
  setGuests: (updater: (g: number) => number) => void;
  min?: number;
  max?: number;
  widthClassName?: string;
  placement?: "down" | "up";
  panelRef?: Ref<HTMLDivElement>;
  maxHeight?: number;
}) {
  return (
    <div
      ref={panelRef}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
      className={`absolute left-0 z-50 flex ${widthClassName} items-center justify-between gap-4 overflow-y-auto rounded-xl border border-wood/40 bg-card p-4 shadow-lg ${
        placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
    >
      <span className="text-sm font-semibold text-ink">Guests</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease guests"
          onClick={() => setGuests((g) => Math.max(min, g - 1))}
          disabled={guests <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-wood/60 text-ink transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:hover:border-wood/60 disabled:hover:text-ink"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.3} />
        </button>
        <span className="w-4 text-center text-sm font-semibold text-ink">{guests}</span>
        <button
          type="button"
          aria-label="Increase guests"
          onClick={() => setGuests((g) => Math.min(max, g + 1))}
          disabled={guests >= max}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-wood/60 text-ink transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:hover:border-wood/60 disabled:hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.3} />
        </button>
      </div>
    </div>
  );
}
