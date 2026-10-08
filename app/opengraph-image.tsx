import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

// The default preview image when someone shares a page without its own photo.
export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3ec",
          color: "#161513",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#b4532a" }}>
          Lagos · Nairobi · Kigali
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 148, letterSpacing: -4, lineHeight: 1 }}>{siteConfig.name}</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#3d3a35", maxWidth: 900 }}>{siteConfig.tagline}</div>
        </div>
        <div style={{ display: "flex", height: 4, width: 120, background: "#161513" }} />
      </div>
    ),
    size,
  );
}
