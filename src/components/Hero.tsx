import Image from "next/image";
import { ChevronDown } from "lucide-react";
import BookingWidget from "./BookingWidget";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-64px)] flex-col md:min-h-[calc(100dvh-84px)]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/cottage1-b.jpg"
          aria-hidden="true"
          className="photo-grade h-full w-full object-cover object-center motion-reduce:hidden"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <Image
          src="/images/cottage1-b.jpg"
          alt="Furnished VIP Homes rental exterior on a bright day, with a flag by the front door"
          fill
          sizes="100vw"
          className="photo-grade hidden object-cover object-center motion-reduce:block"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/55 to-ink/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(0,0,0,0.38),transparent_70%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1312px] flex-1 flex-col items-center justify-start gap-3 px-5 pb-4 pt-[24vh] text-center md:gap-4 md:px-16 md:pt-[24vh]">
        <div className="flex max-w-2xl flex-col items-center gap-2 md:max-w-3xl md:gap-3">
          <span className="animate-fade-up rounded-full border border-white/30 bg-black/25 px-4 py-1 font-ui text-xs font-bold uppercase tracking-[0.15em] text-gold shadow-lg shadow-black/20 backdrop-blur-md md:tracking-[0.2em]">
            Book Direct. Stay VIP.
          </span>
          <h1 className="animate-fade-up text-balance font-heading text-[28px] font-bold leading-[1.15] text-cream drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] [animation-delay:120ms] md:text-[58px] md:leading-[1.12]">
            Furnished homes for every kind of stay.
          </h1>
          <p className="animate-fade-up max-w-2xl text-balance text-[15px] leading-relaxed text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] [animation-delay:220ms] md:text-[17px]">
            Vacation trip, work crew, or a family between homes — book straight
            with us and skip the third-party markup.
          </p>
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
