import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings();
  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/listings/${listing.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const legalRoutes: MetadataRoute.Sitemap = ["privacy-policy", "terms-and-conditions"].map((slug) => ({
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
    {
      url: `${SITE_URL}/properties`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...listingRoutes,
    ...legalRoutes,
  ];
}
