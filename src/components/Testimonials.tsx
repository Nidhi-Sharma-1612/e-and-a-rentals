import Reveal from "./Reveal";
import TestimonialCarousel from "./TestimonialCarousel";
import Highlight from "./Highlight";

// Sample reviews for layout purposes only — not real guest feedback.
// Swap these for actual reviews before this site goes live.
const placeholderTestimonials = [
  {
    quote: "We stayed at the Paso Del Norte with three kids and two dogs, and it was perfect. Eddie even left a note with restaurant recommendations. Already planning our next trip.",
    name: "Marcus T.",
    stayedAt: "Stayed at All American Paso Del Norte",
  },
  {
    quote: "The Lucile was exactly what our family needed for a two-week stay — real bedrooms, a real kitchen, and fast WiFi so we could still work. Felt like a home, not a hotel room.",
    name: "Priya R.",
    stayedAt: "Stayed at The Lucile",
  },
  {
    quote: "Booked the cottage last minute and Eddie responded within the hour. The house was spotless, the AC worked great in the July heat, and the porch was our favorite spot every evening.",
    name: "Danielle K.",
    stayedAt: "Stayed at All American Cottage",
  },
  {
    quote: "Our dog loved having a real yard to run around in, and the house itself was spotless. Highly recommend if you're traveling with pets.",
    name: "Jordan L.",
    stayedAt: "Stayed at All American Cottage",
  },
  {
    quote: "Perfect little home base for our long weekend. Comfortable beds, a stocked kitchen, and Eddie was easy to reach the whole time.",
    name: "Renee A.",
    stayedAt: "Stayed at All American Cottage",
  },
  {
    quote: "We needed a month-long stay for work and The Lucile delivered — fast WiFi, a quiet street, and more space than any hotel could offer.",
    name: "Samuel O.",
    stayedAt: "Stayed at The Lucile",
  },
  {
    quote: "The Paso Del Norte's open kitchen and living area made it easy to host a family dinner. Loved the Southwest touches throughout the home.",
    name: "Christine W.",
    stayedAt: "Stayed at All American Paso Del Norte",
  },
  {
    quote: "Checked in late and everything was ready exactly as promised. Clean, comfortable, and close to everything we wanted to see.",
    name: "Ben H.",
    stayedAt: "Stayed at All American Cottage",
  },
];

export default function Testimonials() {
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
          <TestimonialCarousel testimonials={placeholderTestimonials} />
        </Reveal>
      </div>
    </section>
  );
}
