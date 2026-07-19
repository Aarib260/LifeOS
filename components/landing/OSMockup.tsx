"use client";

import { motion } from "framer-motion";
import { CheckSquare, Repeat, Target, Sparkles } from "lucide-react";

/**
 * A stylized, illustrative mockup of the LifeOS desktop — built from the
 * same glass-panel/cyan visual language as the real shell, not an actual
 * screenshot. Keeps the hero visual in sync with the product's real
 * aesthetic without depending on a static image asset.
 */
export function OSMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0E14] shadow-2xl">
        {/* Ambient backdrop, echoing the real Wallpaper component */}
        <div className="absolute inset-0">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>

        <div className="relative aspect-[16/10] p-6">
          {/* Two floating "windows" */}
          <motion.div
            className="absolute left-6 top-8 w-56 rounded-xl border border-white/[0.08] bg-[#12161F]/90 shadow-xl backdrop-blur-xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] px-3">
              <CheckSquare className="h-3 w-3 text-cyan-300" />
              <span className="text-[10px] text-white/60">Tasks</span>
            </div>
            <div className="space-y-1.5 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full border border-white/25" />
                  <div className="h-1.5 flex-1 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute right-6 top-16 w-48 rounded-xl border border-white/[0.08] bg-[#12161F]/90 shadow-xl backdrop-blur-xl"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] px-3">
              <Repeat className="h-3 w-3 text-cyan-300" />
              <span className="text-[10px] text-white/60">Habits</span>
            </div>
            <div className="flex items-center gap-1 p-3">
              {[1, 1, 1, 0, 1, 0, 0].map((v, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full ${v ? "bg-cyan-400/70" : "border border-white/15"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Taskbar */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0D1117]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
            {[CheckSquare, Repeat, Target, Sparkles].map((Icon, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-100/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}