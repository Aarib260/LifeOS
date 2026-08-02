import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Next.js auto-detects this file and serves it as the og:image /
// twitter:image for the whole site (app/layout.tsx's metadata doesn't
// need an explicit image field — this file covers it). Doesn't need a
// known deployed domain since Next resolves the image URL relative to
// wherever it's actually served from.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at center, rgba(139,92,246,0.18), transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 22,
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.35)",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 800, color: "#c4b5fd" }}>L</span>
        </div>

        <div style={{ fontSize: 72, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
          LifeOS
        </div>

        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
          A browser-based personal operating system
        </div>
      </div>
    ),
    { ...size }
  );
}
