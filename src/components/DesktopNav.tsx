"use client";

import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { sectionIdFromHref } from "@/lib/nav";

type NavLink = {
  label: string;
  href: string;
};

export default function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const sectionIds = navLinks
    .map((link) => sectionIdFromHref(link.href))
    .filter((id) => id !== "");
  const scrollActive = useActiveSection(sectionIds);
  const active = pathname.startsWith("/listings/") ? "listings" : scrollActive;

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {navLinks.map((link) => {
        const id = sectionIdFromHref(link.href);
        const isActive = id === active;
        return (
          <a
            key={link.label}
            href={link.href}
            aria-current={isActive ? "true" : undefined}
            className={`font-ui text-sm font-semibold transition-colors ${
              isActive ? "text-terracotta-dark" : "text-ink hover:text-terracotta"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
