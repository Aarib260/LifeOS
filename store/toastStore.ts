import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant?: ToastVariant, duration?: number) => string;
  dismiss: (id: string) => void;
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `toast-${counter}`;
}

const DEFAULT_DURATION_MS = 3200;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (message, variant = "info", duration = DEFAULT_DURATION_MS) => {
    const id = nextId();
    set((s) => ({ toasts: [...s.toasts, { id, message, variant, duration }] }));
    return id;
  },

  dismiss: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

/**
 * Convenience wrappers so call sites don't need to pull in the hook just
 * to fire a one-off toast from inside an event handler or async function
 * (e.g. `toast.error("Couldn't delete that")` instead of wiring up
 * useToastStore().show in every component that might fail an action).
 */
export const toast = {
  success: (message: string, duration?: number) => useToastStore.getState().show(message, "success", duration),
  error: (message: string, duration?: number) => useToastStore.getState().show(message, "error", duration),
  info: (message: string, duration?: number) => useToastStore.getState().show(message, "info", duration),
};