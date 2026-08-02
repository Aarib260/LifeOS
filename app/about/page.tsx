"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Sparkles, ExternalLink } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DotPattern } from "@/components/landing/DotPattern";

// Local stagger variants — the previous version imported these from
// lib/appRegistry.ts, but they were never actually defined there. Defined
// locally here since this page is the only place that uses them.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <LandingNav />

      <div className="relative overflow-hidden px-6 pb-24 pt-40">
        <DotPattern
          fadeDirection="none"
          className="pointer-events-none absolute inset-0 opacity-30"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative mx-auto max-w-3xl"
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <Layers className="h-7 w-7 text-violet-300" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">About LifeOS</h1>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              A browser-based personal operating system for organizing your
              tasks, habits, goals, notes and files in one place — built
              solo, one hackathon at a time.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <Panel className="p-8">
              <h2 className="mb-3 text-xl font-semibold text-white">What is LifeOS?</h2>
              <p className="leading-relaxed text-white/65">
                LifeOS simulates a desktop operating system entirely in the
                browser — a window manager, taskbar, and Start Menu, backed
                by real functional apps: Tasks, Habits, Goals, Calendar,
                Journal, an AI Assistant, a Terminal with a virtual file
                system, a File Explorer, and an App Store for adding more
                apps over time. Your data is stored in your own Neon
                Postgres database, with authentication handled by Auth.js.
              </p>
            </Panel>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <Panel className="p-8">
              <h2 className="mb-3 text-xl font-semibold text-white">How it&apos;s built</h2>
              <p className="mb-4 leading-relaxed text-white/65">
                LifeOS is built with Next.js, TypeScript and Tailwind CSS,
                animated with Framer Motion, and uses Zustand for window
                management state and TanStack Query for data fetching. It
                grew out of an earlier country-explorer project and has
                since been rebuilt phase by phase into a full OS shell.
              </p>
              <div className="flex items-center gap-2 text-sm text-violet-300">
                <Sparkles className="h-4 w-4" />
                <span>Built for Hack Club hackathons</span>
              </div>
            </Panel>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Panel className="p-8 text-center">
              <p className="mb-4 text-white/60">
                LifeOS is open source. Bug reports, feedback and
                contributions are all welcome.
              </p>
              <Link
                href="https://github.com/Aarib260/LifeOS"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.08] ${FOCUS_RING}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View on GitHub
              </Link>
            </Panel>
          </motion.div>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  );
}
