"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, BedDouble, Bath, ArrowRight, X, Sparkles, MapPin, PawPrint } from "lucide-react";
import { listings, type Listing } from "@/lib/listings";
import Reveal from "./Reveal";
import Highlight from "./Highlight";
import { useSearchFilter } from "./SearchFilterProvider";

export default function Listings() {
  const { filter, clearFilter } = useSearchFilter();

  const filtered = listings.filter((listing) => {
    if (filter?.location && listing.city !== filter.location) return false;
    if (filter?.guests && listing.guests < filter.guests) return false;
    return true;
  });

  const [featured, ...rest] = filtered;

  return (
    <section
      id="listings"
      className="relative scroll-mt-16 overflow-hidden bg-cream-2 px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[24px_24px]"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-7 md:gap-11">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-sage-dark md:tracking-[0.2em]">
            Our homes
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            Pick your <Highlight>home base</Highlight>
          </h2>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-base">
            Every home comes with free WiFi, a full kitchen, and air
            conditioning — because comfort shouldn&apos;t be optional.
          </p>
        </Reveal>

        {filter && (
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-wood/30 bg-card px-4 py-3 text-sm">
            <span className="text-ink-soft">
              Showing {filtered.length} of {listings.length} homes
              {filter.location ? ` in ${filter.location}` : ""}
              {filter.guests > 1 ? ` for ${filter.guests}+ guests` : ""}
            </span>
            <button
              type="button"
              onClick={clearFilter}
              className="flex items-center gap-1 font-semibold text-denim hover:text-denim-dark"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.2} />
              Clear filters
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 rounded-2xl border border-wood/30 bg-card py-14 text-center">
            <p className="text-ink-soft">No homes match your search right now.</p>
            <button
              type="button"
              onClick={clearFilter}
              className="font-semibold text-denim hover:text-denim-dark"
            >
              Clear filters and see all homes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            <Reveal>
              <FeaturedListingCard listing={featured} />
            </Reveal>

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-7">
                {rest.map((listing, index) => (
                  <Reveal key={listing.id} style={{ transitionDelay: `${index * 90}ms` }}>
                    <ListingCard listing={listing} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group grid grid-cols-1 overflow-hidden rounded-tl-4xl rounded-br-4xl rounded-tr-2xl rounded-bl-2xl border border-wood/35 bg-card transition-all duration-300 hover:shadow-[0_24px_48px_rgba(26,22,17,0.16)] md:grid-cols-[1.2fr_1fr]"
    >
      <div className="relative h-60 w-full overflow-hidden md:h-full md:min-h-80">
        <Image
          src={listing.image}
          alt={`${listing.name} — ${listing.beds} bedroom home${listing.city ? ` in ${listing.city}` : ""}`}
          fill
          priority
          sizes="(min-width: 768px) 60vw, 100vw"
          className="photo-grade object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Featured stay
          </span>
          {listing.tag && (
            <span className="min-w-0 truncate rounded-full bg-sage/95 px-3 py-1.5 text-[11px] font-bold text-card backdrop-blur-sm">
              {listing.tag}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 px-6 py-6 md:gap-4 md:px-9 md:py-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-terracotta-dark">
            <Star className="h-3.5 w-3.5 fill-terracotta-dark text-terracotta-dark" />
            {listing.rating}
            {listing.reviewCount ? (
              <span className="font-medium text-muted">
                ({listing.reviewCount} review{listing.reviewCount === 1 ? "" : "s"})
              </span>
            ) : null}
          </span>
          {listing.city && (
            <span className="flex items-center gap-1 text-[13px] font-medium text-muted">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              {listing.city}
            </span>
          )}
        </div>
        <h3 className="font-heading text-2xl font-bold leading-tight md:text-[32px]">
          {listing.name}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-sage" strokeWidth={2} />
            {listing.guests} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-sage" strokeWidth={2} />
            {listing.beds} beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-sage" strokeWidth={2} />
            {listing.baths} baths
          </span>
          {listing.petsAllowed && (
            <span className="flex items-center gap-1.5">
              <PawPrint className="h-4 w-4 text-sage" strokeWidth={2} />
              Pet friendly
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-[14.5px] leading-relaxed text-ink-soft">
          {listing.description[0]}
        </p>
        <span className="mt-1 flex w-fit items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-card transition-colors group-hover:bg-terracotta-dark">
          View this home
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2.2}
          />
        </span>
      </div>
    </Link>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border border-wood/35 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(26,22,17,0.14)]"
    >
      <div className="relative h-47.5 w-full overflow-hidden md:h-52">
        <Image
          src={listing.image}
          alt={`${listing.name} — ${listing.beds} bedroom home${listing.city ? ` in ${listing.city}` : ""}`}
          fill
          sizes="(min-width: 768px) 420px, 100vw"
          className="photo-grade object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-1.5 md:inset-x-3.5 md:top-3.5">
          {listing.tag ? (
            <span className="min-w-0 truncate rounded-full bg-sage/95 px-2.5 py-1 text-[11px] font-bold text-card">
              {listing.tag}
            </span>
          ) : (
            <span />
          )}
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-card/95 px-2.5 py-1.5 text-[12.5px] font-bold text-ink">
            <Star className="h-3 w-3 fill-terracotta text-terracotta md:h-3.5 md:w-3.5" />
            {listing.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4.5 pb-4.5 pt-4 md:gap-3 md:px-5 md:pb-5 md:pt-4.5">
        <h3 className="font-heading text-[16.5px] font-semibold md:text-[18px]">
          {listing.name}
        </h3>
        {listing.city && (
          <span className="-mt-1.5 flex items-center gap-1 text-[12px] font-medium text-muted md:text-[12.5px]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {listing.city}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-ink-soft md:gap-3 md:text-[13.5px]">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.guests}
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.baths}
          </span>
          {listing.petsAllowed && (
            <PawPrint
              className="h-3.5 w-3.5 text-sage"
              strokeWidth={2}
              aria-label="Pet friendly"
            />
          )}
        </div>
        <span className="mt-0.5 flex items-center gap-1.5 text-[13px] font-bold text-denim md:text-[13.5px]">
          View listing
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            strokeWidth={2.2}
          />
        </span>
      </div>
    </Link>
  );
}
