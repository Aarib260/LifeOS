"use client";

import { cn } from "@/lib/utils";

/**
 * A single shimmering placeholder block. Respects reduced-motion via the
 * `motion-reduce:animate-none` variant — Tailwind maps this to
 * `prefers-reduced-motion: reduce` automatically, no JS needed.
 */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={cn(
        "animate-pulse rounded-md bg-[var(--surface-2)] motion-reduce:animate-none",
        className
      )}
    />
  );
}

/** A handful of file/row-shaped skeleton lines, for list-style loading states (Explorer, Recycle Bin). */
export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
          <Skeleton className="h-3 flex-1 rounded" style={{ maxWidth: `${60 + (i % 3) * 10}%` }} />
        </div>
      ))}
    </div>
  );
}

/** Icon-tile-shaped skeleton grid, for Explorer's grid view loading state. */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-wrap content-start gap-1 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex w-20 flex-col items-center gap-1.5 p-2">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-2.5 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}
