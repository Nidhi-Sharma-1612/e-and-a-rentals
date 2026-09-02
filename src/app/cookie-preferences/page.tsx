import type { Metadata } from "next";
import { Lock } from "lucide-react";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Preferences | Book VIP Homes",
  description: "What cookies Book VIP Homes uses on this website, and why.",
};

export default function CookiePreferencesPage() {
  return (
    <LegalLayout title="Cookie Preferences" updated="August 23, 2026">
      <LegalSection heading="What we use today">
        <p>
          This website currently uses only the cookies that are strictly
          necessary for it to function — for example, remembering that
          you&rsquo;ve dismissed a menu or keeping the site working correctly
          as you browse. We don&rsquo;t run third-party analytics,
          advertising, or tracking cookies at this time.
        </p>
      </LegalSection>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-wood/30 bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15">
            <Lock className="h-4 w-4 text-sage" strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-ink">
              Strictly necessary
            </span>
            <span className="text-[13px] leading-relaxed text-muted">
              Required for the site to work. Always on, and can&rsquo;t be
              turned off.
            </span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-sage/15 px-3 py-1 text-[12px] font-bold text-sage">
          Always on
        </span>
      </div>

      <LegalSection heading="If that changes">
        <p>
          If we ever add analytics or a booking widget that sets its own
          cookies (for example, once our Hostaway booking integration goes
          live), we&rsquo;ll update this page and give you the option to
          accept or decline anything that isn&rsquo;t strictly necessary
          before it&rsquo;s set.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>
          Questions about cookies on this site? Email{" "}
          <a
            href="mailto:eddie@bookviphomes.com"
            className="font-semibold text-denim hover:text-denim-dark"
          >
            eddie@bookviphomes.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
