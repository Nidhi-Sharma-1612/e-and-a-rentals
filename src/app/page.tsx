import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Listings from "@/components/Listings";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import CtaFaq from "@/components/CtaFaq";
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
        <CtaFaq />
      </main>
      <Footer />
    </>
  );
}
