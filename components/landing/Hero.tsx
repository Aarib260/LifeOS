"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { OSLiveMockup } from "./OSLiveMockup";
import { GlowArc } from "./GlowArc";
import { DotPattern } from "./DotPattern";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black px-6 pb-24 pt-40">
      <DotPattern className="opacity-40" />
      <GlowArc />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/60"
        >
          Your Life. In One System.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="bg-gradient-to-r from-white to-violet-300 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl"
        >
          LifeOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-base text-white/50"
        >
          A modern, web-based operating system to organize, create and do more
          — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <a
            href="/login"
            className="flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            Launch LifeOS
            <ArrowUpRight className="h-4 w-4" />
          </a>

          {/*
            No demo video exists yet — this button is currently inert
            (no href/onClick) so it doesn't silently 404 or link nowhere.
            Wire it up once you have something for it to actually open.
          */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Watch Demo
          </button>
        </motion.div>
      </div>

      <div className="relative mt-20">
        <OSLiveMockup />
      </div>
    </section>
  );
}
