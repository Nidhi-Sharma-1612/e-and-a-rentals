import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, Calendar, Users, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getListing } from "@/lib/listings";
import { getStripe } from "@/lib/stripe";
import { formatDisplayDate } from "@/lib/date";

export const metadata: Metadata = { title: "Booking confirmed | Book VIP Homes" };

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id: sessionId } = await searchParams;
  const listing = await getListing(id);

  let paid = false;
  let error: string | null = null;
  let checkIn: string | null = null;
  let checkOut: string | null = null;
  let guests: string | null = null;
  let amountTotal: number | null = null;
  let currency = "usd";

  if (!listing) {
    error = "This home could not be found.";
  } else if (!sessionId) {
    error = "No booking session was provided.";
  } else {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.listingId !== listing.id) {
        error = "This confirmation doesn't match this home.";
      } else {
        paid = session.payment_status === "paid";
        checkIn = session.metadata?.checkIn ?? null;
        checkOut = session.metadata?.checkOut ?? null;
        guests = session.metadata?.guests ?? null;
        amountTotal = session.amount_total;
        currency = session.currency ?? "usd";
        if (!paid) error = "We couldn't confirm your payment for this booking.";
      }
    } catch {
      error = "We couldn't look up that booking session.";
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="relative bg-cream">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-20 text-center md:px-16">
          {paid && listing ? (
            <>
              <CheckCircle2 className="h-14 w-14 text-sage" strokeWidth={1.5} />
              <div className="flex flex-col gap-1.5">
                <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                  You&apos;re booked at {listing.name}
                </h1>
                <p className="text-sm text-ink-soft">
                  A confirmation has been sent by Stripe to the email you paid with.
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md border border-wood/30 bg-card p-6 text-left">
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={listing.image}
                    alt={listing.name}
                    fill
                    sizes="(min-width: 768px) 600px, 100vw"
                    className="photo-grade object-cover"
                  />
                </div>
                {checkIn && checkOut && (
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <Calendar className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
                    {formatDisplayDate(checkIn)} – {formatDisplayDate(checkOut)}
                  </div>
                )}
                {guests && (
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <Users className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={2} />
                    {guests} guest{guests === "1" ? "" : "s"}
                  </div>
                )}
                {amountTotal !== null && (
                  <div className="flex items-center justify-between border-t border-wood/25 pt-3 font-semibold text-ink">
                    <span>Total paid</span>
                    <span>
                      {(amountTotal / 100).toFixed(2)} {currency.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/properties"
                className="flex items-center gap-1.5 text-sm font-semibold text-denim hover:text-denim-dark"
              >
                Browse more homes
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </Link>
            </>
          ) : (
            <>
              <XCircle className="h-14 w-14 text-terracotta" strokeWidth={1.5} />
              <div className="flex flex-col gap-1.5">
                <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                  We couldn&apos;t confirm this booking
                </h1>
                <p className="text-sm text-ink-soft">{error}</p>
              </div>
              {listing && (
                <Link
                  href={`/listings/${listing.id}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-denim hover:text-denim-dark"
                >
                  Back to {listing.name}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                </Link>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
