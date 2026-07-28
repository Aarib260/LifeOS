"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RenameInputProps {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  className?: string;
}

export function RenameInput({ initialValue, onCommit, onCancel, className }: RenameInputProps) {
  const [isInvalid, setIsInvalid] = useState(false);

  function tryCommit(value: string) {
    if (!value.trim()) {
      // Give feedback instead of silently reverting — a quick shake reads
      // as "that didn't work" without needing a toast for something this
      // minor, then gracefully falls back to the original name.
      setIsInvalid(true);
      setTimeout(() => onCancel(), 350);
      return;
    }
    onCommit(value);
  }

  return (
    <motion.input
      autoFocus
      defaultValue={initialValue}
      animate={isInvalid ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onClick={(e) => e.stopPropagation()}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") tryCommit(e.currentTarget.value);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={(e) => tryCommit(e.currentTarget.value)}
      className={
        className ??
        `w-full rounded border px-1 text-center text-[11px] text-[var(--text-1)] outline-none transition-colors ${
          isInvalid ? "border-red-400/70" : "border-cyan-400/50 bg-[var(--surface-1)]"
        }`
      }
    />
  );
}
