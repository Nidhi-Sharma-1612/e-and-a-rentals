"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Reveal from "./Reveal";
import Highlight from "./Highlight";

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

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section
      id="faq"
      className="scroll-mt-16 bg-cream px-5 py-14 md:scroll-mt-21 md:px-16 md:py-20"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10 md:gap-12">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-2.5 text-center md:gap-3">
          <span className="flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-[0.15em] text-sage-dark md:tracking-[0.2em]">
            <HelpCircle className="h-4 w-4" strokeWidth={2} />
            Common questions
          </span>
          <h2 className="font-heading text-[27px] font-bold md:text-4xl">
            Frequently asked <Highlight>questions</Highlight>
          </h2>
        </Reveal>

        <Reveal
          variant="scale"
          className="overflow-hidden rounded-tl-4xl rounded-br-4xl rounded-tr-2xl rounded-bl-2xl border border-wood/30 bg-card shadow-[0_18px_40px_rgba(25,21,33,0.08)]"
        >
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question} className={i > 0 ? "border-t border-wood/20" : ""}>
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream-2/50 md:px-8 md:py-6"
                  >
                    <span
                      className={`font-heading text-[15.5px] font-semibold md:text-lg ${
                        open ? "text-terracotta-dark" : "text-ink"
                      }`}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-terracotta transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                </h3>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-ink-soft md:px-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
