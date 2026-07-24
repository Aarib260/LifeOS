"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const EDGE_MARGIN = 8;

/**
 * Positions its children at a screen coordinate (from a contextmenu event),
 * then nudges itself back inside the viewport if it would overflow an
 * edge. Portals to document.body so it always renders above windows,
 * taskbar, etc. regardless of where it's triggered from.
 */
export function ContextMenu({ isOpen, position, onClose, children, className }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState(position);

  // Re-measure and clamp to viewport every time the menu opens at a new spot.
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) {
      setAdjusted(position);
      return;
    }
    const rect = menuRef.current.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    let x = position.x;
    let y = position.y;

    if (x + rect.width + EDGE_MARGIN > innerWidth) {
      x = Math.max(EDGE_MARGIN, innerWidth - rect.width - EDGE_MARGIN);
    }
    if (y + rect.height + EDGE_MARGIN > innerHeight) {
      y = Math.max(EDGE_MARGIN, innerHeight - rect.height - EDGE_MARGIN);
    }
    setAdjusted({ x, y });
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleScroll() {
      onClose();
    }

    // Capture phase so this still closes the menu even if a descendant
    // stops propagation on its own click handler.
    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          style={{ position: "fixed", top: adjusted.y, left: adjusted.x, zIndex: 9999 }}
          className={cn(
            "min-w-[200px] overflow-hidden rounded-xl border border-[var(--border-2)]",
            "bg-[var(--surface-2)]/95 backdrop-blur-xl shadow-2xl py-1.5",
            className
          )}
          onContextMenu={(e) => e.preventDefault()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
