import Reveal from "./Reveal";
import TestimonialCarousel from "./TestimonialCarousel";
import Highlight from "./Highlight";
import type { Listing } from "@/lib/listings";

// Longest, most substantive reviews read best in a carousel — this also
// naturally filters out one-line reviews ("Great stay!") in favor of ones
// that actually say something.
const MIN_QUOTE_LENGTH = 60;
const MAX_TESTIMONIALS = 12;

export default function Testimonials({ listings }: { listings: Listing[] }) {
  const testimonials = listings
    .flatMap((listing) =>
      listing.reviews.map((review) => ({
        quote: review.text,
        name: review.name,
        stayedAt: `Stayed at ${listing.name}`,
      }))
    )
    .filter((t) => t.quote.length >= MIN_QUOTE_LENGTH)
    .slice(0, MAX_TESTIMONIALS);

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-16 overflow-hidden bg-cream-2 px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-denim/10 blur-3xl md:h-72 md:w-72"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-terracotta/10 blur-3xl md:h-72 md:w-72"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-9 md:gap-12">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-sage-dark md:tracking-[0.2em]">
            What guests say
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            Stories from <Highlight>our guests</Highlight>
          </h2>
        </Reveal>

        <Reveal variant="scale" style={{ transitionDelay: "90ms" }}>
          <TestimonialCarousel testimonials={testimonials} />
        </Reveal>
      </div>
    </section>
  );
}
