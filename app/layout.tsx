import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { ThemeEffect } from "@/components/shared/ThemeEffect";

// Same NEXT_PUBLIC_SITE_URL env var used by sitemap.ts/robots.ts — set it
// once deployed and this, the sitemap, and robots.txt all pick up the
// real domain together instead of drifting out of sync.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifeos.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LifeOS",
  description: "A browser-based personal operating system",
  openGraph: {
    title: "LifeOS",
    description: "A browser-based personal operating system",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeOS",
    description: "A browser-based personal operating system",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeEffect />
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}