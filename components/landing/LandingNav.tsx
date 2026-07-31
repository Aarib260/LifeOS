"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "/about" },
];

const ROADMAP_HREF = "https://github.com/Aarib260/LifeOS/issues";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/**
 * Floating pill nav, matching the reference hero design. This is
 * deliberately styled distinctly from the rest of the site (which uses a
 * warm coral accent) — a cool purple/white palette specific to this hero
 * moment. If that split ends up feeling inconsistent once you see it live,
 * worth deciding whether the whole site should move to this palette, or
 * this stays a one-off "hero moment."
 *
 * "Security" was dropped — there's no security page to link to yet, and a
 * dead "#" link is worse than not having the item. "Roadmap" now points to
 * the real GitHub issues board instead of a dead "#" until an actual
 * roadmap page exists.
 *
 * Below md, the link row used to just disappear with no way to reach it —
 * this now opens as a dropdown panel instead of silently hiding the links.
 */
export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
      <div className="rounded-[28px] border border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link href="/" className={`flex items-center gap-2.5 rounded-full pl-2 ${FOCUS_RING}`}>
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
                className={`rounded text-[13px] text-white/70 transition-colors hover:text-white ${FOCUS_RING}`}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={ROADMAP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded text-[13px] text-white/70 transition-colors hover:text-white ${FOCUS_RING}`}
            >
              Roadmap
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={`flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-white/90 ${FOCUS_RING}`}
            >
              Launch LifeOS
              <span aria-hidden>&#8599;</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 md:hidden ${FOCUS_RING}`}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white ${FOCUS_RING}`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={ROADMAP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`rounded-lg px-2 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white ${FOCUS_RING}`}
            >
              Roadmap
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
