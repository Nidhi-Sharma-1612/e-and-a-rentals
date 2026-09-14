import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getListing, computeBookingTotal } from "@/lib/listings";
import { fetchListingCalendar, hasCalendarConflict } from "@/lib/hostaway";
import { addDays, toISODate } from "@/lib/date";
import { getRequestOrigin } from "@/lib/site";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  let body: { listingId?: unknown; checkIn?: unknown; checkOut?: unknown; guests?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { listingId, checkIn, checkOut, guests } = body;

  if (
    typeof listingId !== "string" ||
    typeof checkIn !== "string" ||
    typeof checkOut !== "string" ||
    typeof guests !== "number" ||
    !ISO_DATE.test(checkIn) ||
    !ISO_DATE.test(checkOut)
  ) {
    return NextResponse.json({ error: "Missing or invalid booking details." }, { status: 400 });
  }

  const today = toISODate(new Date());
  if (checkIn < today) {
    return NextResponse.json({ error: "Check-in date is in the past." }, { status: 400 });
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  const listing = await getListing(listingId);
  if (!listing) {
    return NextResponse.json({ error: "This home could not be found." }, { status: 404 });
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > listing.guests) {
    return NextResponse.json(
      { error: `Guests must be between 1 and ${listing.guests}.` },
      { status: 400 }
    );
  }

  const nights = Math.round(
    (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000
  );

  if (listing.minNights !== null && nights < listing.minNights) {
    return NextResponse.json(
      { error: `This home requires a ${listing.minNights}-night minimum stay.` },
      { status: 400 }
    );
  }

  // Fetch the live calendar once and use it for both: (a) rejecting a
  // booking for dates that are no longer open, and (b) charging the real
  // per-date rate Hostaway has for each night — weekends/seasons can price
  // differently from the listing's base rate, so this is never assumed to
  // just be nights × base price.
  let realNightlyTotal: number | null = null;
  try {
    const days = await fetchListingCalendar(listing.id, checkIn, checkOut);
    if (hasCalendarConflict(days, checkOut)) {
      return NextResponse.json(
        { error: "Those dates are no longer available. Please pick different dates." },
        { status: 409 }
      );
    }
    const byDate = new Map(days.map((d) => [d.date, d.price]));
    let sum = 0;
    let allPriced = true;
    for (let d = checkIn; d < checkOut; ) {
      const price = byDate.get(d);
      if (price === undefined) {
        allPriced = false;
        break;
      }
      sum += price;
      d = addDays(d, 1);
    }
    if (allPriced) realNightlyTotal = sum;
  } catch {
    // If Hostaway's calendar is unreachable, fall through and let
    // computeBookingTotal fall back to the listing's base price rather
    // than blocking checkout entirely.
  }

  const breakdown = computeBookingTotal(listing, nights, guests, realNightlyTotal);
  if (!breakdown) {
    return NextResponse.json(
      { error: "This home isn't available for online booking right now." },
      { status: 400 }
    );
  }

  const currency = listing.currency.toLowerCase();
  const lineItems = [
    {
      price_data: {
        currency,
        product_data: {
          name: listing.name,
          description: `${nights} night${nights === 1 ? "" : "s"} · ${checkIn} to ${checkOut} · ${guests} guest${guests === 1 ? "" : "s"}`,
        },
        unit_amount: Math.round(breakdown.nightlyTotal * 100),
      },
      quantity: 1,
    },
  ];
  if (breakdown.cleaningFee > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: { name: "Cleaning fee", description: listing.name },
        unit_amount: Math.round(breakdown.cleaningFee * 100),
      },
      quantity: 1,
    });
  }
  if (breakdown.extraGuestTotal > 0 && listing.extraGuestFee !== null) {
    lineItems.push({
      price_data: {
        currency,
        product_data: { name: "Extra guest fee", description: listing.name },
        unit_amount: Math.round(listing.extraGuestFee * 100),
      },
      quantity: breakdown.extraGuests * nights,
    });
  }

  const origin = getRequestOrigin(request);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/listings/${listing.id}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/listings/${listing.id}`,
      metadata: {
        listingId: listing.id,
        checkIn,
        checkOut,
        guests: String(guests),
        nights: String(nights),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start checkout.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
