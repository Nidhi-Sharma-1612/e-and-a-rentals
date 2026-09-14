import Image from "next/image";
import { Star, Home as HomeIcon, type LucideIcon } from "lucide-react";
import { getAverageRating, getCities, type Listing } from "@/lib/listings";
import Reveal from "./Reveal";
import Highlight from "./Highlight";

export default function About({ listings }: { listings: Listing[] }) {
  const averageRating = getAverageRating(listings);
  const cities = getCities(listings);
  const citiesLabel =
    cities.length >= 2
      ? `from ${cities[0]} to ${cities[cities.length - 1]}`
      : cities.length === 1
        ? `in ${cities[0]}`
        : "across Texas";
  return (
    <section
      id="about"
      className="relative scroll-mt-16 overflow-hidden border-t border-wood/25 bg-cream md:scroll-mt-21"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[22px_22px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-16 md:py-24">
        <Reveal className="max-w-2xl">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-sage-dark md:tracking-[0.2em]">
            About us
          </span>
          <h2 className="mt-3 font-heading text-[32px] font-bold leading-[1.08] md:text-[52px]">
            Book direct. Get treated like <Highlight>VIP</Highlight>.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-12 md:mt-14 md:grid-cols-12 md:items-start md:gap-8">
          <Reveal variant="left" className="flex flex-col gap-4 md:col-span-7">
            <p className="text-[15px] leading-relaxed text-ink-soft md:text-[16.5px]">
              Book VIP Homes is a small, family-run collection of homes —
              three and four bedrooms, room for the whole group, and a host
              who answers his own email. No call centers, no faceless
              platforms — just a direct line to your stay and the VIP
              treatment that comes with it.
            </p>
            <p className="text-[15px] leading-relaxed text-ink-soft md:text-[16.5px]">
              Our homes are spread across Texas, {citiesLabel} — each one a
              genuine All-American cottage with room to spread out, a full
              kitchen, and air conditioning that actually keeps up with the
              heat. Traveling with pets or need more than a
              weekend? Some homes are pet-friendly and set up for extended
              stays, because VIP treatment shouldn&apos;t stop after one
              night.
            </p>
            <p className="text-[15px] leading-relaxed text-ink-soft md:text-[16.5px]">
              Questions before you book? Eddie reads every message at{" "}
              <a
                href="mailto:eddie@bookviphomes.com"
                className="font-semibold text-denim hover:text-denim-dark"
              >
                eddie@bookviphomes.com
              </a>
              .
            </p>

            <div className="mt-4 flex flex-wrap gap-4">
              <Stat
                icon={Star}
                iconClassName="fill-terracotta text-terracotta"
                value={averageRating}
                label="avg. guest rating"
              />
              <Stat
                icon={HomeIcon}
                iconClassName="text-denim"
                value={listings.length}
                label="homes to choose from"
              />
            </div>
          </Reveal>

          <Reveal variant="right" className="relative mx-auto mb-8 w-full max-w-md md:col-span-5 md:mb-10">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md border border-wood/30 shadow-[0_26px_54px_rgba(25,21,33,0.18)]">
              <Image
                src="/images/cottage2-a.jpg"
                alt="An All American Cottage exterior with a flag by the front door"
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="photo-grade object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-wood/30 bg-card px-4 py-3 shadow-lg md:-bottom-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md bg-terracotta font-heading text-sm font-bold text-card">
                VIP
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-ink">Eddie</span>
                <span className="text-xs text-muted">Your host</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  iconClassName,
  value,
  label,
}: {
  icon: LucideIcon;
  iconClassName: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-wood/30 bg-card py-2 pl-2 pr-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-2">
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-heading text-base font-bold text-ink">{value}</span>
        <span className="text-[11px] font-semibold text-muted">{label}</span>
      </div>
    </div>
  );
}
