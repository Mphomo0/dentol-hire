import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Dantol Hire — Tool, Equipment & Machinery Rental in Johannesburg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/images/logo/logo.png")
);
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

export default async function Image() {
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
          background: "#060a12",
          backgroundImage: "linear-gradient(160deg, #0d1830 0%, #060a12 60%)",
        }}
      >
        <img src={logoSrc} width={560} height={181} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 34,
            fontWeight: 600,
            color: "#e8edf5",
            letterSpacing: -0.5,
          }}
        >
          Tool, Equipment &amp; Machinery Rental
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 26,
            color: "#8b96a8",
          }}
        >
          Johannesburg · Fast quotes · Well-maintained fleet
        </div>
        <div style={{ display: "flex", marginTop: 48, gap: 8 }}>
          <div
            style={{ width: 120, height: 6, borderRadius: 999, background: "#0079f5" }}
          />
          <div
            style={{ width: 120, height: 6, borderRadius: 999, background: "#38d45d" }}
          />
          <div
            style={{ width: 120, height: 6, borderRadius: 999, background: "#cfe900" }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
