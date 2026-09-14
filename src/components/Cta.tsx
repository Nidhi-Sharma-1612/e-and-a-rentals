import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, Sparkles, Star } from "lucide-react";
import Reveal from "./Reveal";
import { getAverageRating, getTotalReviews, type Listing } from "@/lib/listings";

export default function Cta({ listings }: { listings: Listing[] }) {
  const averageRating = getAverageRating(listings);
  const totalReviews = getTotalReviews(listings);
  return (
    <section className="relative overflow-hidden bg-cream-2 px-5 py-14 md:px-16 md:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[22px_22px]"
      />

      <Reveal
        variant="scale"
        className="relative mx-auto max-w-6xl overflow-hidden rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card shadow-[0_24px_48px_rgba(43,33,24,0.14)] md:grid md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative flex flex-col justify-center gap-5 overflow-hidden px-7 py-12 text-center md:px-12 md:py-16 md:text-left">
          <div
            aria-hidden="true"
            className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-terracotta/10 blur-3xl"
          />

          <span className="relative mx-auto flex w-fit items-center gap-2 rounded-full border border-terracotta/25 bg-terracotta/10 px-4 py-1.5 font-ui text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:mx-0">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Ready when you are
          </span>

          <h2 className="relative text-balance font-heading text-[30px] font-bold leading-[1.1] text-ink md:text-[42px]">
            Book Direct. <span className="text-terracotta">Stay VIP.</span>
          </h2>

          <p className="relative max-w-md text-[14.5px] leading-relaxed text-ink-soft md:text-base">
            Browse our homes, pick your dates, and let Eddie take it from
            there — no call centers, no middlemen, just the VIP treatment
            every guest deserves.
          </p>

          <div className="relative mx-auto flex items-center gap-1.5 text-[13px] font-semibold text-muted md:mx-0">
            <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
            {averageRating} average · {listings.length} homes across Texas
          </div>

          <div className="relative mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link
              href="/properties"
              className="group flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 font-ui text-sm font-semibold text-card transition-colors hover:bg-terracotta-dark"
            >
              Browse our homes
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-wood/50 px-7 py-3.5 font-ui text-sm font-semibold text-ink-soft transition-colors hover:border-wood hover:bg-cream-2"
            >
              <Mail className="h-4 w-4" strokeWidth={2} />
              Contact
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-80 md:block">
          <Image
            src="/images/lucile-e.jpg"
            alt="Cozy living room interior at one of our furnished VIP homes"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="photo-grade object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-card/60 via-transparent to-transparent" />
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1.5 text-[12.5px] font-bold text-ink shadow-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
            {totalReviews > 0 ? `${totalReviews} guest reviews` : `${averageRating} avg rating`}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
