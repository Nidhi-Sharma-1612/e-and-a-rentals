import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Listings from "@/components/Listings";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import { SearchFilterProvider } from "@/components/SearchFilterProvider";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <SearchFilterProvider>
          <Hero />
          <About />
          <Listings />
        </SearchFilterProvider>
        <Amenities />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
