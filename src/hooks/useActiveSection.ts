"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently "active" under the sticky header,
 * or "" when the page hasn't scrolled into any tracked section yet (home).
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const header = document.querySelector("header");
    const offset = (header?.getBoundingClientRect().height ?? 0) + 24;

    let ticking = false;

    function update() {
      ticking = false;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      setActive(current);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return active;
}
