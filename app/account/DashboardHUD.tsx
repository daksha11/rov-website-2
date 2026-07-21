"use client";

/**
 * DashboardHUD · the command center at the top of /account.
 *
 * Turns the old settings-style card stack into a glanceable bento: live,
 * count-up credits, a streak flame, contributions at a glance, then a row of
 * quick-launch shortcuts into the CTRL-A world (the Daily, Brand Kit,
 * Contribute, Vantage, your public page). This is the "fun, interactive
 * command center" surface; the detailed earn/spend, ledger, contributions and
 * saved sections live below it, unchanged.
 *
 * CTRL-A themed: cosmic ground, cream text, gold + rose + plum accents,
 * Norwige / Neue Montreal. Numbers animate in (respecting reduced motion).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const C = {
  ground: "#0F0820",
  panel: "#24123A",
  plum: "#8E76B8",
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  hair: "rgba(240,230,224,0.1)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};
const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
const NORWIGE = "Norwige, sans-serif";

const tile: React.CSSProperties = {
  position: "relative",
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  padding: "clamp(18px,3vw,24px)",
  overflow: "hidden",
};

const kicker: React.CSSProperties = {
  margin: 0,
  fontSize: 10.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: C.faint,
  fontWeight: 700,
};

export interface StreakStats {
  current_streak: number;
  longest_streak: number;
  taste_plays: number;
  taste_agreements: number;
}

/** Count a number up from 0 → value once, easing out. Instant if reduced-motion. */
function useCountUp(value: number | null, ms = 850) {
  const [shown, setShown] = useState(0);
  const raf = useRef(0);
  const from = useRef(0);
  useEffect(() => {
    if (value === null) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const startVal = from.current;
    const delta = value - startVal;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setShown(Math.round(startVal + delta * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
      else from.current = value;
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, ms]);
  return shown;
}

function Flame({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path
        d="M12 2c1.2 3.2-.8 4.6-2 6.2C8.6 10.2 8 11.8 8 13.4 8 16.5 9.8 19 12 19s4-2.5 4-5.6c0-1.1-.3-2-.9-3 .3.2.7.6 1 1.1.7-2.2-.4-5-2.4-6.5C13.6 3.7 12.7 2.9 12 2z"
        fill={active ? C.gold : "rgba(240,230,224,0.18)"}
      />
      {active && (
        <path
          d="M12 10c.7 1 .9 1.9.9 2.7 0 1.7-1 2.9-2.1 2.9-.9 0-1.6-.7-1.6-1.7 0-1.6 1.4-2.2 2.8-3.9z"
          fill={C.rose}
        />
      )}
    </svg>
  );
}

interface Props {
  name: string;
  points: number | null;
  streak: StreakStats | null;
  contribCount: number;
  featuredCount: number;
  handle: string | null;
  isPublic: boolean;
}

export default function DashboardHUD({
  name,
  points,
  streak,
  contribCount,
  featuredCount,
  handle,
  isPublic,
}: Props) {
  const shownPoints = useCountUp(points);
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;
  const firstName = name.trim().split(/\s+/)[0] || "there";

  const shortcuts: { label: string; sub: string; href: string; external?: boolean }[] = [
    { label: "Play the Daily", sub: "Keep the streak", href: "/ctrla/daily" },
    { label: "Brand Kit", sub: "Build a system", href: "/ctrla/brand-kit" },
    { label: "Contribute", sub: "Get featured", href: "/ctrla/submit" },
    { label: "Vantage", sub: "Focus and make", href: "/ctrla/the-fold" },
  ];

  return (
    <section aria-label="Command center" style={{ marginTop: "clamp(20px,4vw,28px)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <p style={{ ...kicker, color: C.gold }}>Command center</p>
        <p style={{ margin: 0, fontSize: 13, color: C.faint }}>Welcome back, {firstName}.</p>
      </div>

      {/* ── Glanceable stat bento ── */}
      <div className="hud-stats">
        {/* Credits — the hero tile */}
        <div style={{ ...tile, gridColumn: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 148 }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 100% 0%, rgba(227,194,74,0.14), transparent 55%)`, pointerEvents: "none" }} />
          <p style={kicker}>Your credits</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 8 }}>
            <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(42px,9vw,64px)", lineHeight: 0.85, color: C.gold, fontVariantNumeric: "tabular-nums" }}>
              {points === null ? "…" : shownPoints.toLocaleString()}
            </span>
            <span style={{ fontFamily: NEUE, fontSize: 13, color: C.faint, marginBottom: 6 }}>credits</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <a href="#earn" style={miniBtn(true)}>Earn more</a>
            <a href="#spend" style={miniBtn(false)}>Spend</a>
          </div>
        </div>

        {/* Streak */}
        <div style={{ ...tile, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 148 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={kicker}>Streak</p>
            <Flame active={current > 0} />
          </div>
          <div>
            <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(30px,6vw,44px)", lineHeight: 0.9, color: current > 0 ? C.cream : C.faint, fontVariantNumeric: "tabular-nums" }}>
              {current}
            </span>
            <span style={{ fontFamily: NEUE, fontSize: 13, color: C.faint, marginLeft: 6 }}>
              {current === 1 ? "day" : "days"}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: C.faint }}>
            {current > 0 ? `Longest: ${longest}` : "Play the Daily to start"}
          </p>
        </div>

        {/* Contributions */}
        <Link href="#contributions" style={{ ...tile, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 148, textDecoration: "none" }}>
          <p style={kicker}>Contributions</p>
          <div>
            <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(30px,6vw,44px)", lineHeight: 0.9, color: C.cream, fontVariantNumeric: "tabular-nums" }}>
              {contribCount}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: C.gold, fontWeight: 600 }}>
            {featuredCount > 0 ? `${featuredCount} featured →` : "Track yours →"}
          </p>
        </Link>
      </div>

      {/* ── Quick-launch shortcuts ── */}
      <div style={{ marginTop: 14 }}>
        <div className="hud-shortcuts">
          {shortcuts.map((s) => (
            <Link key={s.label} href={s.href} className="hud-shortcut" style={{ ...tile, padding: "16px 18px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 3, minHeight: 76, justifyContent: "center" }}>
              <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: 15.5, color: C.cream }}>{s.label}</span>
              <span style={{ fontSize: 12, color: C.faint }}>{s.sub}</span>
            </Link>
          ))}
          {isPublic && handle && (
            <Link href={`/ctrla/u/${handle}`} className="hud-shortcut" style={{ ...tile, padding: "16px 18px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 3, minHeight: 76, justifyContent: "center", borderColor: "rgba(227,194,74,0.3)" }}>
              <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: 15.5, color: C.gold }}>Your public page</span>
              <span style={{ fontSize: 12, color: C.faint }}>@{handle}</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .hud-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .hud-shortcuts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .hud-shortcut { transition: transform .18s ease, border-color .18s ease; }
        .hud-shortcut:hover { transform: translateY(-2px); border-color: rgba(227,194,74,0.4) !important; }
        @media (max-width: 640px) {
          .hud-stats { grid-template-columns: repeat(2, 1fr); }
          .hud-stats > :first-child { grid-column: span 2; }
          .hud-shortcuts { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}

function miniBtn(primary: boolean): React.CSSProperties {
  return {
    fontFamily: NEUE,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    textDecoration: "none",
    padding: "9px 16px",
    borderRadius: 999,
    color: primary ? "#160C28" : C.cream,
    background: primary ? C.gold : "transparent",
    border: `1px solid ${primary ? C.gold : "rgba(240,230,224,0.24)"}`,
    whiteSpace: "nowrap",
  };
}
