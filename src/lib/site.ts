// Single source of truth for the production domain. Update this once the
// site has a real domain, and sitemap/robots/OG metadata all follow.
export const SITE_URL = "https://bookviphomes.com";
export const SITE_NAME = "Book VIP Homes";
export const CONTACT_EMAIL = "eddie@bookviphomes.com";

// `request.nextUrl.origin` reflects whatever Host header the Node process
// itself received — behind a reverse proxy that doesn't forward the
// original Host (common on budget/shared hosts), that's the app's own
// internal bind address (e.g. http://0.0.0.0:3000), not the public URL a
// guest's browser can reach. Prefer the standard X-Forwarded-* headers,
// which carry the original client-facing host even when Host doesn't.
export function getRequestOrigin(request: Request): string {
  // Explicit override, for hosts whose proxy doesn't set forwarded headers
  // either — set this in the deployment's env vars and skip guessing.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  // Proxy chains can append multiple comma-separated values; the original
  // client-facing one is first.
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (proto && host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}
