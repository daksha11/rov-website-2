"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — YOUR PATH
// The five stops, read from lib/ctrla/progress. One component, three
// sizes, so every surface shows the same path the same way:
//
//   full    the home page lead: five editorial rows, the next one lit
//   strip   one line of five dots + the next stop, for mastheads and reveals
//   line    "Next · Look: Your brand kit", for the nav
//
// Renders nothing until the profile is ready (never a wrong first paint)
// and nothing at all without a craft, so it is safe to drop anywhere.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { useCtrlAPath } from "@/lib/ctrla/progress";
import { CRAFT_LABEL, FIRST_PIECE } from "@/lib/ctrla/path";
import type { CraftSlug } from "@/lib/ctrla/profile";
import { ed, edLight, Kicker } from "./editorial";

type Theme = "dark" | "light";

export default function YourPath({
  variant = "strip",
  theme = "dark",
  craft,
  onNavigate,
}: {
  variant?: "full" | "strip" | "line";
  theme?: Theme;
  /** Force a craft (a toolkit page shows its own craft's path). */
  craft?: CraftSlug;
  onNavigate?: () => void;
}) {
  const path = useCtrlAPath(craft);
  if (!path.ready || !path.craft) return null;
  const t = theme === "light" ? edLight : ed;
  const small = theme === "light" ? t.plum : ed.gold;
  const done = path.stops.filter((s) => s.done).length;
  const complete = !path.next;

  if (variant === "line") {
    return (
      <Link href={complete ? "/ctrla/submit" : path.next!.href} onClick={onNavigate} className="ctrla-yourpath-line">
        <span style={{ color: small }}>{complete ? "Path complete" : `Next · ${path.next!.verb}`}</span>
        <span>{complete ? "Show more work" : path.next!.title}</span>
        <span style={{ color: small, opacity: 0.8 }}>{done}/5</span>
      </Link>
    );
  }

  if (variant === "strip") {
    return (
      <div className="ctrla-yourpath-strip" style={{ color: t.ink }}>
        <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: small }}>
          Your path · {CRAFT_LABEL[path.craft]} · {done} of 5
        </span>
        <span className="ctrla-yourpath-dots" aria-hidden>
          {path.stops.map((s) => (
            <i key={s.id} data-done={s.done} data-next={path.next?.id === s.id} style={{ borderColor: small, background: s.done ? small : "transparent" }} title={s.verb} />
          ))}
        </span>
        {path.next ? (
          <Link href={path.next.href} onClick={onNavigate} style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: small, textDecoration: "none", borderBottom: `1px solid ${small}` }}>
            Next · {path.next.verb}: {path.next.title} →
          </Link>
        ) : (
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: small }}>Complete</span>
        )}
      </div>
    );
  }

  // full
  const piece = FIRST_PIECE[path.craft];
  return (
    <section style={{ padding: "clamp(28px,4vw,56px) 0" }}>
      <Kicker color={small}>Your path · {CRAFT_LABEL[path.craft]}</Kicker>
      <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(36px,6vw,88px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: t.ink, margin: "clamp(12px,1.6vw,18px) 0 0" }}>
        {complete ? "You finished." : `${piece.title}.`}
      </h2>
      <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", lineHeight: 1.3, color: small, margin: "clamp(14px,1.8vw,22px) 0 0", maxWidth: 640 }}>
        {complete ? "The rest of the school is yours. Show more, or help someone else finish." : `Five stops. ${done === 0 ? "Start with the first." : `${done} down, ${5 - done} to go.`}`}
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: "clamp(24px,3vw,44px) 0 0" }}>
        {path.stops.map((s, i) => {
          const isNext = path.next?.id === s.id;
          return (
            <li key={s.id} style={{ borderBottom: `1px solid ${t.hair}` }}>
              <Link
                href={s.href}
                onClick={onNavigate}
                className="ctrla-path-row"
                style={{ display: "grid", gridTemplateColumns: "clamp(40px,4vw,64px) 1fr auto", alignItems: "center", gap: "clamp(14px,2vw,28px)", padding: "clamp(18px,2.4vw,32px) 0", textDecoration: "none", opacity: s.done ? 0.62 : 1 }}
              >
                <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.2em", color: small }}>{s.done ? "✓" : String(i + 1).padStart(2, "0")}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: small, marginBottom: 6 }}>
                    {s.verb}
                    {isNext ? " · next" : s.done ? " · done" : ""}
                  </span>
                  <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: isNext ? "clamp(28px,4.4vw,60px)" : "clamp(22px,3vw,40px)", letterSpacing: "-0.03em", lineHeight: 1, color: t.ink, textDecoration: s.done ? "line-through" : "none", textDecorationColor: small }}>
                    {s.title}
                  </span>
                  <span style={{ display: "block", fontFamily: ed.body, fontSize: "clamp(14px,1.4vw,17px)", lineHeight: 1.5, color: t.inkSoft, margin: "8px 0 0", maxWidth: 560 }}>
                    {isNext ? s.blurb : s.counts}
                  </span>
                </span>
                <span style={{ fontFamily: ed.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: small, whiteSpace: "nowrap" }}>
                  {s.done ? "Again" : isNext ? "Go" : "Open"} <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
