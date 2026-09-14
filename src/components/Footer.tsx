import Image from "next/image";
import { Home, Mail } from "lucide-react";
import Reveal from "./Reveal";
import BackToTop from "./BackToTop";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.6c0-.92.26-1.55 1.57-1.55h1.68V3.19C16.46 3.13 15.44 3 14.24 3c-2.5 0-4.22 1.53-4.22 4.33v2.28H7.25v3.19h2.77V21h3.48Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "All listings", href: "/properties" },
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
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(var(--color-cream)_1px,transparent_1px)] bg-size-[24px_24px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-terracotta/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />

      <Reveal className="relative mx-auto flex max-w-[1312px] flex-col gap-10 px-5 pb-6 pt-14 md:gap-12 md:px-16 md:pb-8 md:pt-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
          <div className="flex max-w-xs flex-col gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 shrink-0 text-terracotta" strokeWidth={1.8} />
              <span className="flex flex-col leading-tight">
                <span className="font-heading text-lg font-bold uppercase tracking-wide">
                  Book VIP Homes
                </span>
                <span className="text-[11px] text-cream/55">
                  by Valencia Investment Properties
                </span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-cream/60">
              Furnished, direct-booking homes across Texas — with a real host
              who picks up the phone.
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
              href="mailto:eddie@bookviphomes.com"
              className="flex items-center gap-1.5 text-sm text-cream/85 transition-all hover:translate-x-0.5 hover:text-cream"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              eddie@bookviphomes.com
            </a>
          </div>
        </div>

        <div className="h-px bg-cream/15" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="text-[12.5px] text-cream/55">
            © 2026 Book VIP Homes, a Valencia Investment Properties company. All
            rights reserved.
          </span>
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
