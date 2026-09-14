import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ListingCard } from "@/components/Listings";
import { getListings, type Listing } from "@/lib/listings";
import { fetchListingCalendar, hasCalendarConflict } from "@/lib/hostaway";
import { formatDisplayDate } from "@/lib/date";

export const metadata: Metadata = {
  title: "All homes | Book VIP Homes",
  description: "Browse every VIP Homes property across Texas, or search by location, dates, and guests.",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type Query = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

async function filterByAvailability(
  listings: Listing[],
  checkIn: string,
  checkOut: string
): Promise<Listing[]> {
  const nights = Math.round(
    (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000
  );

  const results = await Promise.all(
    listings.map(async (listing) => {
      if (listing.minNights !== null && nights < listing.minNights) return null;
      try {
        const days = await fetchListingCalendar(listing.id, checkIn, checkOut);
        return hasCalendarConflict(days, checkOut) ? null : listing;
      } catch {
        // Calendar unreachable for this listing — don't hide it over a
        // transient error, just skip the date check for it.
        return listing;
      }
    })
  );

  return results.filter((l): l is Listing => l !== null);
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const listings = await getListings();

  const location = query.location?.trim() || "";
  const guests = query.guests ? Number(query.guests) : null;
  const checkIn = query.checkIn && ISO_DATE.test(query.checkIn) ? query.checkIn : null;
  const checkOut = query.checkOut && ISO_DATE.test(query.checkOut) ? query.checkOut : null;
  const validDates = !!checkIn && !!checkOut && checkOut > checkIn;

  const beforeDates = listings.filter((listing) => {
    if (location && listing.city !== location) return false;
    if (guests && listing.guests < guests) return false;
    return true;
  });

  const filtered =
    validDates && checkIn && checkOut ? await filterByAvailability(beforeDates, checkIn, checkOut) : beforeDates;

  const hasSearch = !!(location || (guests && guests > 1) || validDates);
  // Dates were the reason nothing matched, not location/guests — worth
  // saying so explicitly instead of a flat "no matches".
  const excludedByDates = validDates && beforeDates.length > 0 && filtered.length === 0;

  const bookingParams = new URLSearchParams();
  if (checkIn) bookingParams.set("checkIn", checkIn);
  if (checkOut) bookingParams.set("checkOut", checkOut);
  if (guests && guests > 1) bookingParams.set("guests", String(guests));
  const bookingQuery = bookingParams.toString() ? `?${bookingParams.toString()}` : "";

  const noDatesParams = new URLSearchParams();
  if (location) noDatesParams.set("location", location);
  if (guests && guests > 1) noDatesParams.set("guests", String(guests));
  const noDatesHref = noDatesParams.toString() ? `/properties?${noDatesParams.toString()}` : "/properties";

  return (
    <>
      <Header />
      <main id="main-content" className="relative bg-cream-2">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[24px_24px]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 md:gap-9 md:px-16 md:py-14">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-[27px] font-bold md:text-4xl">
              {hasSearch ? "Your search results" : "All our homes"}
            </h1>
            <p className="text-[14.5px] text-ink-soft md:text-base">
              {hasSearch
                ? "Homes matching your search, checked against real availability."
                : "Every VIP Homes property across Texas, in one place."}
            </p>
          </div>

          {hasSearch && (
            <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-wood/30 bg-card px-4 py-3 text-sm">
              <span className="flex items-center gap-1.5 text-ink-soft">
                <Search className="h-3.5 w-3.5 shrink-0 text-terracotta" strokeWidth={2} />
                Showing {filtered.length} of {listings.length} homes
                {location ? ` in ${location}` : ""}
                {guests && guests > 1 ? ` for ${guests}+ guests` : ""}
                {checkIn && checkOut ? ` · ${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}` : ""}
              </span>
              <Link
                href="/properties"
                className="flex items-center gap-1 font-semibold text-denim hover:text-denim-dark"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                Clear filters
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-wood/30 bg-card py-14 text-center">
              <p className="text-ink-soft">
                {excludedByDates
                  ? `We found ${beforeDates.length} home${beforeDates.length === 1 ? "" : "s"}${
                      location ? ` in ${location}` : ""
                    }, but none are open for those exact dates.`
                  : validDates
                    ? "No homes are available for those dates right now."
                    : "No homes match your search right now."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {excludedByDates && (
                  <Link href={noDatesHref} className="font-semibold text-denim hover:text-denim-dark">
                    Browse those homes without dates
                  </Link>
                )}
                <Link href="/properties" className="font-semibold text-denim hover:text-denim-dark">
                  Clear filters and see all homes
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-7">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  href={`/listings/${listing.id}${bookingQuery}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
