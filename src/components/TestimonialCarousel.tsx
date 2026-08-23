"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Quote, Star, CircleUserRound, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  stayedAt: string;
};

const AUTO_ROTATE_MS = 7000;
const CARDS_PER_PAGE = 3;

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const pages = useMemo(() => chunk(testimonials, CARDS_PER_PAGE), [testimonials]);
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const reducedMotionRef = useRef(false);
  const paused = hoverPaused || manuallyPaused;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotionRef.current) setManuallyPaused(true);
  }, []);

  useEffect(() => {
    if (paused || reducedMotionRef.current || pages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pages.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, pages.length]);

  function goTo(i: number) {
    setIndex(((i % pages.length) + pages.length) % pages.length);
  }

  return (
    <div
      className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      <div className="flex w-full items-center gap-3 md:gap-6">
        <button
          type="button"
          aria-label="Previous testimonials"
          onClick={() => goTo(index - 1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-wood/40 bg-card text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {pages.map((page, p) => (
              <div
                key={p}
                aria-hidden={p !== index}
                className="grid w-full shrink-0 grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
              >
                {page.map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-2xl border border-wood/30 bg-card p-6 text-center"
                  >
                    <div className="flex items-center justify-between">
                      <Quote className="h-6 w-6 text-terracotta/40" strokeWidth={2} />
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
                        ))}
                      </div>
                    </div>

                    <p className="text-left text-[14.5px] italic leading-relaxed text-ink-soft">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="mt-auto flex items-center gap-3 border-t border-wood/25 pt-4 text-left">
                      <CircleUserRound className="h-9 w-9 shrink-0 text-muted/60" strokeWidth={1.5} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-ink">{t.name}</span>
                        <span className="text-xs text-muted">{t.stayedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next testimonials"
          onClick={() => goTo(index + 1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-wood/40 bg-card text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonials page ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-terracotta" : "w-2 bg-wood/40 hover:bg-wood/60"
              }`}
            />
          ))}
        </div>
        {pages.length > 1 && (
          <button
            type="button"
            aria-label={manuallyPaused ? "Resume autoplay" : "Pause autoplay"}
            onClick={() => setManuallyPaused((v) => !v)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:text-terracotta"
          >
            {manuallyPaused ? (
              <Play className="h-3.5 w-3.5" strokeWidth={2.2} />
            ) : (
              <Pause className="h-3.5 w-3.5" strokeWidth={2.2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
