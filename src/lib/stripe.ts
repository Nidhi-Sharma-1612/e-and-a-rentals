// Server-only Stripe client. Never import this from a "use client" file —
// it reads STRIPE_SECRET_KEY, which must not reach the browser bundle.
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  client = new Stripe(secretKey);
  return client;
}
