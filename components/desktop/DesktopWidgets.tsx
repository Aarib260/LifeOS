"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsRevealed } from "./OSBootSequence";

export function DesktopWidgets() {
  const isRevealed = useIsRevealed();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const time = now?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now?.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="absolute right-4 top-4 z-10 flex flex-col gap-2"
    >
      <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] px-4 py-3 backdrop-blur-md">
        <span className="block text-2xl font-light text-[var(--text-1)]">{time}</span>
        <span className="block text-[11px] text-[var(--text-4)]">{date}</span>
      </div>
    </motion.div>
  );
}
