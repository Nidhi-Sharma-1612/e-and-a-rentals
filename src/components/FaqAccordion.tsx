"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <div className="flex flex-col divide-y divide-wood/20">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className={open ? "bg-cream-2/50" : ""}>
            <h4 className="m-0">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cream-2/40 md:px-6 md:py-5"
              >
                <span
                  className={`font-heading text-[15px] font-semibold md:text-base ${
                    open ? "text-terracotta-dark" : "text-ink"
                  }`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-terracotta transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.2}
                />
              </button>
            </h4>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[14px] leading-relaxed text-ink-soft md:px-6 md:pb-5">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
