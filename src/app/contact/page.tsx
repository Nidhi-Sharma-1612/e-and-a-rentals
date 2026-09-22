import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircleQuestion } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getPageSections, getSiteSettings, str } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact | Book VIP Homes",
  description: "Get in touch with Eddie about a stay at one of our VIP Homes across Texas.",
};

export default async function ContactPage() {
  const [sections, settings] = await Promise.all([getPageSections("contact"), getSiteSettings()]);
  const intro = sections.intro ?? {};
  const email = settings?.email || "eddie@bookviphomes.com";

  return (
    <>
      <Header />
      <main id="main-content" className="relative bg-cream">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--color-wood)_1px,transparent_1px)] bg-size-[22px_22px]"
        />
        <div className="relative mx-auto max-w-5xl px-5 py-14 md:px-16 md:py-20">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/" className="hover:text-terracotta">Home</Link>
            <span>/</span>
            <span className="text-ink-soft">Contact</span>
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            <h1 className="font-heading text-[28px] font-bold leading-tight md:text-4xl">
              {str(intro, "heading", "Get in touch")}
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
              {str(
                intro,
                "description",
                "Questions about a home, your dates, or anything else — Eddie reads every message personally and answers directly, no call center in between.",
              )}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-[1fr_360px] md:gap-12">
            <div className="rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card p-6 shadow-[0_18px_36px_rgba(43,33,24,0.08)] md:p-8">
              <ContactForm contactEmail={email} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-wood/30 bg-card px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md bg-terracotta font-heading text-sm font-bold text-card">
                  VIP
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink">Eddie</span>
                  <span className="text-xs text-muted">Your host</span>
                </div>
              </div>

              <InfoCard icon={Mail} label={str(intro, "emailLabel", "Email")}>
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-denim hover:text-denim-dark"
                >
                  {email}
                </a>
              </InfoCard>

              <InfoCard icon={Clock} label={str(intro, "responseTimeLabel", "Response time")}>
                {str(
                  intro,
                  "responseTimeText",
                  "Usually within a few hours — Eddie answers his own email.",
                )}
              </InfoCard>

              <InfoCard
                icon={MessageCircleQuestion}
                label={str(intro, "beforeYouBookLabel", "Before you book")}
              >
                {str(intro, "beforeYouBookPrefix", "Have a question about a specific home? Browse")}{" "}
                <Link href="/properties" className="font-semibold text-denim hover:text-denim-dark">
                  {str(intro, "beforeYouBookLinkLabel", "all our homes")}
                </Link>{" "}
                {str(intro, "beforeYouBookSuffix", "first, then mention which one in your message.")}
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-wood/30 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-denim/10">
          <Icon className="h-4 w-4 text-denim" strokeWidth={2} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
