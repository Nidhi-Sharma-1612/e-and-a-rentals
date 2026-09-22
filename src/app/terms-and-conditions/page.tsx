import type { Metadata } from "next";
import LegalLayout, { LegalSection, LegalBody } from "@/components/LegalLayout";
import { getPageSections, getSiteSettings, objList, str } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Terms and Conditions | Book VIP Homes",
  description:
    "The terms that govern using the Book VIP Homes website and booking a stay with us.",
};

const FALLBACK_SECTIONS = [
  {
    heading: "Agreement to terms",
    body: "By using this website, you agree to these terms. If you don't agree with any part of them, please don't use the site or book a stay with us.",
  },
  {
    heading: "Bookings",
    body: "Reservations are made through our booking platform, Hostaway. A booking is only confirmed once you receive confirmation from us or through the booking platform. Rates, availability, and any promotions shown on this site are subject to change without notice until a booking is confirmed.",
  },
  {
    heading: "Check-in, check-out, and house rules",
    body: "Check-in and check-out times, along with pet and smoking policies, are listed on each individual listing page and will also be confirmed with you directly ahead of your stay. Guests are expected to follow the house rules for their booked property and treat the home with the same care they'd want in their own.",
  },
  {
    heading: "Cancellations",
    body: "Each listing has its own cancellation policy, shown on that listing's page. Please review it before booking — it governs how much of your payment is refundable and by when.",
  },
  {
    heading: "Guest responsibilities",
    body: "- Only registered guests within the listed occupancy limit may stay at the property.\n- Guests are responsible for any damage caused during their stay beyond normal wear and tear.\n- Illegal activity, unauthorized parties, or violations of the house rules may result in the stay being ended without a refund.",
  },
  {
    heading: "Limitation of liability",
    body: "We do our best to keep our homes safe, clean, and accurately described. To the extent permitted by law, Book VIP Homes is not liable for indirect, incidental, or consequential damages arising from your stay or your use of this website. Nothing in these terms limits liability that cannot be limited under applicable law.",
  },
  {
    heading: "Website use",
    body: "The content on this site — including photos, listing descriptions, and branding — belongs to Book VIP Homes and may not be copied or reused without permission.",
  },
  {
    heading: "Governing law",
    body: "These terms are governed by the laws of the State of Texas, without regard to its conflict-of-law principles.",
  },
  {
    heading: "Contact us",
    body: "Questions about these terms? Email {email}.",
  },
];

export default async function TermsPage() {
  const [sections, settings] = await Promise.all([
    getPageSections("terms-and-conditions"),
    getSiteSettings(),
  ]);
  const body = sections.body ?? {};
  const updated = str(body, "updated", "August 23, 2026");
  const email = settings?.email || "eddie@bookviphomes.com";
  const items = objList(body, "sections", ["heading", "body"] as const, FALLBACK_SECTIONS);

  return (
    <LegalLayout title="Terms and Conditions" updated={updated}>
      {items.map((section) => (
        <LegalSection key={section.heading} heading={section.heading}>
          <LegalBody body={section.body.replaceAll("{email}", `[${email}](mailto:${email})`)} />
        </LegalSection>
      ))}
    </LegalLayout>
  );
}
