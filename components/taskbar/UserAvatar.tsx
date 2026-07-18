"use client";

import { User } from "lucide-react";

export function UserAvatar() {
  return (
    <button
      type="button"
      aria-label="User"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-400/30 to-indigo-400/30 text-white/80 transition-colors hover:border-cyan-400/40"
    >
      <User className="h-4 w-4" />
    </button>
  );
}
