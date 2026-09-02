import type { ReactNode } from "react";

/**
 * Inline heading accent: colored text, used in place of italics (the
 * display font has no true italic face). `tone="dark"` swaps to gold for
 * use on dark section backgrounds, where the default terracotta doesn't
 * have enough contrast against ink.
 */
export default function Highlight({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span className={tone === "dark" ? "text-gold" : "text-terracotta"}>
      {children}
    </span>
  );
}
