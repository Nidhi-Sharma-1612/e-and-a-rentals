import Link from "next/link";
import { Home, Mail } from "lucide-react";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { getPageSections, getSiteSettings, str, strList } from "@/lib/cms";

// Hrefs are fixed; the visible labels can be overridden from the admin panel
// (same order as below).
const NAV_HREFS = ["/", "/#about", "/properties", "/#amenities", "/#testimonials", "/#faq"];
const DEFAULT_LABELS = ["Home", "About", "All listings", "Amenities", "Reviews", "FAQ"];

export default async function Header() {
  const [global, settings] = await Promise.all([getPageSections("global"), getSiteSettings()]);
  const navbar = global.navbar ?? {};
  const labels = strList(navbar, "links", DEFAULT_LABELS, NAV_HREFS.length);
  const navLinks = NAV_HREFS.map((href, i) => ({ href, label: labels[i] }));
  const siteName = settings?.siteName || "Book VIP Homes";
  const tagline = str(navbar, "tagline", "by Valencia Investment Properties");
  const contactLabel = str(navbar, "contactLabel", "Contact");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wood/40 bg-cream px-5 md:h-21 md:px-16">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        {settings?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-managed URL can be any domain
          <img src={settings.logoUrl} alt={siteName} className="h-8 w-auto md:h-9" />
        ) : (
          <Home className="h-6 w-6 text-terracotta" strokeWidth={1.8} />
        )}
        <span className="flex flex-col leading-tight">
          <span className="font-heading text-base font-bold md:text-lg">
            {siteName}
          </span>
          <span className="text-[10px] text-muted md:text-[11px]">
            {tagline}
          </span>
        </span>
      </Link>

      <DesktopNav navLinks={navLinks} />

      <Link
        href="/contact"
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-denim px-4.5 py-2.5 font-ui text-sm font-semibold text-denim transition-colors hover:bg-denim hover:text-cream lg:flex"
      >
        <Mail className="h-4 w-4" strokeWidth={2} />
        {contactLabel}
      </Link>

      <MobileMenu navLinks={navLinks} />
    </header>
  );
}
