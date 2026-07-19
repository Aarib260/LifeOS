"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BootScreen } from "./BootScreen";
import { LockScreen } from "./LockScreen";

type Phase = "checking" | "booting" | "locked" | "unlocked";

const BOOT_SESSION_KEY = "lifeos-booted";

export function OSBootSequence({ children }: { children: ReactNode }) {
  // Starts as "checking" rather than assuming booting/locked, since
  // sessionStorage isn't available during server render — this avoids a
  // one-frame flash of the boot screen on visits where it should be skipped.
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    const hasBooted = sessionStorage.getItem(BOOT_SESSION_KEY);
    setPhase(hasBooted ? "locked" : "booting");
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem(BOOT_SESSION_KEY, "1");
    setPhase("locked");
  };

  const handleUnlock = () => setPhase("unlocked");

  return (
    <>
      {phase === "checking" && <div className="fixed inset-0 z-[2000] bg-[#0A0E14]" />}

      <AnimatePresence mode="wait">
        {phase === "booting" && (
          <motion.div key="boot" exit={{ opacity: 0 }} className="fixed inset-0 z-[2000]">
            <BootScreen onComplete={handleBootComplete} />
          </motion.div>
        )}
        {phase === "locked" && (
          <motion.div
            key="lock"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[2000]"
          >
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "unlocked" && children}
    </>
  );
}