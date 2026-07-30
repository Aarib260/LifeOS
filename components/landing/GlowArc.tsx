/**
 * The soft purple "horizon glow" arc behind the hero mockup. Pure CSS —
 * a large blurred ellipse clipped by its container's overflow-hidden,
 * no image asset needed.
 */
export function GlowArc() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[420px] -z-10 flex justify-center overflow-hidden">
      <div
        className="h-[600px] w-[1400px] rounded-[100%] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(167,139,250,0.35), rgba(99,102,241,0.12) 45%, transparent 70%)",
        }}
      />
      {/* A thin brighter rim right at the horizon line for the "lit edge" look */}
      <div
        className="absolute top-[240px] h-px w-[900px] opacity-80 blur-md"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(196,181,253,0.8) 35%, rgba(233,213,255,0.9) 50%, rgba(196,181,253,0.8) 65%, transparent)",
        }}
      />
    </div>
  );
}
