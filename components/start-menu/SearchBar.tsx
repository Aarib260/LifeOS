"use client";

import { motion } from "framer-motion";
import { Check, Bookmark } from "lucide-react";
import { useVisited } from "@/hooks/useVisited";
import { cn } from "@/lib/utils";

interface VisitedToggleProps {
  countryId: string;
}

export default function VisitedToggle({ countryId }: VisitedToggleProps) {
  const { getStatus, setStatus, clearStatus, isLoaded } = useVisited();

  if (!isLoaded) return null;

  const status = getStatus(countryId);

  function handleClick(target: "visited" | "wantToVisit") {
    if (status === target) {
      clearStatus(countryId);
    } else {
      setStatus(countryId, target);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick("visited")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
          status === "visited"
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
        )}
      >
        <Check size={14} />
        Visited
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick("wantToVisit")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
          status === "wantToVisit"
            ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
        )}
      >
        <Bookmark size={14} />
        Want to Visit
      </motion.button>
    </div>
  );
}