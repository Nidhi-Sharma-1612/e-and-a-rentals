# Book VIP Homes

Marketing, listings, and direct-booking website for **Book VIP Homes**, the
furnished rental division of Valencia Investment Properties — pet-friendly
homes across Texas, with more markets planned. Built with Next.js (App
Router), TypeScript, and Tailwind CSS v4. Listings, availability, and
pricing are live from Hostaway; payment is handled by Stripe Checkout.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real Hostaway + Stripe keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The
page auto-updates as you edit files under `src/`.

Without real keys in `.env.local` the site still runs, but listing data,
availability, and checkout will fail.

### Environment variables

| Variable | Required for | Where to get it |
| --- | --- | --- |
| `HOSTAWAY_ACCOUNT_ID` | Listings, availability, pricing, reviews | Hostaway dashboard → Settings → API |
| `HOSTAWAY_API_KEY` | same as above | Hostaway dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Creating Checkout Sessions, verifying payment on the confirmation page | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Reserved for client-side Stripe (e.g. an embedded Elements form) — not currently read by any code path | same as above |

All four live in `.env.local` (gitignored) — see `.env.example` for the
template. Use Stripe's **test mode** keys (`sk_test_...` / `pk_test_...`)
for local development; only use live keys against a deployment guests will
actually pay through.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Features

- **Live listings** — property details, photos, amenities, house rules,
  and guest reviews pulled from Hostaway, not hardcoded
- **Real availability & pricing** — the booking calendar and price
  breakdown reflect each listing's actual Hostaway calendar, including
  per-date rate variation (weekends/seasons), not a flat nightly guess
- **Search** — the homepage widget searches by location/dates/guests and
  lands on `/properties`, a shareable URL whose results are checked
  against live availability (not just location/guest count)
- **Direct booking** — Stripe Checkout end to end, with a confirmation
  page that verifies payment by retrieving the session (no webhook
  dependency)
- **Approximate-area map** — a Leaflet map with a privacy-conscious
  jittered radius instead of an exact pin, since the real address is only
  shared after booking

## Tech stack

- **Next.js 16** (App Router) — server components, `generateStaticParams`,
  `generateMetadata`, and file-convention routes (`sitemap.ts`, `robots.ts`,
  `not-found.tsx`, `icon.tsx`)
- **TypeScript**
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **Hostaway API** — source of truth for listings, availability calendars,
  reviews, and amenities (`src/lib/hostaway.ts`)
- **Stripe Checkout** — booking payment; server-side session creation only,
  no webhook dependency (fulfillment is verified by retrieving the session
  on the confirmation page)
- **Leaflet + OpenStreetMap** — the approximate-area map on listing pages
- **lucide-react** for icons

## Project structure

```
src/
  app/
    page.tsx                          Homepage (hero, listings, amenities, testimonials, FAQ)
    layout.tsx                        Root layout, fonts, site-wide metadata
    properties/page.tsx               Search results (real availability-checked listings)
    listings/[id]/page.tsx            Individual listing detail + booking widget
    listings/[id]/booking-confirmed/  Post-checkout confirmation (verifies Stripe session)
    contact/page.tsx                  Contact page
    api/checkout/route.ts             Creates a Stripe Checkout Session
    api/hostaway/calendar/            Availability (+ per-date pricing) proxy routes
    privacy-policy/, terms-and-conditions/, cookie-preferences/   Legal pages
    sitemap.ts, robots.ts             SEO file conventions
    not-found.tsx                     Branded 404 page
    icon.tsx                          Generated favicon
  components/                         UI building blocks (Hero, Listings, BookingWidget, ListingMap, ...)
  hooks/                              Shared hooks (useOutsideClose, useActiveSection, useActiveNavHref)
  lib/                                Hostaway/Stripe clients, listing mapping, site constants, helpers
```
