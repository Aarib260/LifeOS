"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OSMockup } from "./OSMockup";
import { DotPattern } from "./DotPattern";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-24">
      <DotPattern className="opacity-70" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight text-[var(--landing-heading)] sm:text-6xl"
        >
          Build good.
          <br />
          Live better.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-sm text-[var(--text-3)] sm:text-base"
        >
          Tasks, habits, goals, calendar, journal, and an AI assistant — all living
          inside a browser-based desktop that feels like a real OS, not another dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            className="rounded-full bg-[var(--landing-accent)] px-6 py-3 text-sm font-semibold text-[var(--landing-accent-text)] transition-colors hover:bg-[var(--landing-accent-hover)]"
          >
            Start for free
          </Link>
          <Link
            href="#features"
            className="rounded-full border border-[var(--border-3)] bg-[var(--surface-1)] px-6 py-3 text-sm font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
          >
            Features
          </Link>
        </motion.div>
      </div>

      <div className="relative mt-16">
        <OSMockup />
      </div>
    </section>
  );
}
