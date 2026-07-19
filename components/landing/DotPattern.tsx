import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  /** Radial fade toward center (for hero backgrounds) vs. a straight edge fade (for side panels) */
  fadeDirection?: "radial" | "toRight" | "none";
  color?: string;
}

export function DotPattern({
  className,
  fadeDirection = "radial",
  color = "var(--landing-dot-color)",
}: DotPatternProps) {
  const maskImage =
    fadeDirection === "radial"
      ? "radial-gradient(ellipse 65% 55% at center, transparent 35%, black 100%)"
      : fadeDirection === "toRight"
        ? "linear-gradient(to right, black 40%, transparent 100%)"
        : undefined;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.5px)`,
        backgroundSize: "18px 18px",
        ...(maskImage ? { maskImage, WebkitMaskImage: maskImage } : {}),
      }}
    />
  );
}