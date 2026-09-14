"use client";

import { useActiveNavHref } from "@/hooks/useActiveNavHref";

type NavLink = {
  label: string;
  href: string;
};

export default function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const activeHref = useActiveNavHref(navLinks);

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {navLinks.map((link) => {
        const isActive = link.href === activeHref;
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
