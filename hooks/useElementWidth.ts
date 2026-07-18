"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tailwind's sm:/md: breakpoints key off the browser viewport, not an
 * element's own size — useless for responsive layout *inside* a
 * resizable window, since the window can be 300px wide on a 1920px
 * viewport. This measures the actual element directly instead.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}