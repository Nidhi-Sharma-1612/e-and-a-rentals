import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getPageSections, str } from "@/lib/cms";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const FALLBACK_TITLE = "Book VIP Homes | Book Direct. Stay VIP.";
const FALLBACK_DESCRIPTION =
  "Furnished, direct-booking rental homes by Valencia Investment Properties. Pet-friendly, three and four bedroom homes across Texas, with a real host who picks up the phone.";

export async function generateMetadata(): Promise<Metadata> {
  const global = await getPageSections("global");
  const seo = global.seo ?? {};
  const title = str(seo, "title", FALLBACK_TITLE);
  const description = str(seo, "description", FALLBACK_DESCRIPTION);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/images/cottage2-a.jpg",
          width: 1600,
          height: 1200,
          alt: "An All American Cottage exterior with a flag by the front door",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/cottage2-a.jpg"],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
