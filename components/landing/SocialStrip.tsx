import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Neon Postgres",
  "Auth.js",
  "Zustand",
];

/**
 * A flat, low-key strip between the Hero and FeatureGrid — deliberately
 * plain (no radial glow, no big headline) so the page doesn't repeat the
 * same "glow on black" rhythm three sections in a row. Doubles as light
 * social proof: the real tech stack and a link to the actual repo, since
 * the rest of the page didn't surface either.
 */
export function SocialStrip() {
  return (
    <section className="relative border-y border-white/10 bg-black px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-center text-sm text-white/50 md:text-left">
          Open source · built solo for Hack Club hackathons
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href="https://github.com/Aarib260/LifeOS"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ArrowUpRight className="h-4 w-4" />
          View on GitHub
        </Link>
      </div>
    </section>
  );
}
