"use client";

import { useCallback, useState } from "react";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";

/** A real folder id, or the special Recycle Bin pseudo-location. */
export type ExplorerLocation = string | "recycle-bin";

export function useExplorerNavigation(initial: ExplorerLocation = DEFAULT_ROOT_FOLDER_IDS.desktop) {
  const [current, setCurrent] = useState<ExplorerLocation>(initial);
  const [backStack, setBackStack] = useState<ExplorerLocation[]>([]);
  const [forwardStack, setForwardStack] = useState<ExplorerLocation[]>([]);

  const navigateTo = useCallback(
    (location: ExplorerLocation) => {
      if (location === current) return;
      setBackStack((prev) => [...prev, current]);
      setForwardStack([]);
      setCurrent(location);
    },
    [current]
  );

  const goBack = useCallback(() => {
    setBackStack((prev) => {
      if (prev.length === 0) return prev;
      const target = prev[prev.length - 1];
      setForwardStack((f) => [current, ...f]);
      setCurrent(target);
      return prev.slice(0, -1);
    });
  }, [current]);

  const goForward = useCallback(() => {
    setForwardStack((prev) => {
      if (prev.length === 0) return prev;
      const target = prev[0];
      setBackStack((b) => [...b, current]);
      setCurrent(target);
      return prev.slice(1);
    });
  }, [current]);

  return {
    current,
    navigateTo,
    goBack,
    goForward,
    canGoBack: backStack.length > 0,
    canGoForward: forwardStack.length > 0,
  };
}
