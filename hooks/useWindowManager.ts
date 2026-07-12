"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useResizable";
import { STORAGE_KEYS } from "@/lib/constants";

export function useFavorites() {
  const { value: favorites, setValue: setFavorites, isLoaded } =
    useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);

  const isFavorite = useCallback(
    (countryId: string) => favorites.includes(countryId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (countryId: string) => {
      setFavorites((prev) =>
        prev.includes(countryId)
          ? prev.filter((id) => id !== countryId)
          : [...prev, countryId]
      );
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (countryId: string) => {
      setFavorites((prev) => prev.filter((id) => id !== countryId));
    },
    [setFavorites]
  );

  return { favorites, isFavorite, toggleFavorite, removeFavorite, isLoaded };
}