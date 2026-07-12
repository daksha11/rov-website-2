// app/api/og/daily/route.tsx
// The Daily's link-preview card, rendered in CTRL-A chrome (void + gold).
// With no params it's the page's own OG image. With params it renders a
// personal result card: /api/og/daily?n=12&pct=68&streak=5
// Personal results are also shared as text (the Wordle move); this image
// is what unfurls under the link.

// Next 13.5 exports ImageResponse from next/server (it moves to next/og in 14+).
import { ImageResponse, NextRequest } from "next/server";

export const runtime = "edge";

const VOID = "#0F0820";
const CREAM = "#F0E6E0";
const GOLD = "#E3C24A";
const DIM = "rgba(240,230,224,0.62)";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const n = clampInt(p.get("n"), 0, 9999);
  const pct = clampInt(p.get("pct"), 0, 100);
  const streak = clampInt(p.get("streak"), 0, 9999);
  const personal = pct !== null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: GOLD, textTransform: "uppercase" }}>
            CTRL A · The Daily
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: DIM }}>
            {n !== null ? `No. ${String(n).padStart(2, "0")}` : "Taste Test"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: CREAM, letterSpacing: -3, lineHeight: 1.02 }}>
            {personal ? `I sided with the ${pct}%` : "Is your eye any good?"}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: DIM, marginTop: 24 }}>
            {personal
              ? streak !== null && streak > 1
                ? `Streak: ${streak} days · one test a day`
                : "One test a day · same for everyone"
              : "Two options, one is sharper. New test at midnight ET."}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", width: 220, height: 6, background: GOLD }} />
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: DIM }}>
            rovstudios.com/ctrla/daily
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function clampInt(raw: string | null, min: number, max: number): number | null {
  if (raw === null) return null;
  const v = parseInt(raw, 10);
  if (Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}
