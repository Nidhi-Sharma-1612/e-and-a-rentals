import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-24 md:px-16">
        <div className="flex max-w-md flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/12">
            <Compass className="h-7 w-7 text-terracotta" strokeWidth={1.8} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-ink">
            Looks like you took a wrong turn.
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            We couldn&apos;t find the page you were looking for — it may have
            moved, or the link might be out of date.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Back to Book VIP Homes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
