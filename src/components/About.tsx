import Image from "next/image";
import { Star, Home as HomeIcon, type LucideIcon } from "lucide-react";
import { averageRating, listings } from "@/lib/listings";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-16 overflow-hidden border-t border-wood/25 bg-cream-2 md:scroll-mt-21"
    >
      <Reveal className="mx-auto grid max-w-[1312px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-[1fr_1.15fr] md:gap-16 md:px-16 md:pb-20 md:pt-16">
        <div className="relative">
          <div
            className="absolute -bottom-5 -left-5 h-full w-full rounded-tl-2xl rounded-br-[3.5rem] rounded-tr-[3.5rem] rounded-bl-2xl bg-terracotta/15 md:-bottom-7 md:-left-7"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-tl-2xl rounded-br-[3.5rem] rounded-tr-[3.5rem] rounded-bl-2xl border border-wood/30 shadow-[0_22px_48px_rgba(43,33,24,0.2)]">
            <Image
              src="/images/cottage2-a.jpg"
              alt="An All American Cottage exterior with a flag by the front door"
              fill
              sizes="(min-width: 768px) 620px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl border border-wood/30 bg-card px-4 py-3 shadow-lg md:-right-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-sm font-bold text-card">
              E&amp;A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink">Eddie</span>
              <span className="text-xs text-muted">Your host</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-2 md:pt-0">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:tracking-[0.2em]">
            About us
          </span>
          <h2 className="font-heading text-[27px] font-bold leading-tight md:text-4xl">
            A real host, not a call center.
          </h2>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-[15.5px]">
            E&amp;A Rentals is a small, family-run collection of homes —
            three and four bedrooms, room for the whole group, and a host who
            answers his own email.
          </p>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-[15.5px]">
            Our homes are spread across Texas, from El Paso to Wichita Falls
            — each one a genuine All-American cottage with room to spread
            out, a full kitchen, and air conditioning that actually keeps up
            with the heat. Traveling with pets or need more than a weekend?
            Some homes are pet-friendly and set up for extended stays.
          </p>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-[15.5px]">
            Questions before you book? Eddie reads every message at{" "}
            <a
              href="mailto:eddie@eandarentals.com"
              className="font-semibold text-denim hover:text-denim-dark"
            >
              eddie@eandarentals.com
            </a>
            .
          </p>

          <div className="flex items-center gap-3 pt-2 md:gap-4">
            <Stat
              icon={Star}
              iconClassName="fill-terracotta text-terracotta"
              value={averageRating}
              label="avg. guest rating"
              color="text-terracotta"
            />
            <Stat
              icon={HomeIcon}
              iconClassName="text-denim"
              value={listings.length}
              label="homes to choose from"
              color="text-denim"
            />
          </div>
        </div>
      </Reveal>

      <svg
        className="absolute inset-x-0 bottom-0 h-10 w-full text-cream md:h-16"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,90 480,0 720,20 C960,40 1200,90 1440,50 L1440,100 L0,100 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

function Stat({
  icon: Icon,
  iconClassName,
  value,
  label,
  color,
}: {
  icon: LucideIcon;
  iconClassName: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-wood/30 bg-card px-5 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md md:px-6 md:py-4">
      <span className={`flex items-center gap-1.5 font-heading text-xl font-bold md:text-2xl ${color}`}>
        {value}
        <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconClassName}`} />
      </span>
      <span className="text-center text-[11px] font-semibold text-muted md:text-[12px]">
        {label}
      </span>
    </div>
  );
}
