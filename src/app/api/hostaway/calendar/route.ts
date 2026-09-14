import { NextResponse } from "next/server";
import { fetchListingCalendar } from "@/lib/hostaway";
import { getListings } from "@/lib/listings";
import { addDays, toISODate } from "@/lib/date";

// Matches Calendar.tsx's MAX_MONTHS_AHEAD.
const MONTHS_AHEAD = 18;

// Aggregate availability across every listing, for the homepage search
// widget (which isn't tied to one property yet). A date only counts as
// unavailable here if every listing is booked that day — otherwise a guest
// can still find a home for it, just not necessarily the first one shown.
export async function GET() {
  const startDate = toISODate(new Date());
  const endDate = addDays(startDate, MONTHS_AHEAD * 31);

  try {
    const listings = await getListings();
    const calendars = await Promise.all(
      listings.map((l) => fetchListingCalendar(l.id, startDate, endDate))
    );

    const unavailableCounts = new Map<string, number>();
    for (const days of calendars) {
      for (const day of days) {
        if (!day.isAvailable) {
          unavailableCounts.set(day.date, (unavailableCounts.get(day.date) ?? 0) + 1);
        }
      }
    }

    const unavailable = [...unavailableCounts.entries()]
      .filter(([, count]) => count >= listings.length)
      .map(([date]) => date);

    return NextResponse.json({ unavailable });
  } catch {
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 502 }
    );
  }
}
