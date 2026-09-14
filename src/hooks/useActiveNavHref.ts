"use client";

import { usePathname } from "next/navigation";
import { useActiveSection } from "./useActiveSection";
import { sectionIdFromHref } from "@/lib/nav";

type NavLink = { label: string; href: string };

// Anchor links (e.g. "/#about") are only active while scrolled into that
// section of the homepage; plain links (e.g. "/properties") are active by
// path match instead — and "All listings" also lights up for any single
// listing page, since that's conceptually still "inside" listings.
export function useActiveNavHref(navLinks: NavLink[]): string {
  const pathname = usePathname();
  const sectionIds = navLinks
    .map((link) => sectionIdFromHref(link.href))
    .filter((id) => id !== "");
  const scrollActive = useActiveSection(sectionIds);

  if (pathname.startsWith("/listings/")) return "/properties";

  const pathLink = navLinks.find(
    (link) => !link.href.includes("#") && link.href !== "/" && pathname.startsWith(link.href)
  );
  if (pathLink) return pathLink.href;

  if (pathname !== "/") return "";

  const scrollLink = navLinks.find((link) => sectionIdFromHref(link.href) === scrollActive);
  return scrollLink?.href ?? "";
}
