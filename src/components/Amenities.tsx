import { Wifi, ChefHat, Snowflake, WashingMachine, Waves, PawPrint, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

type Amenity = {
  icon: LucideIcon;
  label: string;
  note?: string;
  accent: "terracotta" | "sage" | "denim";
};

const amenities: Amenity[] = [
  { icon: Wifi, label: "Free WiFi", accent: "terracotta" },
  { icon: ChefHat, label: "Full Kitchen", accent: "sage" },
  { icon: Snowflake, label: "Air Conditioning", accent: "denim" },
  { icon: WashingMachine, label: "Washer & Dryer", accent: "terracotta" },
  { icon: Waves, label: "Swimming Pool", note: "select homes", accent: "sage" },
  { icon: PawPrint, label: "Pet Friendly", note: "select homes", accent: "denim" },
];

const accentClasses = {
  terracotta: { bg: "bg-terracotta/12", icon: "text-terracotta" },
  sage: { bg: "bg-sage/12", icon: "text-sage" },
  denim: { bg: "bg-denim/12", icon: "text-denim" },
};

export default function Amenities() {
  return (
    <section
      id="amenities"
      className="scroll-mt-16 bg-cream-2 px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20"
    >

      <div className="mx-auto flex max-w-5xl flex-col gap-9 md:gap-12">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:tracking-[0.2em]">
            What&apos;s included
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            The comforts of home, every time.
          </h2>
          <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-base">
            Every E&amp;A home comes stocked with the essentials — plus a few
            extras at select properties.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-8">
          {amenities.map((amenity, index) => {
            const { bg, icon } = accentClasses[amenity.accent];
            return (
              <Reveal key={amenity.label} style={{ transitionDelay: `${index * 70}ms` }}>
                <div className="group flex flex-col items-center gap-3 rounded-2xl border border-wood/30 bg-card px-4 py-7 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-wood/50 hover:shadow-md md:px-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 ${bg}`}
                  >
                    <amenity.icon className={`h-5 w-5 ${icon}`} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading text-[15px] font-semibold md:text-lg">
                      {amenity.label}
                    </span>
                    {amenity.note && (
                      <span className="mt-0.5 inline-flex w-fit items-center self-center rounded-full border border-wood/40 bg-cream-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                        {amenity.note}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
