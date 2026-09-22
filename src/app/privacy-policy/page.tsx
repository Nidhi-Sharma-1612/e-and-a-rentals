import type { Metadata } from "next";
import LegalLayout, { LegalSection, LegalBody } from "@/components/LegalLayout";
import { getPageSections, getSiteSettings, objList, str } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Privacy Policy | Book VIP Homes",
  description:
    "How Book VIP Homes collects, uses, and protects the information you share with us.",
};

const FALLBACK_SECTIONS = [
  {
    heading: "Overview",
    body: "Book VIP Homes (“we,” “us,” or “our”), a Valencia Investment Properties company, operates this website to showcase our vacation rental homes and let guests get in touch about a stay. This policy explains what information we collect when you use the site, how we use it, and the choices you have.",
  },
  {
    heading: "Information we collect",
    body: "We collect information in a few limited ways:\n\n- **Information you give us directly** — such as your name, email address, and any details you include when you email us about a booking or question.\n- **Booking information** — if you book a stay, your reservation and payment details are handled directly by our booking platform, Hostaway, and its payment processor, not stored on this website.\n- **Basic technical information** — like the pages you visit and general device/browser information, which our hosting provider collects automatically to keep the site running securely.",
  },
  {
    heading: "How we use your information",
    body: "We use the information we collect to:\n\n- Respond to your questions and booking inquiries\n- Coordinate check-in details and guest communication\n- Keep our website secure and working correctly\n- Comply with legal obligations where required\n\nWe do not sell your personal information.",
  },
  {
    heading: "Sharing your information",
    body: "We only share information with the people who need it to run our business — for example, our booking platform (Hostaway) to process a reservation, or a service provider who helps us operate the property. We don't share your information with third parties for their own marketing purposes.",
  },
  {
    heading: "Cookies",
    body: "This site currently uses only the cookies necessary for it to function — we don't run third-party analytics or advertising trackers today.",
  },
  {
    heading: "Your choices",
    body: "You can ask us at any time to tell you what information we hold about you, correct it, or delete it, by emailing us using the contact below. If you booked through Hostaway, you can also manage your reservation details directly with them.",
  },
  {
    heading: "Contact us",
    body: "Questions about this policy? Email {email}.",
  },
];

export default async function PrivacyPolicyPage() {
  const [sections, settings] = await Promise.all([
    getPageSections("privacy-policy"),
    getSiteSettings(),
  ]);
  const body = sections.body ?? {};
  const updated = str(body, "updated", "August 23, 2026");
  const email = settings?.email || "eddie@bookviphomes.com";
  const items = objList(body, "sections", ["heading", "body"] as const, FALLBACK_SECTIONS);

  return (
    <LegalLayout title="Privacy Policy" updated={updated}>
      {items.map((section) => (
        <LegalSection key={section.heading} heading={section.heading}>
          <LegalBody body={section.body.replaceAll("{email}", `[${email}](mailto:${email})`)} />
        </LegalSection>
      ))}
    </LegalLayout>
  );
}
