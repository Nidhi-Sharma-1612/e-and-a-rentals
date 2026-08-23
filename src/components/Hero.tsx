import Image from "next/image";
import { ChevronDown } from "lucide-react";
import BookingWidget from "./BookingWidget";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-64px)] flex-col md:min-h-[calc(100dvh-84px)]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/cottage1-b.jpg"
          alt="All American Cottage exterior on a bright day, with a flag by the front door"
          fill
          priority
          sizes="100vw"
          className="animate-hero-zoom object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/50 via-ink/45 to-ink/75" />
      </div>

      <div className="mx-auto flex w-full max-w-[1312px] flex-1 flex-col items-center justify-center gap-7 px-5 py-10 text-center md:gap-8 md:px-16 md:py-14">
        <div className="flex max-w-2xl flex-col items-center gap-3 md:max-w-3xl md:gap-4">
          <span className="animate-fade-up rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-gold shadow-lg shadow-black/10 backdrop-blur-md md:tracking-[0.2em]">
            Sun-warmed stays, Southwest style
          </span>
          <h1 className="animate-fade-up text-balance font-heading text-[34px] font-bold leading-[1.12] text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] [animation-delay:120ms] md:text-[58px]">
            All-American cottages, ready for your whole crew.
          </h1>
        </div>

        <div className="w-full max-w-4xl animate-fade-up [animation-delay:380ms]">
          <BookingWidget />
        </div>
      </div>

      <div className="animate-fade-up pointer-events-none flex justify-center pb-6 [animation-delay:640ms] md:pb-8">
        <ChevronDown
          className="animate-bob h-6 w-6 text-cream/70 md:h-7 md:w-7"
          strokeWidth={1.8}
        />
      </div>
    </section>
  );
}
