"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_DURATION = 2.2; // seconds

export function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    const timeout = setTimeout(onComplete, BOOT_DURATION * 1000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#0A0E14]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
          <span className="text-xl font-semibold text-cyan-300">L</span>
        </div>
        <span className="text-lg font-medium tracking-tight text-white/90">LifeOS</span>
      </motion.div>

      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: BOOT_DURATION, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}