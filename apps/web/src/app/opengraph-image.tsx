import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cykani — Stealth Browser Automation Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#08090b",
          fontFamily: "JetBrains Mono, monospace",
          color: "#ededed",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 24px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0c0d10",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 10, height: 10, background: "#52525b" }} />
            <div style={{ width: 10, height: 10, background: "#3f3f46" }} />
            <div style={{ width: 10, height: 10, background: "#22c55e" }} />
          </div>
          <span style={{ color: "#52525b", fontSize: 16 }}>cykani — terminal</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, background: "#22c55e" }} />
            <span style={{ color: "#52525b", fontSize: 13, letterSpacing: "0.05em" }}>CONNECTED</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          <span>Browser Infrastructure</span>
          <br />
          <span style={{ color: "#71717a" }}>for AI Agents</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            color: "#52525b",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            gap: 32,
          }}
        >
          <span>800B+ Tokens</span>
          <span>1M+ Hours</span>
          <span>&lt;1s Sessions</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
