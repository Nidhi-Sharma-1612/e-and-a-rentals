"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Users, Star, ArrowLeft, Loader2 } from "lucide-react";
import Calendar from "./Calendar";
import GuestStepper from "./GuestStepper";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { addDays, formatDisplayDate, toISODate } from "@/lib/date";
import { computeBookingTotal, type Listing } from "@/lib/listings";

export default function ListingBookingWidget({
  listing,
  initialCheckIn = null,
  initialCheckOut = null,
  initialGuests = null,
}: {
  listing: Listing;
  initialCheckIn?: string | null;
  initialCheckOut?: string | null;
  initialGuests?: number | null;
}) {
  const today = useMemo(() => toISODate(new Date()), []);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/hostaway/calendar/${listing.id}`)
      .then((res) => (res.ok ? res.json() : { unavailable: [], prices: {} }))
      .then((data: { unavailable: string[]; prices: Record<string, number> }) => {
        if (!cancelled) {
          setUnavailable(new Set(data.unavailable));
          setPrices(data.prices ?? {});
        }
      })
      .catch(() => {
        // Availability/prices just stay unknown (all days shown open, base
        // rate used) if the Hostaway calendar request fails — better than
        // blocking booking.
      });
    return () => {
      cancelled = true;
    };
  }, [listing.id]);

  // Seeded from the homepage search widget when a guest arrives via a
  // listing link that carries dates/guests in the query string — ignoring
  // anything that's no longer sensible against today's date or this
  // specific listing's capacity.
  const [checkIn, setCheckIn] = useState<string | null>(
    initialCheckIn && initialCheckIn >= today ? initialCheckIn : null
  );
  const [checkOut, setCheckOut] = useState<string | null>(
    initialCheckIn && initialCheckOut && initialCheckIn >= today && initialCheckOut > initialCheckIn
      ? initialCheckOut
      : null
  );
  const [guests, setGuests] = useState(
    initialGuests ? Math.min(initialGuests, listing.guests) : 1
  );

  const [datesOpen, setDatesOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [datesPlacement, setDatesPlacement] = useState<"down" | "up">("down");
  const [guestPlacement, setGuestPlacement] = useState<"down" | "up">("down");
  const [datesMaxHeight, setDatesMaxHeight] = useState<number | undefined>(undefined);
  const [guestMaxHeight, setGuestMaxHeight] = useState<number | undefined>(undefined);

  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // A prefilled date range (from the homepage search) might turn out to
  // conflict with the real calendar once it loads — treat it as unselected
  // rather than let a guest try to book already-booked dates. Derived, not
  // stored: once the real availability data arrives, this just naturally
  // stops matching for valid selections.
  const hasConflict = useMemo(() => {
    if (unavailable.size === 0 || !checkIn || !checkOut) return false;
    let d = checkIn;
    while (d < checkOut) {
      if (unavailable.has(d)) return true;
      d = addDays(d, 1);
    }
    return false;
  }, [checkIn, checkOut, unavailable]);
  const effectiveCheckIn = hasConflict ? null : checkIn;
  const effectiveCheckOut = hasConflict ? null : checkOut;

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
    effectiveCheckIn && effectiveCheckOut
      ? Math.round(
          (new Date(`${effectiveCheckOut}T00:00:00`).getTime() -
            new Date(`${effectiveCheckIn}T00:00:00`).getTime()) /
            86400000
        )
      : 0;

  // Sum the real per-date rates for the selected nights when we have them
  // for every night — Hostaway prices weekends/seasons differently from
  // the listing's base rate, so this can (and does) differ from
  // listing.price × nights.
  const nightlyRates = useMemo(() => {
    if (!effectiveCheckIn || !effectiveCheckOut || nights <= 0) return null;
    const rates: number[] = [];
    let d = effectiveCheckIn;
    while (d < effectiveCheckOut) {
      const price = prices[d];
      if (price === undefined) return null;
      rates.push(price);
      d = addDays(d, 1);
    }
    return rates;
  }, [effectiveCheckIn, effectiveCheckOut, nights, prices]);

  const realNightlyTotal = nightlyRates ? nightlyRates.reduce((a, b) => a + b, 0) : null;
  const ratesVary = !!nightlyRates && new Set(nightlyRates).size > 1;

  const breakdown = computeBookingTotal(listing, nights, guests, realNightlyTotal);
  const belowMinNights =
    nights > 0 && listing.minNights !== null && nights < listing.minNights;

  async function handleBookNow() {
    if (!effectiveCheckIn || !effectiveCheckOut || belowMinNights) return;
    setCheckoutState("loading");
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          checkIn: effectiveCheckIn,
          checkOut: effectiveCheckOut,
          guests,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong starting checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutState("error");
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong starting checkout.");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card p-6 shadow-[0_18px_36px_rgba(43,33,24,0.12)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-heading text-2xl font-bold text-terracotta">
          {listing.rating}
          <Star className="h-4 w-4 fill-terracotta text-terracotta" />
        </span>
        {listing.reviewCount !== undefined && (
          <span className="text-sm text-muted">
            {listing.reviewCount} review{listing.reviewCount === 1 ? "" : "s"}
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
              <span className="truncate">{effectiveCheckIn ? formatDisplayDate(effectiveCheckIn) : "Add date"}</span>
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
              <span className="truncate">{effectiveCheckOut ? formatDisplayDate(effectiveCheckOut) : "Add date"}</span>
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
                checkIn={effectiveCheckIn}
                checkOut={effectiveCheckOut}
                minDate={today}
                unavailable={unavailable}
                maxHeight={datesMaxHeight}
                minNights={listing.minNights ?? 1}
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
              max={listing.guests}
              widthClassName="w-52"
              placement={guestPlacement}
              panelRef={guestPanelRef}
              maxHeight={guestMaxHeight}
            />
          )}
        </div>
      </div>

      {listing.guestsIncluded !== null && listing.extraGuestFee !== null && listing.extraGuestFee > 0 && (
        <p className="text-xs text-muted">
          Rate includes {listing.guestsIncluded} guest{listing.guestsIncluded === 1 ? "" : "s"} — +$
          {listing.extraGuestFee}/night per additional guest.
        </p>
      )}

      {(realNightlyTotal !== null || listing.price !== null) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-soft">
            {realNightlyTotal !== null ? (
              <>
                ${Math.round(realNightlyTotal / nights)}{" "}
                <span className="text-muted">{ratesVary ? "avg / night" : "/ night"}</span>
              </>
            ) : (
              <>
                ${listing.price} <span className="text-muted">/ night</span>
              </>
            )}
          </span>
          {listing.minNights !== null && listing.minNights > 1 && (
            <span className="text-xs font-semibold text-muted">{listing.minNights}-night minimum</span>
          )}
        </div>
      )}

      {breakdown && (
        <div className="flex flex-col gap-1 border-t border-wood/25 pt-3 text-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span>
              {realNightlyTotal !== null
                ? ratesVary
                  ? `$${Math.round(breakdown.nightlyTotal / nights)} avg/night x ${nights} night${nights === 1 ? "" : "s"}`
                  : `$${nightlyRates![0]} x ${nights} night${nights === 1 ? "" : "s"}`
                : `$${listing.price} x ${nights} night${nights === 1 ? "" : "s"}`}
            </span>
            <span>${breakdown.nightlyTotal}</span>
          </div>
          {breakdown.cleaningFee > 0 && (
            <div className="flex items-center justify-between text-ink-soft">
              <span>Cleaning fee</span>
              <span>${breakdown.cleaningFee}</span>
            </div>
          )}
          {breakdown.extraGuestTotal > 0 && (
            <div className="flex items-center justify-between text-ink-soft">
              <span>
                {breakdown.extraGuests} extra guest{breakdown.extraGuests === 1 ? "" : "s"} x {nights} night
                {nights === 1 ? "" : "s"}
              </span>
              <span>${breakdown.extraGuestTotal}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-wood/25 pt-1.5 font-semibold text-ink">
            <span>Total</span>
            <span>${breakdown.total}</span>
          </div>
        </div>
      )}

      {hasConflict && (
        <p className="text-xs font-semibold text-terracotta-dark">
          Your searched dates are no longer available for this home — pick new dates below.
        </p>
      )}
      {belowMinNights && (
        <p className="text-xs font-semibold text-terracotta-dark">
          This home requires a {listing.minNights}-night minimum stay.
        </p>
      )}
      {checkoutState === "error" && checkoutError && (
        <p className="text-xs font-semibold text-terracotta-dark">{checkoutError}</p>
      )}

      <button
        type="button"
        onClick={handleBookNow}
        disabled={!effectiveCheckIn || !effectiveCheckOut || belowMinNights || checkoutState === "loading"}
        className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {checkoutState === "loading" && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />}
        {checkoutState === "loading" ? "Redirecting to payment…" : "Book Now"}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-muted">
        You&apos;ll be redirected to Stripe to securely enter payment details.
      </p>

      <Link
        href="/properties"
        className="flex items-center justify-center gap-1.5 text-sm font-semibold text-denim hover:text-denim-dark"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
        Back to all homes
      </Link>
    </div>
  );
}
