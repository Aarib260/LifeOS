import Link from "next/link";
import { Moon } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Apps", href: "#features" },
  { label: "Security", href: "#" },
  { label: "Roadmap", href: "#" },
  { label: "About", href: "/about" },
];

/**
 * Floating pill nav, matching the reference hero design. This is
 * deliberately styled distinctly from the rest of the site (which uses a
 * warm coral accent) — a cool purple/white palette specific to this hero
 * moment. If that split ends up feeling inconsistent once you see it live,
 * worth deciding whether the whole site should move to this palette, or
 * this stays a one-off "hero moment."
 *
 * "Security" and "Roadmap" don't have matching page sections yet, so they
 * link to "#" for now — wire them up once those sections exist.
 */
export function LandingNav() {
  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/60 px-3 py-2.5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 pl-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <Moon className="h-3.5 w-3.5 fill-white text-white" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">LifeOS</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-white/90"
        >
          Launch LifeOS
          <span aria-hidden>&#8599;</span>
        </Link>
      </div>
    </nav>
  );
}
