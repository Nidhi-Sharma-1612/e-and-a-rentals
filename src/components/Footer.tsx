import Image from "next/image";
import { Home, Mail } from "lucide-react";
import Reveal from "./Reveal";
import BackToTop from "./BackToTop";
import { averageRating, listings } from "@/lib/listings";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.6c0-.92.26-1.55 1.57-1.55h1.68V3.19C16.46 3.13 15.44 3 14.24 3c-2.5 0-4.22 1.53-4.22 4.33v2.28H7.25v3.19h2.77V21h3.48Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "All listings", href: "/#listings" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and conditions", href: "/terms-and-conditions" },
  { label: "Cookie Preferences", href: "/cookie-preferences" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-cream">
      <svg
        className="absolute inset-x-0 top-0 h-10 w-full text-cream-2 md:h-16"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,60 C240,10 480,100 720,80 C960,60 1200,10 1440,50 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>

      <Reveal className="mx-auto flex max-w-[1312px] flex-col gap-10 px-5 pb-6 pt-16 md:gap-12 md:px-16 md:pb-8 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-8">
          <div className="flex max-w-xs flex-col gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-gold" strokeWidth={1.8} />
              <span className="font-heading text-lg font-bold">E&amp;A Rentals</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-cream/65">
              All-American homes, all-American hospitality.
            </p>
            <p className="text-[12.5px] font-semibold text-gold">
              {averageRating}★ average · {listings.length} homes across Texas
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/80 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn heading="Explore" links={exploreLinks} />
          <FooterColumn heading="Legal" links={legalLinks} />

          <div className="flex flex-col gap-2.5">
            <span className="text-[11.5px] font-bold uppercase tracking-wide text-cream/50">
              Get in touch
            </span>
            <a
              href="mailto:eddie@eandarentals.com"
              className="flex items-center gap-1.5 text-sm text-cream/85 transition-all hover:translate-x-0.5 hover:text-cream"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              eddie@eandarentals.com
            </a>
          </div>
        </div>

        <div className="h-px bg-cream/15" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-6">
            <span className="text-[12.5px] text-cream/55">
              © 2026 E&amp;A Rentals. All rights reserved.
            </span>
            <span className="text-[12.5px] text-cream/55">
              Handpicked homes, hosted personally.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 text-[12.5px] text-cream/55">
              Design and developed by
              <Image
                src="/images/logo.png"
                alt="Design by Dial"
                width={94}
                height={22}
                className="h-4.5 w-auto opacity-90"
              />
            </span>
            <div className="h-4 w-px bg-cream/15" />
            <BackToTop />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[11.5px] font-bold uppercase tracking-wide text-cream/50">
        {heading}
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-sm text-cream/85 transition-all hover:translate-x-0.5 hover:text-cream"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
