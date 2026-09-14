// Server-only Hostaway API client. Never import this from a "use client"
// file — it reads HOSTAWAY_API_KEY, which must not reach the browser bundle.

const API_BASE = "https://api.hostaway.com/v1";

export type HostawayImage = {
  url: string;
  sortOrder: number;
  caption: string;
};

export type HostawayAmenity = {
  amenityId: number;
  amenityName: string;
};

export type HostawayListing = {
  id: number;
  name: string;
  externalListingName: string;
  description: string | null;
  city: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  price: number | null;
  currencyCode: string | null;
  cleaningFee: number | null;
  personCapacity: number;
  guestsIncluded: number | null;
  priceForExtraPerson: number | null;
  bedroomsNumber: number;
  bedsNumber: number;
  bathroomsNumber: number;
  averageReviewRating: number | null;
  houseRules: string | null;
  checkInTimeStart: number | null;
  checkOutTime: number | null;
  cancellationPolicyId: number | null;
  minNights: number | null;
  listingImages: HostawayImage[];
  listingAmenities: HostawayAmenity[];
  listingTags: { name: string }[];
};

export type HostawayCalendarDay = {
  date: string;
  isAvailable: 0 | 1;
  status: string;
  // The nightly rate for this specific date — Hostaway supports per-day
  // pricing (weekends, seasons, etc), so this can differ from the
  // listing's base `price`.
  price: number;
};

export type HostawayCancellationPolicyItem = {
  refundAmount: number;
  refundType: string;
  timeDelta: number;
  event: string;
};

export type HostawayCancellationPolicy = {
  id: number;
  name: string;
  cancellationPolicyItem: HostawayCancellationPolicyItem[];
};

export type HostawayReview = {
  id: number;
  listingMapId: number;
  guestName: string;
  reviewerName: string | null;
  publicReview: string | null;
  rating: number | null;
  departureDate: string;
  type: string;
  status: string;
};

let cachedToken: { value: string; fetchedAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken.value;

  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) {
    throw new Error(
      "Missing HOSTAWAY_ACCOUNT_ID / HOSTAWAY_API_KEY environment variables"
    );
  }

  const res = await fetch(`${API_BASE}/accessTokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-control": "no-cache",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: accountId,
      client_secret: apiKey,
      scope: "general",
    }),
    // Tokens are long-lived (~2 years); no need to re-fetch per request.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Hostaway auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = { value: data.access_token, fetchedAt: Date.now() };
  return cachedToken.value;
}

async function hostawayFetch<T>(
  path: string,
  options: { revalidate?: number; params?: Record<string, string> } = {}
): Promise<T> {
  const token = await getAccessToken();
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-control": "no-cache",
    },
    next: { revalidate: options.revalidate ?? 3600 },
  });

  if (!res.ok) {
    throw new Error(`Hostaway request failed (${path}): ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(`Hostaway request failed (${path}): ${JSON.stringify(data)}`);
  }
  return data.result as T;
}

export async function fetchListings(): Promise<HostawayListing[]> {
  return hostawayFetch<HostawayListing[]>("/listings", {
    params: { limit: "100" },
    revalidate: 3600,
  });
}

export async function fetchListingCalendar(
  listingId: string,
  startDate: string,
  endDate: string
): Promise<HostawayCalendarDay[]> {
  return hostawayFetch<HostawayCalendarDay[]>(`/listings/${listingId}/calendar`, {
    params: { startDate, endDate },
    // Availability changes often — keep this fresh.
    revalidate: 300,
  });
}

// Shared by the checkout route (reject a conflicting booking) and the
// properties search page (exclude a listing that can't actually be booked
// for the searched dates) — one place that defines "booked" for a range.
export function hasCalendarConflict(days: HostawayCalendarDay[], beforeDate: string): boolean {
  return days.some((day) => day.date < beforeDate && !day.isAvailable);
}

export async function fetchCancellationPolicies(): Promise<HostawayCancellationPolicy[]> {
  return hostawayFetch<HostawayCancellationPolicy[]>("/cancellationPolicies", {
    revalidate: 3600,
  });
}

// The reviews endpoint ignores listingMapId as a server-side filter, so we
// fetch a batch and filter/group client-side.
export async function fetchReviews(): Promise<HostawayReview[]> {
  const [first, second] = await Promise.all([
    hostawayFetch<HostawayReview[]>("/reviews", {
      params: { limit: "500", offset: "0" },
      revalidate: 3600,
    }),
    hostawayFetch<HostawayReview[]>("/reviews", {
      params: { limit: "500", offset: "500" },
      revalidate: 3600,
    }),
  ]);
  return [...first, ...second];
}
