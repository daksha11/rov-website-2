"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOLKIT JUMP-NAV (shared)
// One sticky chapter bar for every toolkit guide. Scroll-spy
// underlines the chapter you are actually in; a hairline
// progress bar tracks reading depth in the sector accent.
// Every guide passes its own [id, label] chapter list.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { edLight as ed, Bleed } from "./editorial";

export type JumpItem = [id: string, label: string];

export default function ToolkitJumpNav({ accent, items }: { accent: string; items: JumpItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        // Reading progress across the whole page.
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        // Active chapter = last anchor that crossed 45% of the viewport.
        let current: string | null = null;
        for (const [id] of items) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [items]);

  return (
    <nav
      aria-label="Toolkit chapters"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(240,230,224,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: `1px solid ${ed.hair}`,
      }}
    >
      <Bleed
        className="ctrla-jumpbar"
        style={{ display: "flex", alignItems: "stretch", gap: "clamp(14px,2.4vw,30px)", padding: "0 clamp(18px,5vw,64px)", overflowX: "auto" }}
      >
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: accent, flexShrink: 0, alignSelf: "center" }} />
        {items.map(([id, label]) => {
          const on = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="ctrla-jump"
              aria-current={on ? "true" : undefined}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${on ? accent : "transparent"}`,
                padding: "13px 0 11px",
                cursor: "pointer",
                fontFamily: ed.mono,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: on ? 700 : 400,
                color: on ? ed.ink : "rgba(22,12,40,0.55)",
                whiteSpace: "nowrap",
                transition: "color 0.25s ease, border-color 0.25s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </Bleed>
      {/* Reading-depth hairline, sector accent */}
      <div aria-hidden style={{ position: "absolute", left: 0, bottom: -1, height: 2, width: `${progress * 100}%`, background: accent }} />
    </nav>
  );
}
