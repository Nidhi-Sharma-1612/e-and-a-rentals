"use client";

import { useEffect, useRef, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  stayedAt: string;
};

const AUTO_ROTATE_MS = 4000;
const TRANSITION_MS = 500;

const AVATAR_COLORS = [
  { bg: "bg-terracotta", text: "text-card" },
  { bg: "bg-denim", text: "text-card" },
  { bg: "bg-sage", text: "text-card" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const total = testimonials.length;
  const [visibleCount, setVisibleCount] = useState(1);
  const [extIndex, setExtIndex] = useState(visibleCount);
  const [animate, setAnimate] = useState(true);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const reducedMotionRef = useRef(false);
  const paused = hoverPaused || manuallyPaused;

  // Track how many cards are visible at once (1 on mobile, 3 on desktop),
  // and reset to a clean starting position whenever that changes.
  useEffect(() => {
    function update() {
      const next = window.innerWidth >= 768 ? 3 : 1;
      setVisibleCount(next);
      setExtIndex(next);
      setAnimate(false);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotionRef.current) setManuallyPaused(true);
  }, []);

  useEffect(() => {
    if (paused || reducedMotionRef.current || total <= visibleCount) return;
    const id = setInterval(() => {
      setAnimate(true);
      setExtIndex((i) => i + 1);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, total, visibleCount]);

  // Seamless infinite loop: once we slide into the cloned lead-in/tail-out
  // cards, snap back to the equivalent real position with no animation.
  useEffect(() => {
    if (extIndex >= visibleCount + total) {
      const t = setTimeout(() => {
        setAnimate(false);
        setExtIndex((i) => i - total);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (extIndex < visibleCount) {
      const t = setTimeout(() => {
        setAnimate(false);
        setExtIndex((i) => i + total);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [extIndex, total, visibleCount]);

  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  function step(delta: number) {
    setAnimate(true);
    setExtIndex((i) => i + delta);
  }

  function goTo(page: number) {
    setAnimate(true);
    setExtIndex(visibleCount + page);
  }

  const extended = [
    ...testimonials.slice(Math.max(0, total - visibleCount)),
    ...testimonials,
    ...testimonials.slice(0, visibleCount),
  ];
  const activePage = ((extIndex - visibleCount) % total + total) % total;
  const cardWidth = 100 / visibleCount;

  return (
    <div
      className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-7"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      <div className="flex w-full items-center gap-3 md:gap-5">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => step(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-wood/40 bg-card text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <div
            className={`flex ${animate ? "transition-transform duration-500 ease-out" : ""}`}
            style={{ transform: `translateX(-${extIndex * cardWidth}%)` }}
          >
            {extended.map((t, i) => {
              const colorIndex =
                (((i - visibleCount) % total) + total) % total;
              const avatar = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
              return (
                <div
                  key={i}
                  className="shrink-0 px-2 md:px-3"
                  style={{ width: `${cardWidth}%` }}
                >
                  <div className="relative flex h-full flex-col items-center gap-4 rounded-tl-4xl rounded-br-4xl rounded-tr-xl rounded-bl-xl border border-wood/30 bg-card px-5 py-8 text-center md:px-7">
                    <Quote
                      aria-hidden="true"
                      className="absolute right-4 top-4 h-8 w-8 text-terracotta/10"
                      strokeWidth={1}
                    />
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>

                    <p className="text-balance text-[14.5px] leading-relaxed text-ink-soft">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${avatar.bg} ${avatar.text}`}
                      >
                        {initials(t.name)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-ink">{t.name}</span>
                        <span className="text-xs text-muted">{t.stayedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => step(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-wood/40 bg-card text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === activePage}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activePage ? "w-6 bg-terracotta" : "w-2 bg-wood/40 hover:bg-wood/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
