"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Users, Star, ArrowLeft } from "lucide-react";
import Calendar from "./Calendar";
import GuestStepper from "./GuestStepper";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { formatDisplayDate, generateSampleUnavailableDates, toISODate } from "@/lib/date";

export default function ListingBookingWidget({
  rating,
  reviewCount,
}: {
  rating: string;
  reviewCount?: number;
}) {
  const today = useMemo(() => toISODate(new Date()), []);
  const unavailable = useMemo(() => generateSampleUnavailableDates(), []);

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);

  const [datesOpen, setDatesOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [datesPlacement, setDatesPlacement] = useState<"down" | "up">("down");
  const [guestPlacement, setGuestPlacement] = useState<"down" | "up">("down");
  const [datesMaxHeight, setDatesMaxHeight] = useState<number | undefined>(undefined);
  const [guestMaxHeight, setGuestMaxHeight] = useState<number | undefined>(undefined);

  const datesRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const datesPanelRef = useRef<HTMLDivElement>(null);
  const guestPanelRef = useRef<HTMLDivElement>(null);

  useOutsideClose([
    [datesRef, setDatesOpen],
    [guestRef, setGuestOpen],
  ]);

  // Picks which side of the trigger has more room, and caps the panel's
  // height to whatever is actually available there — this is the part that
  // guarantees no clipping even when the widget sits in a `position: sticky`
  // ancestor, where scrolling the page can't move the trigger into more room.
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

  function toggleDates() {
    if (!datesOpen) {
      const { placement, maxHeight } = placementFor(datesRef, 420);
      setDatesPlacement(placement);
      setDatesMaxHeight(maxHeight);
    }
    setDatesOpen((v) => !v);
  }

  function toggleGuests() {
    if (!guestOpen) {
      const { placement, maxHeight } = placementFor(guestRef, 110);
      setGuestPlacement(placement);
      setGuestMaxHeight(maxHeight);
    }
    setGuestOpen((v) => !v);
  }

  // Belt-and-suspenders: also nudge the panel into view when the trigger
  // itself isn't in a sticky container, so scrolling can help too.
  useEffect(() => {
    if (datesOpen) datesPanelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [datesOpen]);
  useEffect(() => {
    if (guestOpen) guestPanelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [guestOpen]);

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) /
            86400000
        )
      : 0;

  return (
    <div className="flex flex-col gap-4 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card p-6 shadow-[0_18px_36px_rgba(43,33,24,0.12)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-heading text-2xl font-bold text-terracotta">
          {rating}
          <Star className="h-4 w-4 fill-terracotta text-terracotta" />
        </span>
        {reviewCount !== undefined && (
          <span className="text-sm text-muted">
            {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="flex flex-col divide-y divide-wood/25 rounded-xl border border-wood/30">
        {/* Check-in / Check-out: two fields, one shared calendar */}
        <div ref={datesRef} className="relative flex divide-x divide-wood/25">
          <button
            type="button"
            onClick={toggleDates}
            className="flex flex-1 flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-in</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="truncate">{checkIn ? formatDisplayDate(checkIn) : "Add date"}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={toggleDates}
            className="flex flex-1 flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-out</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              <span className="truncate">{checkOut ? formatDisplayDate(checkOut) : "Add date"}</span>
            </span>
          </button>

          {datesOpen && (
            <div
              ref={datesPanelRef}
              className={`absolute left-0 z-50 ${
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

        {/* Guests */}
        <div ref={guestRef} className="relative">
          <button
            type="button"
            onClick={toggleGuests}
            className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Guests</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <Users className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </button>
          {guestOpen && (
            <GuestStepper
              guests={guests}
              setGuests={setGuests}
              max={10}
              widthClassName="w-52"
              placement={guestPlacement}
              panelRef={guestPanelRef}
              maxHeight={guestMaxHeight}
            />
          )}
        </div>
      </div>

      {nights > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-soft">
            {nights} night{nights === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-semibold text-muted">Contact for pricing</span>
        </div>
      )}

      {/* Book Now is intentionally inert until the Hostaway booking
          integration is wired up — client is still finalizing the design. */}
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark"
      >
        Book Now
      </button>
      <p className="text-center text-[11px] leading-relaxed text-muted">
        Online booking is coming soon.
      </p>

      <Link
        href="/#listings"
        className="flex items-center justify-center gap-1.5 text-sm font-semibold text-denim hover:text-denim-dark"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
        Back to all homes
      </Link>
    </div>
  );
}
