import type { MetadataRoute } from "next";

// Sitemap XML requires absolute URLs, so this can't just use relative
// paths. Set NEXT_PUBLIC_SITE_URL once you have a real deployed domain
// (e.g. NEXT_PUBLIC_SITE_URL=https://lifeos.yourdomain.com in your Vercel
// project env vars) and this picks it up automatically. Until then it
// falls back to a clearly-fake placeholder rather than silently emitting
// broken URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifeos.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
