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

export default async function Home() {
  const listings = await getListings();

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero listings={listings} />
        <About listings={listings} />
        <Listings listings={listings} />
        <Amenities listings={listings} />
        <Testimonials listings={listings} />
        <Faq listings={listings} />
        <Cta listings={listings} />
      </main>
      <Footer />
    </>
  );
}
