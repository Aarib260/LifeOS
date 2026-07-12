import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generates a unique window instance id. Not cryptographic — just needs to be unique per session. */
export function generateWindowId(): string {
  return `win_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Clamp a number between min and max. Used for drag/resize bounds checking. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}