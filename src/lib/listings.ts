import { cache } from "react";
import {
  fetchListings,
  fetchCancellationPolicies,
  fetchReviews,
  type HostawayListing,
  type HostawayCancellationPolicy,
  type HostawayReview,
} from "@/lib/hostaway";

export type Review = {
  name: string;
  date: string;
  text: string;
};

export type Listing = {
  id: string;
  name: string;
  image: string;
  images: string[];
  rating: string;
  reviewCount?: number;
  guests: number;
  beds: number;
  baths: number;
  tag?: string;
  city?: string;
  lat: number | null;
  lng: number | null;
  bedrooms: number;
  description: string[];
  allAmenities: string[];
  houseRules: string | null;
  checkIn: string;
  checkOut: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  cancellationPolicy: string[];
  reviews: Review[];
  price: number | null;
  currency: string;
  cleaningFee: number | null;
  minNights: number | null;
  guestsIncluded: number | null;
  extraGuestFee: number | null;
};

function displayName(rawName: string): string {
  // Hostaway listing names are sometimes SEO-stuffed for channels
  // ("The Lucile - Spacious 4BR ... | Fast Wi-Fi"); use just the first
  // segment as the on-site display name.
  return rawName.split(" - ")[0].split(" | ")[0].trim();
}

function formatHour(hour: number | null): string {
  if (hour === null) return "Flexible";
  const period = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelveHour}:00 ${period}`;
}

function formatCancellationPolicy(
  policy: HostawayCancellationPolicy | undefined
): string[] {
  if (!policy) {
    return ["Contact us for this home's cancellation policy."];
  }
  return policy.cancellationPolicyItem
    .slice()
    .sort((a, b) => b.timeDelta - a.timeDelta)
    .map((item) => {
      const days = Math.round(Math.abs(item.timeDelta) / 86400);
      const unit = item.refundType === "percentage" ? "%" : "";
      return `${item.refundAmount}${unit} refund up to ${days} day${days === 1 ? "" : "s"} before arrival`;
    });
}

// Hostaway descriptions sometimes carry markdown syntax meant for a
// renderer this site doesn't have; strip it down to plain paragraphs.
function cleanDescriptionLine(line: string): string {
  return line
    .replace(/^#+\s*/, "")
    .replace(/^[*-]\s+/, "• ")
    .trim();
}

function formatReviewDate(departureDate: string): string {
  const date = new Date(departureDate.replace(" ", "T"));
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function mapListing(
  raw: HostawayListing,
  policy: HostawayCancellationPolicy | undefined,
  reviews: HostawayReview[]
): Listing {
  const images = raw.listingImages
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.url);

  const amenityNames = raw.listingAmenities.map((a) => a.amenityName);

  const listingReviews = reviews
    .filter(
      (r) =>
        r.listingMapId === raw.id &&
        r.type === "guest-to-host" &&
        r.status === "published"
    )
    .sort(
      (a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime()
    );

  const reviewsWithText = listingReviews
    .filter((r) => r.publicReview)
    .slice(0, 5)
    .map((r) => ({
      name: r.reviewerName || r.guestName,
      date: formatReviewDate(r.departureDate),
      text: r.publicReview as string,
    }));

  return {
    id: String(raw.id),
    name: displayName(raw.externalListingName || raw.name),
    image: images[0] ?? "/images/cottage1-b.jpg",
    images: images.length > 0 ? images : ["/images/cottage1-b.jpg"],
    rating:
      raw.averageReviewRating !== null
        ? (raw.averageReviewRating / 2).toFixed(2)
        : "New",
    reviewCount: listingReviews.length || undefined,
    guests: raw.personCapacity,
    beds: raw.bedsNumber,
    baths: raw.bathroomsNumber,
    tag: raw.listingTags[0]?.name,
    city: raw.city ?? undefined,
    lat: raw.lat,
    lng: raw.lng,
    bedrooms: raw.bedroomsNumber,
    description: (raw.description ?? "")
      .split(/\r?\n+/)
      .map(cleanDescriptionLine)
      .filter(Boolean),
    allAmenities: amenityNames,
    houseRules: raw.houseRules?.trim() || null,
    checkIn: formatHour(raw.checkInTimeStart),
    checkOut: formatHour(raw.checkOutTime),
    petsAllowed: amenityNames.some((n) => /pet/i.test(n)),
    smokingAllowed: amenityNames.some((n) => /smoking allowed/i.test(n)),
    cancellationPolicy: formatCancellationPolicy(policy),
    reviews: reviewsWithText,
    price: raw.price,
    currency: raw.currencyCode ?? "USD",
    cleaningFee: raw.cleaningFee,
    minNights: raw.minNights,
    guestsIncluded: raw.guestsIncluded,
    extraGuestFee: raw.priceForExtraPerson,
  };
}

export const getListings = cache(async (): Promise<Listing[]> => {
  const [rawListings, policies, reviews] = await Promise.all([
    fetchListings(),
    fetchCancellationPolicies(),
    fetchReviews(),
  ]);

  const policyById = new Map(policies.map((p) => [p.id, p]));

  return rawListings.map((raw) =>
    mapListing(raw, policyById.get(raw.cancellationPolicyId ?? -1), reviews)
  );
});

export async function getListing(id: string): Promise<Listing | undefined> {
  const all = await getListings();
  return all.find((l) => l.id === id);
}

export type BookingPriceBreakdown = {
  nights: number;
  nightlyTotal: number;
  cleaningFee: number;
  extraGuests: number;
  extraGuestTotal: number;
  total: number;
};

// Shared by the booking widget (display) and the checkout API route
// (server-side recompute, so a client can't tamper with the charged
// amount) — keeping one source of truth for the math.
//
// `nightlyTotal` is the real sum of Hostaway's per-day rates for the
// selected nights (weekends/seasons can price differently from the
// listing's base rate) — pass it whenever real calendar prices are
// available. Falls back to nights × the listing's base price only when
// they aren't (e.g. calendar temporarily unreachable).
export function computeBookingTotal(
  listing: Listing,
  nights: number,
  guests: number,
  nightlyTotal?: number | null
): BookingPriceBreakdown | null {
  if (nights <= 0) return null;
  const resolvedNightlyTotal =
    nightlyTotal ?? (listing.price !== null ? listing.price * nights : null);
  if (resolvedNightlyTotal === null) return null;
  const cleaningFee = listing.cleaningFee ?? 0;
  const extraGuests =
    listing.guestsIncluded !== null ? Math.max(0, guests - listing.guestsIncluded) : 0;
  const extraGuestTotal = extraGuests * (listing.extraGuestFee ?? 0) * nights;
  return {
    nights,
    nightlyTotal: resolvedNightlyTotal,
    cleaningFee,
    extraGuests,
    extraGuestTotal,
    total: resolvedNightlyTotal + cleaningFee + extraGuestTotal,
  };
}

export function getCities(listings: Listing[]): string[] {
  return Array.from(new Set(listings.map((l) => l.city).filter((c): c is string => !!c)));
}

// Amenities present on every listing — safe to advertise site-wide, unlike
// amenities only some homes have.
export function getCommonAmenities(listings: Listing[]): string[] {
  if (listings.length === 0) return [];
  const [first, ...rest] = listings.map((l) => new Set(l.allAmenities));
  return Array.from(first).filter((amenity) => rest.every((set) => set.has(amenity)));
}

export function getAverageRating(listings: Listing[]): string {
  const rated = listings.filter((l) => l.rating !== "New");
  if (rated.length === 0) return "New";
  return (
    rated.reduce((sum, l) => sum + parseFloat(l.rating), 0) / rated.length
  ).toFixed(1);
}

export function getTotalReviews(listings: Listing[]): number {
  return listings.reduce((sum, l) => sum + (l.reviewCount ?? 0), 0);
}
