import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import FaqAccordion from "./FaqAccordion";

const faqs = [
  {
    question: "Do you allow pets?",
    answer:
      "Yes — select homes are pet-friendly. Look for the paw icon when browsing, or email Eddie to confirm for a specific property.",
  },
  {
    question: "Where are your homes located?",
    answer: "Our homes are located across Texas, including El Paso and Wichita Falls.",
  },
  {
    question: "Is there a minimum length of stay?",
    answer:
      "It varies by home — some, like The Lucile, are set up especially for extended stays. Reach out to Eddie and he'll help you find the right fit.",
  },
  {
    question: "What's included in every home?",
    answer:
      "Every home comes with free WiFi, a full kitchen, and air conditioning. Some homes also have a washer & dryer, a pool, or are pet-friendly — check each listing for details.",
  },
  {
    question: "How do I book or ask a question?",
    answer:
      "Browse our homes above to check dates, then reach out directly — Eddie personally reads every message and can help lock in your stay.",
  },
];

export default function CtaFaq() {
  return (
    <section
      id="faq"
      className="scroll-mt-16 bg-cream-2 px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20"
    >
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-wood/30 bg-card shadow-[0_20px_44px_rgba(43,33,24,0.12)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* CTA half */}
          <div className="flex flex-col justify-center gap-4 border-b border-wood/20 p-7 md:border-b-0 md:border-r md:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/12">
              <Mail className="h-5 w-5 text-terracotta" strokeWidth={2} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:tracking-[0.2em]">
              Ready when you are
            </span>
            <h2 className="font-heading text-[27px] font-bold leading-tight md:text-4xl">
              Your Southwest getaway is one message away.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-ink-soft md:text-base">
              Browse our homes, pick your dates, and let Eddie take it from
              there — no call centers, no hassle.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <Link
                href="/#listings"
                className="flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark"
              >
                Browse our homes
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <a
                href="mailto:eddie@eandarentals.com"
                className="flex items-center gap-2 text-sm font-semibold text-denim hover:text-denim-dark"
              >
                <Mail className="h-4 w-4" strokeWidth={2} />
                Email Eddie directly
              </a>
            </div>
          </div>

          {/* FAQ half */}
          <div className="flex flex-col gap-4 p-7 md:p-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-terracotta-dark md:tracking-[0.2em]">
                Common questions
              </span>
              <h3 className="font-heading text-xl font-semibold md:text-2xl">
                Frequently asked questions
              </h3>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
