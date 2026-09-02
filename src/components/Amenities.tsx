import { Wifi, ChefHat, Snowflake, WashingMachine, Waves, PawPrint, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import Highlight from "./Highlight";

type Amenity = {
  icon: LucideIcon;
  label: string;
  accent: "terracotta" | "sage" | "denim";
};

const amenities: Amenity[] = [
  { icon: Wifi, label: "Free WiFi", accent: "terracotta" },
  { icon: ChefHat, label: "Full Kitchen", accent: "sage" },
  { icon: Snowflake, label: "Air Conditioning", accent: "denim" },
  { icon: WashingMachine, label: "Washer & Dryer", accent: "terracotta" },
  { icon: Waves, label: "Swimming Pool", accent: "sage" },
  { icon: PawPrint, label: "Pet Friendly", accent: "denim" },
];

const accentClasses = {
  terracotta: { icon: "text-terracotta", bg: "bg-terracotta/10" },
  sage: { icon: "text-sage", bg: "bg-sage/10" },
  denim: { icon: "text-denim", bg: "bg-denim/10" },
};

export default function Amenities() {
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
          {amenities.map((amenity, index) => {
            const accent = accentClasses[amenity.accent];
            return (
              <Reveal
                key={amenity.label}
                variant="scale"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="group flex h-full flex-col items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card px-4 py-7 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(26,22,17,0.1)]">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accent.bg} transition-transform duration-300 ease-out group-hover:-translate-y-0.5`}
                  >
                    <amenity.icon className={`h-5.5 w-5.5 ${accent.icon}`} strokeWidth={1.8} />
                  </div>
                  <span className="font-heading text-[14.5px] font-semibold leading-tight md:text-base">
                    {amenity.label}
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
