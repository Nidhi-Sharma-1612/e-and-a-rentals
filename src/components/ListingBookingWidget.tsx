"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Users, Star, ArrowLeft } from "lucide-react";
import Calendar from "./Calendar";
import GuestStepper from "./GuestStepper";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { addDays, formatDisplayDate, generateSampleUnavailableDates, toISODate } from "@/lib/date";

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

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useOutsideClose([
    [checkInRef, setCheckInOpen],
    [checkOutRef, setCheckOutOpen],
    [guestRef, setGuestOpen],
  ]);

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) /
            86400000
        )
      : 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-wood/30 bg-card p-6 shadow-[0_18px_36px_rgba(43,33,24,0.12)]">
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
        {/* Check-in */}
        <div ref={checkInRef} className="relative">
          <button
            type="button"
            onClick={() => setCheckInOpen((v) => !v)}
            className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-in</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              {checkIn ? formatDisplayDate(checkIn) : "Add date"}
            </span>
          </button>
          {checkInOpen && (
            <div className="absolute left-0 top-full z-50 mt-2">
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
        <div ref={checkOutRef} className="relative">
          <button
            type="button"
            onClick={() => setCheckOutOpen((v) => !v)}
            className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Check-out</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              {checkOut ? formatDisplayDate(checkOut) : "Add date"}
            </span>
          </button>
          {checkOutOpen && (
            <div className="absolute left-0 top-full z-50 mt-2">
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

        {/* Guests */}
        <div ref={guestRef} className="relative">
          <button
            type="button"
            onClick={() => setGuestOpen((v) => !v)}
            className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">Guests</span>
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              <Users className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </button>
          {guestOpen && (
            <GuestStepper guests={guests} setGuests={setGuests} widthClassName="w-52" />
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
        className="flex items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark"
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
