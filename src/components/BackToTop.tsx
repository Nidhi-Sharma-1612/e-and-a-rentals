"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-semibold text-cream/70 transition-colors hover:text-cream"
    >
      Back to top
      <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.2} />
    </button>
  );
}
