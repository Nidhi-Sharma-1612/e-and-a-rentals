import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  Users,
  BedDouble,
  Bath,
  LogIn,
  LogOut,
  PawPrint,
  CigaretteOff,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import ListingBookingWidget from "@/components/ListingBookingWidget";
import { listings, getListing } from "@/lib/listings";
import { amenityIcon } from "@/lib/amenity-icons";
import { mapEmbedUrl, externalMapUrl } from "@/lib/city-coords";

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return {};
  const title = `${listing.name} | E&A Rentals`;
  const description = listing.description[0];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/listings/${listing.id}`,
      type: "website",
      images: [
        {
          url: listing.image,
          width: 1600,
          height: 1200,
          alt: listing.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [listing.image],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const otherListings = listings.filter((l) => l.id !== listing.id);
  const extraAmenityCount = listing.totalAmenities
    ? listing.totalAmenities - listing.amenities.length
    : 0;
  const mapUrl = mapEmbedUrl(listing.city);
  const externalMapHref = externalMapUrl(listing.city);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="mx-auto max-w-[1312px] px-5 pt-6 md:px-16">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/" className="hover:text-terracotta">Home</Link>
            <span>/</span>
            <Link href="/#listings" className="hover:text-terracotta">All listings</Link>
            <span>/</span>
            <span className="text-ink-soft">{listing.name}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1.5">
              {listing.tag && (
                <span className="w-fit rounded-full bg-sage/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sage-dark">
                  {listing.tag}
                </span>
              )}
              <h1 className="font-heading text-[28px] font-bold leading-tight md:text-4xl">
                {listing.name}
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-terracotta text-terracotta" />
              <span className="font-semibold text-ink">{listing.rating}</span>
              {listing.reviewCount !== undefined && (
                <span className="text-sm text-muted">
                  ({listing.reviewCount} review{listing.reviewCount === 1 ? "" : "s"})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1312px] px-5 pt-5 md:px-16">
          <PhotoGallery images={listing.images} alt={listing.name} />
        </div>

        <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-12 px-5 py-10 md:px-16 md:py-14 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Main content */}
          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex items-center gap-6 border-b border-wood/25 pb-8">
              <Fact icon={Users} label={`${listing.guests} guests`} />
              <Fact icon={BedDouble} label={`${listing.beds} bedrooms`} />
              <Fact icon={Bath} label={`${listing.baths} bathrooms`} />
            </div>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-xl font-semibold">About this home</h2>
              {listing.description.map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {listing.amenities.map((amenity) => {
                  const Icon = amenityIcon(amenity);
                  return (
                    <div key={amenity} className="flex items-center gap-2.5">
                      <Icon className="h-4.5 w-4.5 shrink-0 text-sage" strokeWidth={2} />
                      <span className="text-sm text-ink-soft">{amenity}</span>
                    </div>
                  );
                })}
              </div>
              {extraAmenityCount > 0 && (
                <p className="text-sm text-muted">
                  +{extraAmenityCount} more amenities — email Eddie for the full list.
                </p>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-xl font-semibold">Things to know</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RuleCard icon={LogIn} label="Check-in" value={listing.checkIn} />
                <RuleCard icon={LogOut} label="Check-out" value={listing.checkOut} />
                <RuleCard
                  icon={PawPrint}
                  label="Pets"
                  value={listing.petsAllowed ? "Allowed" : "Not allowed"}
                />
                <RuleCard
                  icon={CigaretteOff}
                  label="Smoking"
                  value={listing.smokingAllowed ? "Allowed" : "Not allowed"}
                />
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-wood/30 bg-cream-2 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-denim" strokeWidth={2} />
                  <span className="font-heading font-semibold text-ink">Cancellation policy</span>
                </div>
                <ul className="flex flex-col gap-1 pl-1 text-sm text-ink-soft">
                  {listing.cancellationPolicy.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-xl font-semibold">Where you&apos;ll be</h2>
              <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
                {listing.city ? `${listing.city}, Texas` : "Texas"} — exact address shared after booking.
              </p>
              <div className="relative overflow-hidden rounded-2xl border border-wood/30 bg-cream-2 shadow-[0_14px_28px_rgba(43,33,24,0.1)]">
                <iframe
                  src={mapUrl}
                  className="h-80 w-full"
                  loading="lazy"
                  title={listing.city ? `General area map of ${listing.city}, Texas` : "Map of Texas"}
                />
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1.5 text-[11px] font-bold text-ink shadow-sm">
                  Approximate area
                </span>
              </div>
              <a
                href={externalMapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1.5 text-sm font-semibold text-denim hover:text-denim-dark"
              >
                Open in Google Maps
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </a>
            </section>

            {listing.reviews.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-heading text-xl font-semibold">
                  Guest reviews
                  {listing.reviewCount !== undefined && listing.reviewCount > listing.reviews.length
                    ? ` (showing ${listing.reviews.length} of ${listing.reviewCount})`
                    : ""}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {listing.reviews.map((review, i) => (
                    <div key={i} className="flex flex-col gap-2 rounded-2xl border border-wood/30 bg-card p-5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-terracotta text-terracotta" />
                        ))}
                      </div>
                      <p className="text-[14px] leading-relaxed text-ink-soft">&ldquo;{review.text}&rdquo;</p>
                      <span className="mt-auto text-xs font-semibold text-muted">
                        {review.name} · {review.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <ListingBookingWidget
              rating={listing.rating}
              reviewCount={listing.reviewCount}
            />
          </aside>
        </div>

        {/* More homes */}
        <section className="border-t border-wood/25 bg-cream-2 px-5 py-12 md:px-16 md:py-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-6">
            <h2 className="font-heading text-xl font-semibold md:text-2xl">More homes to consider</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {otherListings.map((l) => (
                <Link
                  key={l.id}
                  href={`/listings/${l.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-wood/30 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(43,33,24,0.12)]"
                >
                  <div className="relative h-36 w-full">
                    <Image
                      src={l.image}
                      alt={`${l.name} — ${l.beds} bedroom home${l.city ? ` in ${l.city}` : ""}`}
                      fill
                      sizes="360px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="font-heading text-[15px] font-semibold">{l.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Star className="h-3 w-3 fill-terracotta text-terracotta" />
                      {l.rating} · {l.guests} guests
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs font-bold text-denim">
                      View home
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Fact({ icon: Icon, label }: { icon: typeof Users; label: string }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
      <Icon className="h-4.5 w-4.5 text-terracotta" strokeWidth={2} />
      {label}
    </span>
  );
}

function RuleCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof LogIn;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-wood/30 bg-card px-4 py-3">
      <Icon className="h-4.5 w-4.5 shrink-0 text-denim" strokeWidth={2} />
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span className="text-sm font-semibold text-ink">{value}</span>
      </div>
    </div>
  );
}
