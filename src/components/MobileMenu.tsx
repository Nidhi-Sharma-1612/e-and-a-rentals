"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Mail } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sectionIdFromHref } from "@/lib/nav";

type NavLink = {
  label: string;
  href: string;
};

export default function MobileMenu({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sectionIds = navLinks
    .map((link) => sectionIdFromHref(link.href))
    .filter((id) => id !== "");
  const scrollActive = useActiveSection(sectionIds);
  const active = pathname.startsWith("/listings/") ? "listings" : scrollActive;

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center"
      >
        {open ? (
          <X className="h-6 w-6 text-ink" strokeWidth={2} />
        ) : (
          <Menu className="h-6 w-6 text-ink" strokeWidth={2} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-2xl border border-wood/30 bg-card p-3 shadow-lg">
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const id = sectionIdFromHref(link.href);
              const isActive = id === active;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-cream-2 hover:text-terracotta ${
                    isActive ? "bg-cream-2 text-terracotta-dark" : "text-ink"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="mt-2 border-t border-wood/25 pt-3">
            <a
              href="mailto:eddie@eandarentals.com"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-denim px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-denim-dark"
            >
              <Mail className="h-4 w-4" strokeWidth={2} />
              Contact
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
