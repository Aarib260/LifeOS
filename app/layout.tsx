import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { ThemeEffect } from "@/components/shared/ThemeEffect";

export const metadata: Metadata = {
  title: "LifeOS",
  description: "A browser-based personal operating system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeEffect />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}