# Book VIP Homes — improvement backlog

From a full homepage UI/UX/accessibility/code-quality audit. Grouped by
priority. Check items off as they're done.

## Outstanding

None currently.

## Completed

- [x] **Real pricing, date-aware.** Hostaway/Stripe integration replaced
      "Contact for pricing" with real per-listing rates. Prices are fetched
      per selected date range (Hostaway prices weekends/seasons
      differently from a listing's base rate), shown in the booking
      widget's breakdown, and charged via Stripe Checkout using that same
      real total — never a flat base-price × nights guess.
- [x] **Hostaway integration** — live listings, availability calendars,
      reviews, and amenities replace all static/placeholder content
      site-wide (`src/lib/hostaway.ts`, `src/lib/listings.ts`).
- [x] **Stripe Checkout** — booking widget creates a real Checkout Session
      server-side (secret key only, no webhook dependency); a
      `booking-confirmed` page verifies payment via session retrieval.
- [x] **Dedicated `/properties` search results page** — the homepage
      search widget now navigates here with real query params (shareable
      URL) instead of filtering an in-page section; results are checked
      against live availability, not just location/guest count.
- [x] **Contact page** — replaced the header/footer "Contact" mailto
      shortcut with a real `/contact` page (form + direct info).

- [x] **Focus states** — added a site-wide `:focus-visible` outline
      (terracotta-dark, 2px) covering every link/button/input, instead of
      relying on inconsistent browser defaults.
- [x] **`text-muted` contrast** — darkened the token (#8a7458 → #75634b);
      now 4.7–5.7:1 against every background it's used on, up from a
      3.6–4.4:1 fail. Fixed at the token level, so all 24 usages resolved
      at once.
- [x] **`text-denim` contrast** — darkened the token (#5d92c4 → #466e93,
      now 4.9–5.3:1) and shifted `denim-dark` darker to keep a visible
      hover step. Fixes "View listing"/"View home" link text.
- [x] **`text-terracotta` at small sizes** — switched the 9 small-text
      uses (eyebrow labels, FAQ active-question text, active nav state)
      to `terracotta-dark` (5.2–6.3:1); left large stat numbers, buttons,
      and icons on the original terracotta, since those already clear the
      relevant contrast thresholds.
- [x] **Open Graph / Twitter Card metadata** — added site-wide defaults
      (`layout.tsx`) plus per-listing metadata using each listing's real
      cover photo. Verified real `<meta property="og:*">` tags render with
      absolute URLs.
- [x] **Favicon** — replaced the untouched default Next.js icon with a
      generated one matching the site's "E&A" monogram badge (`icon.tsx`).
- [x] **Escape closes booking popovers** — extracted a shared
      `useOutsideClose` hook (outside-click *and* Escape) used by every
      popover in both booking widgets; verified on Check-in, Check-out,
      Guests, and Location.
- [x] **FAQ questions in heading tags** — each question button is now
      wrapped in an `<h4>` (spec-correct pattern: heading wraps the
      control, doesn't nest inside it). Verified accordion still functions.
- [x] **Skip-to-content link** — added, jumps to `id="main-content"` on
      every page; verified it appears on first Tab and the jump works.
- [x] **Listing image alt text** — now includes bed count and city
      ("All American Cottage — 3 bedroom home in Wichita Falls"), so the
      two same-named listings are distinguishable.
- [x] **BookingWidget / ListingBookingWidget duplication** — extracted
      `useOutsideClose` (shared open/close + Escape logic) and
      `GuestStepper` (shared popover markup) into their own files; both
      widgets now compose them instead of duplicating ~150 lines each.
- [x] **Hero search now actually filters listings** — added
      `SearchFilterProvider` (React context); "Search stays" applies the
      selected location + guest count, `Listings` filters against real
      data, with a "Showing X of 4 homes" summary, a clear-filters
      control, and an honest empty state. Verified: location-only filter,
      combined filter producing zero matches, and both clear paths.
- [x] **"Select homes" amenity tags** — upgraded from a plain 11px caption
      to a bordered pill badge, using `ink-soft` (passes contrast) instead
      of `muted`.
- [x] **sitemap.xml, robots.txt, not-found.tsx** — added, all using a new
      `lib/site.ts` constant as the single source of truth for the domain.
      Verified all three serve correctly.
- [x] **Copy: "crew" repetition** — hero eyebrow changed to "Sun-warmed
      stays, Southwest style" so it no longer echoes the headline.
- [x] **Testimonial carousel pause/play control** — added an explicit
      toggle next to the dots (not just implicit hover-pause), so
      first-time visitors can see and control autoplay state.
- [x] **Client-component audit** — reviewed all 10; each genuinely needs
      state/effects/event handlers. None converted — no server-component
      candidates found.
- [x] **Image loading priority** — confirmed correct: only the Hero photo
      and gallery cover image (both above-the-fold LCP candidates) use
      `priority`. The About section photo is intentionally *not*
      prioritized since it's below the fold — adding `priority` there
      would hurt, not help, load performance.
- [x] CTA/FAQ section merged into one visual panel with consistent
      background (was a two-tone split that nearly vanished against the
      section background).
