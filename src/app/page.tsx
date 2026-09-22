import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Listings from "@/components/Listings";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import { getListings } from "@/lib/listings";
import { getPageSections, getSiteSettings, str } from "@/lib/cms";

export default async function Home() {
  const [listings, sections, settings] = await Promise.all([
    getListings(),
    getPageSections("home"),
    getSiteSettings(),
  ]);
  const email = settings?.email || "eddie@bookviphomes.com";

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero listings={listings} content={sections.hero ?? {}} />
        <About listings={listings} content={sections.about ?? {}} email={email} />
        <Listings listings={listings} content={sections.listings ?? {}} />
        <Amenities listings={listings} content={sections.amenities ?? {}} />
        <Testimonials listings={listings} content={sections.testimonials ?? {}} />
        <Faq listings={listings} eyebrow={str(sections.faq ?? {}, "eyebrow", "Common questions")} />
        <Cta listings={listings} content={sections.cta ?? {}} />
      </main>
      <Footer />
    </>
  );
}
