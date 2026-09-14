import {
  Wifi,
  ChefHat,
  Snowflake,
  WashingMachine,
  Fan,
  Heater,
  ParkingCircle,
  Droplets,
  Home as HomeIcon,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import Highlight from "./Highlight";
import { getCommonAmenities, type Listing } from "@/lib/listings";

const ICONS: Record<string, LucideIcon> = {
  "Free WiFi": Wifi,
  Kitchen: ChefHat,
  "Air conditioning": Snowflake,
  "Washing Machine": WashingMachine,
  Dryer: Fan,
  Heating: Heater,
  "Free parking": ParkingCircle,
  "Hot water": Droplets,
};

const ACCENTS: ("terracotta" | "sage" | "denim")[] = ["terracotta", "sage", "denim"];
const accentClasses = {
  terracotta: { icon: "text-terracotta", bg: "bg-terracotta/10" },
  sage: { icon: "text-sage", bg: "bg-sage/10" },
  denim: { icon: "text-denim", bg: "bg-denim/10" },
};

const MAX_SHOWN = 6;

// Guest-facing highlights first — the full common set also includes things
// like "First aid kit" and "Baking sheet" that are true but not what
// someone browsing homes cares about seeing first.
const PREFERRED_ORDER = [
  "Free WiFi",
  "Kitchen",
  "Air conditioning",
  "Washing Machine",
  "Dryer",
  "Heating",
  "Free parking",
  "Hot water",
];

export default function Amenities({ listings }: { listings: Listing[] }) {
  const rawCommon = getCommonAmenities(listings);
  // "Internet" and "Wireless" both mean WiFi in Hostaway's amenity list —
  // collapse them into one tile instead of showing the same thing twice.
  const hasWifi = rawCommon.includes("Internet") || rawCommon.includes("Wireless");
  const common = [
    ...(hasWifi ? ["Free WiFi"] : []),
    ...rawCommon.filter((a) => a !== "Internet" && a !== "Wireless"),
  ]
    .sort((a, b) => {
      const ai = PREFERRED_ORDER.indexOf(a);
      const bi = PREFERRED_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .slice(0, MAX_SHOWN);
  if (common.length === 0) return null;

  return (
    <section
      id="amenities"
      className="relative scroll-mt-16 overflow-hidden bg-cream px-5 py-16 md:scroll-mt-21 md:px-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[22px_22px]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-12 md:gap-16">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-sage-dark md:tracking-[0.2em]">
            What&apos;s included
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            The comforts of <Highlight>home</Highlight>, every time.
          </h2>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-base">
            Every VIP home comes stocked with the essentials — plus a few
            extras at select properties.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
          {common.map((label, index) => {
            const Icon = ICONS[label] ?? HomeIcon;
            const accent = accentClasses[ACCENTS[index % ACCENTS.length]];
            return (
              <Reveal key={label} variant="scale" style={{ transitionDelay: `${index * 70}ms` }}>
                <div className="group flex h-full flex-col items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card px-4 py-7 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(26,22,17,0.1)]">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accent.bg} transition-transform duration-300 ease-out group-hover:-translate-y-0.5`}
                  >
                    <Icon className={`h-5.5 w-5.5 ${accent.icon}`} strokeWidth={1.8} />
                  </div>
                  <span className="font-heading text-[14.5px] font-semibold leading-tight md:text-base">
                    {label}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
