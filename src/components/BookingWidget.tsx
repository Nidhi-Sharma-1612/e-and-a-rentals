"use client";

import { useMemo, useRef, useState } from "react";
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
import { addDays, formatDisplayDate, generateSampleUnavailableDates, toISODate } from "@/lib/date";

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
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  const unavailable = useMemo(() => generateSampleUnavailableDates(), []);

  useOutsideClose([
    [locationRef, setLocationOpen],
    [checkInRef, setCheckInOpen],
    [checkOutRef, setCheckOutOpen],
    [guestPickerRef, setGuestPickerOpen],
  ]);

  function handleSearch() {
    const cityLabel = locations.find((loc) => loc.value === location)?.label ?? "";
    applyFilter({
      location: cityLabel === "Any location" ? "" : cityLabel,
      guests,
    });
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl bg-card p-4.5 text-left shadow-[0_18px_40px_rgba(43,33,24,0.3)] md:gap-4 md:p-5.5">
      <div className="flex flex-col divide-y divide-wood/40 md:flex-row md:items-stretch md:divide-y-0">
        {/* Location */}
        <div ref={locationRef} className="relative flex-1" style={{ flexGrow: 1.2 }}>
          <button
            type="button"
            onClick={() => setLocationOpen((v) => !v)}
            aria-expanded={locationOpen}
            className="flex w-full flex-col gap-1 py-2 text-left md:px-5 md:py-1"
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
            <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-wood/40 bg-card p-2 shadow-lg">
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

        {/* Check-in */}
        <div ref={checkInRef} className="relative flex-1 md:border-l md:border-wood/40">
          <button
            type="button"
            onClick={() => setCheckInOpen((v) => !v)}
            className="flex w-full flex-col gap-1 py-2 text-left md:px-5 md:py-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check-in
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="text-sm text-ink-soft md:text-[15px]">
                {checkIn ? formatDisplayDate(checkIn) : "Add date"}
              </span>
            </span>
          </button>

          {checkInOpen && (
            <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2">
              <Calendar
                selected={checkIn}
                minDate={today}
                unavailable={unavailable}
                onSelect={(iso) => {
                  setCheckIn(iso);
                  if (checkOut && checkOut <= iso) setCheckOut(null);
                  setCheckInOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Check-out */}
        <div ref={checkOutRef} className="relative flex-1 md:border-l md:border-wood/40">
          <button
            type="button"
            onClick={() => setCheckOutOpen((v) => !v)}
            className="flex w-full flex-col gap-1 py-2 text-left md:px-5 md:py-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check-out
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="text-sm text-ink-soft md:text-[15px]">
                {checkOut ? formatDisplayDate(checkOut) : "Add date"}
              </span>
            </span>
          </button>

          {checkOutOpen && (
            <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2">
              <Calendar
                selected={checkOut}
                minDate={checkIn ? addDays(checkIn, 1) : today}
                unavailable={unavailable}
                onSelect={(iso) => {
                  setCheckOut(iso);
                  setCheckOutOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Guests + search: share a row on every breakpoint */}
        <div className="flex items-center gap-3 pt-3.5 md:contents md:pt-0">
          <div ref={guestPickerRef} className="relative flex-1 md:border-l md:border-wood/40" style={{ flexGrow: 0.8 }}>
            <button
              type="button"
              onClick={() => setGuestPickerOpen((v) => !v)}
              className="flex w-full flex-col gap-1 py-2 text-left md:px-5 md:py-1"
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

            {guestPickerOpen && <GuestStepper guests={guests} setGuests={setGuests} />}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search stays"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-card transition-colors hover:bg-terracotta-dark md:h-12 md:w-12 md:self-center"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </div>
  );
}
