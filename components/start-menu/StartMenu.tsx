"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useWindowManager";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  countryId: string;
  size?: number;
}

export default function FavoriteButton({ countryId, size = 20 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  if (!isLoaded) return null; // avoid hydration flash

  const active = isFavorite(countryId);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation(); // prevent bubbling if inside a clickable Card
        toggleFavorite(countryId);
      }}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-xl border transition-colors",
        active
          ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
      )}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={size} fill={active ? "currentColor" : "none"} />
    </motion.button>
  );
}