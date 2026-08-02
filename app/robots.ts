import type { MetadataRoute } from "next";

// Next.js auto-serves this as /robots.txt. Uses the same
// NEXT_PUBLIC_SITE_URL env var as sitemap.ts — set that once deployed and
// both pick up the real domain automatically.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifeos.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/os", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
