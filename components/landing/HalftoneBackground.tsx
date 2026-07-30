/**
 * Static halftone/dithered texture background — colorful gradient blobs
 * revealed only through a repeating dot-grid mask. Pure CSS: no WebGL,
 * no JS animation loop, no per-frame cost. Just compositing, so it's
 * cheap even on integrated graphics or software-rendered browsers.
 */
const COLOR_BLOBS = [
  "radial-gradient(ellipse 45% 40% at 20% 15%, rgba(139,92,246,0.9), transparent 60%)",
  "radial-gradient(ellipse 40% 35% at 75% 10%, rgba(236,72,153,0.55), transparent 60%)",
  "radial-gradient(ellipse 50% 45% at 15% 55%, rgba(79,70,229,0.8), transparent 60%)",
  "radial-gradient(ellipse 55% 50% at 60% 55%, rgba(124,58,237,0.85), transparent 60%)",
  "radial-gradient(ellipse 40% 35% at 90% 65%, rgba(59,130,246,0.5), transparent 60%)",
  "radial-gradient(ellipse 45% 40% at 35% 90%, rgba(147,51,234,0.6), transparent 60%)",
].join(", ");

const DOT_MASK = "radial-gradient(circle, white 1.1px, transparent 1.6px)";

export function HalftoneBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: COLOR_BLOBS,
          maskImage: DOT_MASK,
          maskSize: "5px 5px",
          maskRepeat: "repeat",
          WebkitMaskImage: DOT_MASK,
          WebkitMaskSize: "5px 5px",
          WebkitMaskRepeat: "repeat",
        }}
      />

      {/* Fade to solid black toward the bottom so it reads as a background
          settling into the mockup below, not a texture stopping abruptly */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
    </div>
  );
}