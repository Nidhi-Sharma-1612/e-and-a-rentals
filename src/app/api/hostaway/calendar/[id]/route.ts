import { NextResponse } from "next/server";
import { fetchListingCalendar } from "@/lib/hostaway";
import { addDays, toISODate } from "@/lib/date";

// Matches Calendar.tsx's MAX_MONTHS_AHEAD.
const MONTHS_AHEAD = 18;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const startDate = toISODate(new Date());
  const endDate = addDays(startDate, MONTHS_AHEAD * 31);

  try {
    const days = await fetchListingCalendar(id, startDate, endDate);
    const unavailable = days
      .filter((day) => !day.isAvailable)
      .map((day) => day.date);
    // Hostaway prices per day (weekends, seasons, etc can all differ from
    // the listing's base rate) — hand the real nightly rate back so the
    // booking widget can total a stay correctly instead of guessing from
    // the base price.
    const prices: Record<string, number> = {};
    for (const day of days) prices[day.date] = day.price;
    return NextResponse.json({ unavailable, prices });
  } catch {
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 502 }
    );
  }
}
