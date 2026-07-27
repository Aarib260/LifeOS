"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore, type Toast, type ToastVariant } from "@/store/toastStore";
import { cn } from "@/lib/utils";
import { TASKBAR_HEIGHT } from "@/lib/constants";

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-400" },
  error: { icon: XCircle, className: "text-red-400" },
  info: { icon: Info, className: "text-cyan-400" },
};

/**
 * Mounted once (in Desktop.tsx) — every `toast.success/error/info(...)`
 * call anywhere in the app shows up here, stacked bottom-center above the
 * taskbar. Each toast auto-dismisses on its own timer but can also be
 * closed manually.
 */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[10000] flex -translate-x-1/2 flex-col items-center gap-2"
      style={{ bottom: TASKBAR_HEIGHT + 16 }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast: t }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon: Icon, className } = VARIANT_STYLES[t.variant];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(t.id), t.duration);
    return () => clearTimeout(timer);
  }, [t.id, t.duration, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-[var(--border-2)] bg-[var(--surface-2)]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl"
    >
      <Icon className={cn("h-4 w-4 shrink-0", className)} />
      <span className="text-[13px] text-[var(--text-1)]">{t.message}</span>
      <button
        type="button"
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss notification"
        className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[var(--text-4)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}