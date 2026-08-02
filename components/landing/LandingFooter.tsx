"use client";

import Link from "next/link";
import { ArrowUpRight, Terminal } from "lucide-react";

export function LandingFooter() {
  const status = [
    "Window Manager",
    "Tasks",
    "Calendar",
    "Journal",
    "AI Assistant",
    "Database Connected",
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-1)] bg-black px-6 pt-24 pb-10">

      {/* Giant Background Text */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">

        <span className="select-none text-[12rem] font-black tracking-tight text-white/[0.03] md:text-[18rem]">
          LIFEOS
        </span>

      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* Terminal */}

        <div className="mb-20 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-2">

            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />

          </div>

          <div className="space-y-3 font-mono text-sm">

            <div className="text-white/80">
              <Terminal className="mr-2 inline h-4 w-4" />
              boot lifeos
            </div>

            {status.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-white/60"
              >
                <span className="text-emerald-400">✓</span>
                {item}
              </div>
            ))}

            <div className="pt-2 text-violet-300">
              System Ready<span className="animate-pulse">_</span>
            </div>

          </div>

        </div>

        {/* Footer Grid */}

        <div className="grid gap-12 md:grid-cols-3">

          <div>

            <h3 className="text-3xl font-bold text-white">
              LifeOS
            </h3>

            <p className="mt-4 max-w-sm leading-7 text-white/55">
              A modern browser-based operating system that combines
              productivity, organization and AI into one workspace.
            </p>

          </div>

          <div>

            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              Product
            </h4>

            <div className="space-y-3 text-white/60">

              <a href="/#features" className="block rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">
                Features
              </a>

              <Link href="/login" className="block rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">
                Launch
              </Link>

              <a href="/#faq" className="block rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70">
                FAQ
              </a>

            </div>

          </div>

          <div>

  <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
    Built With
  </h4>

  <div className="flex flex-wrap gap-2">

    {[
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Neon Postgres",
    ].map((tech) => (
      <span
        key={tech}
        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/70"
      >
        {tech}
      </span>
    ))}

  </div>

</div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-6 flex flex-col gap-3 text-sm text-white/40 md:flex-row md:justify-between">

          <span>© 2026 LifeOS</span>

          <a
            href="https://github.com/Aarib260/LifeOS"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
          >
            Built by Aarib • Open Source
          </a>

        </div>

      </div>

    </footer>
  );
}