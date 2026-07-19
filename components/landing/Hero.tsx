"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OSMockup } from "./OSMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Your life.
          <br />
          One operating system.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-sm text-white/50 sm:text-base"
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
            className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-medium text-[#0A0E14] transition-colors hover:bg-cyan-300"
          >
            Get Started Free
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.05]"
          >
            See Features
          </Link>
        </motion.div>
      </div>

      <div className="mt-16">
        <OSMockup />
      </div>
    </section>
  );
}