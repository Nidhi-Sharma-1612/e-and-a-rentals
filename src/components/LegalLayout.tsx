import type { ReactNode } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="mx-auto max-w-[820px] px-5 pb-20 pt-8 md:px-16 md:pt-12">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/" className="hover:text-terracotta">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink-soft">{title}</span>
          </nav>

          <h1 className="mt-4 font-heading text-3xl font-bold text-ink md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-[13px] text-muted">Last updated: {updated}</p>

          <div className="prose-legal mt-10 flex flex-col gap-6">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl font-semibold text-ink">{heading}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}
