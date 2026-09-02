import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions | Book VIP Homes",
  description:
    "The terms that govern using the Book VIP Homes website and booking a stay with us.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms and Conditions" updated="August 23, 2026">
      <LegalSection heading="Agreement to terms">
        <p>
          By using this website, you agree to these terms. If you don&rsquo;t
          agree with any part of them, please don&rsquo;t use the site or
          book a stay with us.
        </p>
      </LegalSection>

      <LegalSection heading="Bookings">
        <p>
          Reservations are made through our booking platform, Hostaway. A
          booking is only confirmed once you receive confirmation from us or
          through the booking platform. Rates, availability, and any
          promotions shown on this site are subject to change without
          notice until a booking is confirmed.
        </p>
      </LegalSection>

      <LegalSection heading="Check-in, check-out, and house rules">
        <p>
          Check-in and check-out times, along with pet and smoking policies,
          are listed on each individual listing page and will also be
          confirmed with you directly ahead of your stay. Guests are expected
          to follow the house rules for their booked property and treat the
          home with the same care they&rsquo;d want in their own.
        </p>
      </LegalSection>

      <LegalSection heading="Cancellations">
        <p>
          Each listing has its own cancellation policy, shown on that
          listing&rsquo;s page. Please review it before booking — it governs
          how much of your payment is refundable and by when.
        </p>
      </LegalSection>

      <LegalSection heading="Guest responsibilities">
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>Only registered guests within the listed occupancy limit may stay at the property.</li>
          <li>Guests are responsible for any damage caused during their stay beyond normal wear and tear.</li>
          <li>Illegal activity, unauthorized parties, or violations of the house rules may result in the stay being ended without a refund.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          We do our best to keep our homes safe, clean, and accurately
          described. To the extent permitted by law, Book VIP Homes is not
          liable for indirect, incidental, or consequential damages arising
          from your stay or your use of this website. Nothing in these terms
          limits liability that cannot be limited under applicable law.
        </p>
      </LegalSection>

      <LegalSection heading="Website use">
        <p>
          The content on this site — including photos, listing descriptions,
          and branding — belongs to Book VIP Homes and may not be copied or
          reused without permission.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of the State of Texas, without
          regard to its conflict-of-law principles.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>
          Questions about these terms? Email{" "}
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
