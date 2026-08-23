"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, BedDouble, Bath, ArrowRight, X } from "lucide-react";
import { listings, type Listing } from "@/lib/listings";
import Reveal from "./Reveal";
import { useSearchFilter } from "./SearchFilterProvider";

export default function Listings() {
  const { filter, clearFilter } = useSearchFilter();

  const filtered = listings.filter((listing) => {
    if (filter?.location && listing.city !== filter.location) return false;
    if (filter?.guests && listing.guests < filter.guests) return false;
    return true;
  });

  return (
    <section id="listings" className="scroll-mt-16 px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-7 md:gap-11">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:tracking-[0.2em]">
            Our homes
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            Pick your home base
          </h2>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-base">
            Every home comes with free WiFi, a full kitchen, and air
            conditioning — because comfort shouldn&apos;t be optional.
          </p>
        </Reveal>

        {filter && (
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-wood/30 bg-cream-2 px-4 py-3 text-sm">
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
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            {filtered.map((listing, index) => (
              <Reveal key={listing.id} style={{ transitionDelay: `${index * 90}ms` }}>
                <ListingCard listing={listing} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-wood/35 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(43,33,24,0.14)]"
    >
      <div className="relative h-[200px] w-full md:h-65">
        <Image
          src={listing.image}
          alt={`${listing.name} — ${listing.beds} bedroom home${listing.city ? ` in ${listing.city}` : ""}`}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1.5 text-[12.5px] font-bold text-ink md:right-3.5 md:top-3.5">
          <Star className="h-3 w-3 fill-terracotta text-terracotta md:h-3.5 md:w-3.5" />
          {listing.rating}
        </span>
        {listing.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-sage/95 px-2.5 py-1 text-[11px] font-bold text-card md:left-3.5 md:top-3.5">
            {listing.tag}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4.5 pb-4.5 pt-4 md:gap-3 md:px-5.5 md:pb-5.5 md:pt-5">
        <h3 className="font-heading text-[17px] font-semibold md:text-[19px]">
          {listing.name}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-ink-soft md:gap-4 md:text-sm">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.guests} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.beds} beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
            {listing.baths} baths
          </span>
        </div>
        <span className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-bold text-denim md:text-sm">
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
