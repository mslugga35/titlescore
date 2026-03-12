import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TitleScore — AI YouTube CTR Predictor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
              fontWeight: 800,
            }}
          >
            T
          </div>
          <span style={{ fontSize: "48px", fontWeight: 800, color: "white" }}>
            TitleScore
          </span>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Score your YouTube title & thumbnail before you upload. AI-powered CTR prediction.
        </div>
      </div>
    ),
    { ...size }
  );
}
