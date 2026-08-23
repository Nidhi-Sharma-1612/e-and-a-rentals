# E&A Rentals

Marketing and listings website for **E&A Rentals**, a family-run vacation
rental business with pet-friendly cottages across Texas and the Southwest.
Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The
page auto-updates as you edit files under `src/`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Tech stack

- **Next.js 16** (App Router) — server components, `generateStaticParams`,
  `generateMetadata`, and file-convention routes (`sitemap.ts`, `robots.ts`,
  `not-found.tsx`, `icon.tsx`)
- **TypeScript**
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **lucide-react** for icons

## Project structure

```
src/
  app/
    page.tsx                 Homepage (hero, listings, amenities, testimonials, FAQ)
    layout.tsx                Root layout, fonts, site-wide metadata
    listings/[id]/page.tsx    Individual listing detail pages
    privacy-policy/           Legal pages
    terms-and-conditions/
    cookie-preferences/
    sitemap.ts, robots.ts     SEO file conventions
    not-found.tsx             Branded 404 page
    icon.tsx                  Generated favicon
  components/                 UI building blocks (Hero, Listings, BookingWidget, Footer, ...)
  hooks/                       Shared hooks (useOutsideClose, useActiveSection)
  lib/                         Listing data, site constants, amenity/date/nav helpers
```
