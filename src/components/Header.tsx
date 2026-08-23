import Link from "next/link";
import { Home, Mail } from "lucide-react";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "All listings", href: "/#listings" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wood/40 bg-cream px-5 md:h-21 md:px-16">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <Home className="h-6 w-6 text-terracotta" strokeWidth={1.8} />
        <span className="font-heading text-lg font-bold md:text-xl">
          E&amp;A Rentals
        </span>
      </Link>

      <DesktopNav navLinks={navLinks} />

      <a
        href="mailto:eddie@eandarentals.com"
        className="hidden shrink-0 items-center gap-2 rounded-lg bg-denim px-4.5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-denim-dark lg:flex"
      >
        <Mail className="h-4 w-4" strokeWidth={2} />
        Contact
      </a>

      <MobileMenu navLinks={navLinks} />
    </header>
  );
}
