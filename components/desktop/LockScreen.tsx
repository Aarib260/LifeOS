"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Wallpaper } from "./Wallpaper";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { data: session } = useSession();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onUnlock);
    return () => window.removeEventListener("keydown", onUnlock);
  }, [onUnlock]);

  const time = now?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now?.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "there";

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center"
      onClick={onUnlock}
    >
      <Wallpaper />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-1"
      >
        <span className="text-6xl font-light tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          {time}
        </span>
        <span className="text-sm text-white/60">{date}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-3"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-cyan-400/30 to-indigo-400/30 text-xl font-medium text-white">
          {name[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-white/80">{name}</span>
        <span className="text-xs text-white/40">Click anywhere or press any key to unlock</span>
      </motion.div>
    </div>
  );
}