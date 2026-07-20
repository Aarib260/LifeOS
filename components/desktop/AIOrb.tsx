"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useIsRevealed } from "./OSBootSequence";
import { useWindowStore } from "@/store/windowStore";
import { APP_REGISTRY } from "@/lib/appRegistry";
import { TASKBAR_HEIGHT } from "@/lib/constants";

export function AIOrb() {
  const isRevealed = useIsRevealed();
  const openApp = useWindowStore((s) => s.openApp);

  const handleClick = () => {
    const app = APP_REGISTRY["ai-assistant"];
    openApp("ai-assistant", { title: app.title, size: app.defaultSize, minSize: app.minSize });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Open AI Assistant"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      style={{ bottom: TASKBAR_HEIGHT + 20 }}
      className="fixed right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full"
    >
      {/* Ambient pulsing glow, independent of the entrance animation above */}
      <motion.span
        className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md"
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative flex h-full w-full items-center justify-center rounded-full border border-cyan-400/30 bg-[var(--bg-panel-90)] backdrop-blur-md">
        <Sparkles className="h-5 w-5 text-[var(--icon-accent)]" />
      </span>
    </motion.button>
  );
}
