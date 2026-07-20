"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BootScreen } from "./BootScreen";
import { LockScreen } from "./LockScreen";

type Phase = "checking" | "booting" | "revealing" | "locked" | "unlocked";

const BOOT_SESSION_KEY = "lifeos-booted";
const REVEAL_DURATION_MS = 1900;

const RevealContext = createContext(false);

/** Read by Desktop/Taskbar to know whether their entrance animations should have played yet. */
export function useIsRevealed() {
  return useContext(RevealContext);
}

/**
 * Desktop mounts as soon as we're past "checking" — even while the boot
 * overlay is still opaque on top of it — rather than only mounting once
 * unlocked. That's what lets the "reveal" (taskbar slides up, icons
 * bounce in) be the real Desktop's own entrance animation playing in
 * sync with the boot overlay fading away, instead of a fake duplicate
 * mockup built just for this animation.
 */
export function OSBootSequence({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    const hasBooted = sessionStorage.getItem(BOOT_SESSION_KEY);
    setPhase(hasBooted ? "locked" : "booting");
  }, []);

  useEffect(() => {
    if (phase !== "revealing") return;
    const t = setTimeout(() => setPhase("locked"), REVEAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleBootComplete = () => {
    sessionStorage.setItem(BOOT_SESSION_KEY, "1");
    setPhase("revealing");
  };

  const handleUnlock = () => setPhase("unlocked");

  const isDesktopMounted = phase !== "checking";
  const isRevealed = phase === "revealing" || phase === "locked" || phase === "unlocked";

  return (
    <RevealContext.Provider value={isRevealed}>
      {phase === "checking" && <div className="fixed inset-0 z-[2000] bg-[#0A0E14]" />}

      {isDesktopMounted && (
        <div style={{ visibility: phase === "booting" ? "hidden" : "visible" }}>{children}</div>
      )}

      <AnimatePresence mode="wait">
        {phase === "booting" && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[2000]"
          >
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
    </RevealContext.Provider>
  );
}
