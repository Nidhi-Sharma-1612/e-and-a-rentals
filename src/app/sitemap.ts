import type { MetadataRoute } from "next";
import { listings } from "@/lib/listings";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/listings/${listing.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const legalRoutes: MetadataRoute.Sitemap = [
    "privacy-policy",
    "terms-and-conditions",
    "cookie-preferences",
  ].map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...listingRoutes,
    ...legalRoutes,
  ];
}
