import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { ThemeEffect } from "@/components/shared/ThemeEffect";

// Actually load a font instead of just naming one in CSS and hoping the
// visitor's OS happens to have it installed — globals.css referenced
// "Inter" by name but never loaded it via next/font, so almost nobody was
// actually seeing it. Geist is self-hosted (no runtime request to Google
// Fonts, no layout shift) and exposed as a CSS variable so globals.css can
// reference it directly.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

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
    <html lang="en" className={geist.variable}>
      <body>
        <ThemeEffect />
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}