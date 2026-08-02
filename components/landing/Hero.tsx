"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { OSPreviewMockup } from "./OSPreviewMockup";
import { HalftoneBackground } from "./HalftoneBackground";
import { BootScreen } from "@/components/desktop/BootScreen";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function Hero() {
  const router = useRouter();
  const [booting, setBooting] = useState(false);

  function handleLaunch() {
    setBooting(true);
  }

  return (
    <section className="relative overflow-hidden bg-black px-6 pb-24 pt-40">
      <HalftoneBackground />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/60"
        >
          Crafted with attention to detail.
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
          A real operating system that runs entirely in your browser —
          windows, a taskbar, a terminal with its own file system. I got
          tired of juggling ten apps for one life, so I built the whole
          desktop instead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={handleLaunch}
            className={`flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90 ${FOCUS_RING}`}
          >
            Launch LifeOS
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/Aarib260/LifeOS"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] ${FOCUS_RING}`}
          >
            View Source
          </a>
        </motion.div>
      </div>

      <div className="relative mt-20">
        <OSPreviewMockup />
      </div>

      {/* Reuses the real desktop's own BootScreen (particle-converge +
          wordmark) rather than a fake knockoff — same component the actual
          /os shell plays on first load. BootScreen itself has no
          sessionStorage/Desktop coupling (only its OSBootSequence wrapper
          does), so it's safe to drop in here standalone. */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[2000]"
          >
            <BootScreen onComplete={() => router.push("/login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
