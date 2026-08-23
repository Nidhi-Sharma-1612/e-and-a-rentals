import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | E&A Rentals",
  description:
    "How E&A Rentals collects, uses, and protects the information you share with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 23, 2026">
      <LegalSection heading="Overview">
        <p>
          E&amp;A Rentals (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) operates this website to showcase our vacation
          rental homes and let guests get in touch about a stay. This policy
          explains what information we collect when you use the site, how we
          use it, and the choices you have.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>We collect information in a few limited ways:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            <strong>Information you give us directly</strong> — such as your
            name, email address, and any details you include when you email
            us about a booking or question.
          </li>
          <li>
            <strong>Booking information</strong> — if you book a stay, your
            reservation and payment details are handled directly by our
            booking platform, Hostaway, and its payment processor, not stored
            on this website.
          </li>
          <li>
            <strong>Basic technical information</strong> — like the pages you
            visit and general device/browser information, which our hosting
            provider collects automatically to keep the site running
            securely.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <p>We use the information we collect to:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>Respond to your questions and booking inquiries</li>
          <li>Coordinate check-in details and guest communication</li>
          <li>Keep our website secure and working correctly</li>
          <li>Comply with legal obligations where required</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="Sharing your information">
        <p>
          We only share information with the people who need it to run our
          business — for example, our booking platform (Hostaway) to process
          a reservation, or a service provider who helps us operate the
          property. We don&rsquo;t share your information with third parties
          for their own marketing purposes.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies">
        <p>
          This site currently uses only the cookies necessary for it to
          function — we don&rsquo;t run third-party analytics or advertising
          trackers today. See our{" "}
          <a
            href="/cookie-preferences"
            className="font-semibold text-denim hover:text-denim-dark"
          >
            Cookie Preferences
          </a>{" "}
          page for details, including what changes if that ever changes.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can ask us at any time to tell you what information we hold
          about you, correct it, or delete it, by emailing us using the
          contact below. If you booked through Hostaway, you can also manage
          your reservation details directly with them.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>
          Questions about this policy? Email{" "}
          <a
            href="mailto:eddie@eandarentals.com"
            className="font-semibold text-denim hover:text-denim-dark"
          >
            eddie@eandarentals.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
