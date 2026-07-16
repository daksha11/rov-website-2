"use client";

/**
 * WalletCard · the member's balance with verbs.
 * Balance large, then two columns: ways to earn (the claimable rewards + the
 * Daily) and what it unlocks (the spend costs, live from config). This is the
 * inline earn path the submit pages link back to, so a member is never left
 * staring at a number with no next step.
 */

import Link from "next/link";
import { REWARDS, COSTS, CLAIMABLE, INSTAGRAM_URL } from "@/lib/credits/config";

const C = {
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  hair: "rgba(240,230,224,0.1)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};
const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
const NORWIGE = "Norwige, sans-serif";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

// Earn rows shown on the profile. The Daily and IG are links; the rest name
// the action and its value so the path from balance to more is always visible.
const EARN_ROWS: { label: string; points: string; href: string }[] = [
  { label: "Play the Daily", points: "+10 and up", href: "/ctrla" },
  { label: REWARDS["follow-instagram"].label, points: `+${REWARDS["follow-instagram"].points}`, href: INSTAGRAM_URL },
  { label: "Complete a guide", points: `+${REWARDS["guide-complete"].points}`, href: "/ctrla" },
  { label: "Get a contribution approved", points: `+${REWARDS["contribution-approved"].points}`, href: "/ctrla/submit" },
  { label: "Get featured", points: `+${REWARDS["contribution-featured"].points}`, href: "/ctrla/submit" },
];

const SPEND_ROWS: { label: string; cost: number; href: string }[] = [
  { label: "Brand kit export", cost: COSTS["brand-kit-export"], href: "/ctrla/brand-kit" },
  { label: "Submit art", cost: COSTS["art-feature"], href: "/ctrla/submit/art" },
  { label: "Submit a story", cost: COSTS["story-feature"], href: "/ctrla/submit/story" },
];

export default function WalletCard({ points }: { points: number | null }) {
  return (
    <section style={{ ...card, marginTop: 16, padding: "clamp(22px,4vw,30px)", fontFamily: NEUE }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Your balance</p>
          <p style={{ margin: "4px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 40, lineHeight: 1, color: C.gold }}>
            {points === null ? "…" : points.toLocaleString()}
          </p>
        </div>
        <span style={{ fontSize: 12, color: C.faint }}>credits</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 22 }} className="wallet-cols">
        <div>
          <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>Ways to earn</p>
          <div style={{ display: "grid", gap: 2 }}>
            {EARN_ROWS.map((r) => {
              const external = r.href.startsWith("http");
              const inner = (
                <>
                  <span style={{ fontSize: 13.5, color: C.soft }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{r.points}</span>
                </>
              );
              const style: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 2px", borderBottom: `1px solid ${C.hair}`, textDecoration: "none" };
              return external ? (
                <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>
              ) : (
                <Link key={r.label} href={r.href} style={style}>{inner}</Link>
              );
            })}
          </div>
        </div>

        <div>
          <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>What it unlocks</p>
          <div style={{ display: "grid", gap: 2 }}>
            {SPEND_ROWS.map((r) => (
              <Link key={r.label} href={r.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 2px", borderBottom: `1px solid ${C.hair}`, textDecoration: "none" }}>
                <span style={{ fontSize: 13.5, color: C.soft }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>{r.cost}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 520px){ .wallet-cols{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
