"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronDown,
} from "lucide-react";
import Calendar from "./Calendar";
import GuestStepper from "./GuestStepper";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { useSearchFilter } from "./SearchFilterProvider";
import { formatDisplayDate, generateSampleUnavailableDates, toISODate } from "@/lib/date";

const today = toISODate(new Date());

const locations = [
  { value: "", label: "Any location" },
  { value: "el-paso", label: "El Paso" },
  { value: "wichita-falls", label: "Wichita Falls" },
];

export default function BookingWidget() {
  const { applyFilter } = useSearchFilter();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);

  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [locationPlacement, setLocationPlacement] = useState<"down" | "up">("down");
  const [datesPlacement, setDatesPlacement] = useState<"down" | "up">("down");
  const [guestPlacement, setGuestPlacement] = useState<"down" | "up">("down");
  const [locationMaxHeight, setLocationMaxHeight] = useState<number | undefined>(undefined);
  const [datesMaxHeight, setDatesMaxHeight] = useState<number | undefined>(undefined);
  const [guestMaxHeight, setGuestMaxHeight] = useState<number | undefined>(undefined);

  const locationRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const locationPanelRef = useRef<HTMLDivElement>(null);
  const datesPanelRef = useRef<HTMLDivElement>(null);
  const guestPanelRef = useRef<HTMLDivElement>(null);

  const unavailable = useMemo(() => generateSampleUnavailableDates(), []);

  useOutsideClose([
    [locationRef, setLocationOpen],
    [datesRef, setDatesOpen],
    [guestPickerRef, setGuestPickerOpen],
  ]);

  // Picks which side of the trigger has more room, and caps the panel's
  // height to whatever is actually available there — this is the part that
  // guarantees no clipping even when the trigger sits somewhere scrolling
  // can't help (e.g. a sticky ancestor).
  function placementFor(
    ref: React.RefObject<HTMLDivElement | null>,
    estHeight: number
  ): { placement: "down" | "up"; maxHeight: number | undefined } {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return { placement: "down", maxHeight: undefined };
    const margin = 16;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const placement = spaceBelow < estHeight && spaceAbove > spaceBelow ? "up" : "down";
    const available = placement === "up" ? spaceAbove : spaceBelow;
    const maxHeight = available < estHeight ? Math.max(0, available) : undefined;
    return { placement, maxHeight };
  }

  function toggleLocation() {
    if (!locationOpen) {
      const { placement, maxHeight } = placementFor(locationRef, 220);
      setLocationPlacement(placement);
      setLocationMaxHeight(maxHeight);
    }
    setLocationOpen((v) => !v);
  }

  function toggleDates() {
    if (!datesOpen) {
      const { placement, maxHeight } = placementFor(datesRef, 420);
      setDatesPlacement(placement);
      setDatesMaxHeight(maxHeight);
    }
    setDatesOpen((v) => !v);
  }

  function toggleGuestPicker() {
    if (!guestPickerOpen) {
      const { placement, maxHeight } = placementFor(guestPickerRef, 110);
      setGuestPlacement(placement);
      setGuestMaxHeight(maxHeight);
    }
    setGuestPickerOpen((v) => !v);
  }

  // Even with flip-placement, a very short viewport may not fit the panel in
  // either direction — nudge it fully into view so nothing is cut off.
  useEffect(() => {
    if (locationOpen) locationPanelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [locationOpen]);
  useEffect(() => {
    if (datesOpen) datesPanelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [datesOpen]);
  useEffect(() => {
    if (guestPickerOpen) guestPanelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [guestPickerOpen]);

  function handleSearch() {
    const cityLabel = locations.find((loc) => loc.value === location)?.label ?? "";
    applyFilter({
      location: cityLabel === "Any location" ? "" : cityLabel,
      guests,
    });
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4.5 text-left shadow-[0_18px_40px_rgba(43,33,24,0.3)] md:gap-4 md:p-5.5">
      <div className="flex flex-col divide-y divide-wood/40 md:flex-row md:items-stretch md:divide-y-0">
        {/* Location */}
        <div ref={locationRef} className="relative flex-1" style={{ flexGrow: 1 }}>
          <button
            type="button"
            onClick={toggleLocation}
            aria-expanded={locationOpen}
            className="flex w-full flex-col gap-1 py-2.5 text-left md:px-5 md:py-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Location
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="flex-1 text-sm text-ink-soft md:text-[15px]">
                {locations.find((loc) => loc.value === location)?.label}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 ${
                  locationOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2}
              />
            </span>
          </button>

          {locationOpen && (
            <div
              ref={locationPanelRef}
              style={{ maxHeight: locationMaxHeight ? `${locationMaxHeight}px` : undefined }}
              className={`absolute left-0 z-50 w-56 overflow-y-auto rounded-xl border border-wood/40 bg-card p-2 shadow-lg ${
                locationPlacement === "up" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            >
              {locations.map((loc) => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() => {
                    setLocation(loc.value);
                    setLocationOpen(false);
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    loc.value === location
                      ? "bg-terracotta/10 font-semibold text-terracotta"
                      : "text-ink hover:bg-cream-2"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Check-in / Check-out: two fields, one shared calendar */}
        <div
          ref={datesRef}
          className="relative flex flex-1 divide-x divide-wood/40 md:border-l md:border-wood/40"
          style={{ flexGrow: 1.6 }}
        >
          <button
            type="button"
            onClick={toggleDates}
            className="flex flex-1 flex-col gap-1 px-3 py-2.5 text-left md:px-5 md:py-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check-in
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="truncate text-sm text-ink-soft md:text-[15px]">
                {checkIn ? formatDisplayDate(checkIn) : "Add date"}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={toggleDates}
            className="flex flex-1 flex-col gap-1 px-3 py-2.5 text-left md:px-5 md:py-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check-out
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="truncate text-sm text-ink-soft md:text-[15px]">
                {checkOut ? formatDisplayDate(checkOut) : "Add date"}
              </span>
            </span>
          </button>

          {datesOpen && (
            <div
              ref={datesPanelRef}
              className={`absolute left-1/2 z-50 -translate-x-1/2 ${
                datesPlacement === "up" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            >
              <Calendar
                checkIn={checkIn}
                checkOut={checkOut}
                minDate={today}
                unavailable={unavailable}
                maxHeight={datesMaxHeight}
                onChange={(next) => {
                  setCheckIn(next.checkIn);
                  setCheckOut(next.checkOut);
                  if (next.checkIn && next.checkOut) setDatesOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Guests + search (desktop: shared row with an icon button) */}
        <div className="flex items-center gap-3 md:contents">
          <div ref={guestPickerRef} className="relative flex-1 md:grow-[0.8] md:border-l md:border-wood/40">
            <button
              type="button"
              onClick={toggleGuestPicker}
              className="flex w-full flex-col gap-1 py-2.5 text-left md:px-5 md:py-1"
            >
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Guests
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
                <span className="text-sm text-ink-soft md:text-[15px]">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
              </span>
            </button>

            {guestPickerOpen && (
              <GuestStepper
                guests={guests}
                setGuests={setGuests}
                max={10}
                widthClassName="w-full md:w-56"
                placement={guestPlacement}
                panelRef={guestPanelRef}
                maxHeight={guestMaxHeight}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search stays"
            className="hidden shrink-0 items-center justify-center rounded-full bg-terracotta text-card transition-colors hover:bg-terracotta-dark md:flex md:h-12 md:w-12 md:self-center"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {/* Mobile: full-width primary CTA instead of a small icon button */}
      <button
        type="button"
        onClick={handleSearch}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark md:hidden"
      >
        <Search className="h-4 w-4" strokeWidth={2.3} />
        Search stays
      </button>
    </div>
  );
}
