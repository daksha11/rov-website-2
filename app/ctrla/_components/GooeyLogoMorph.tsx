"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — GOOEY LOGO MORPH (looping)
// The loader's flat↔3D gooey morph, but on a loop for the
// hero. Two white logo layers animate blur+opacity under an
// SVG threshold filter so they fuse into metaballs.
// Optimized: one rAF that mutates styles directly (no React
// re-renders), paused off-screen via IntersectionObserver,
// static for prefers-reduced-motion, both layers preloaded.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from "react";

export default function GooeyLogoMorph({
  srcs,
  interval = 4000, // hold on each logo before the next morph
  morphMs = 1650,
  alt = "CTRL-A",
  className,
  style,
}: {
  srcs: [string, string];
  interval?: number;
  morphMs?: number;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLImageElement>(null);
  const bRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    // Initial state: A shows logo 0, B holds logo 1 (preloaded, hidden).
    a.src = srcs[0];
    b.src = srcs[1];
    a.style.opacity = "100%";
    a.style.filter = "none";
    b.style.opacity = "0%";
    b.style.filter = "none";

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // hold on the first logo, no animation

    let idx = 0; // logo currently on layer A
    let raf = 0;
    let phase: "hold" | "morph" = "hold";
    let phaseStart = 0;
    let onScreen = true;

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    // f: 0 = fully A, 1 = fully B. Blow up blur near the ends so the
    // threshold filter melts the two shapes through each other.
    const setMorph = (f: number) => {
      const fb = Math.max(f, 0.0001);
      const inv = Math.max(1 - f, 0.0001);
      b.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      b.style.filter = `blur(${Math.min(8 / fb - 8, 100)}px)`;
      a.style.opacity = `${Math.pow(1 - f, 0.4) * 100}%`;
      a.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!onScreen) {
        phaseStart = now; // freeze the clock while off-screen
        return;
      }
      if (!phaseStart) phaseStart = now;
      const elapsed = now - phaseStart;

      if (phase === "hold") {
        if (elapsed >= interval) {
          phase = "morph";
          phaseStart = now;
          setMorph(0);
        }
        return;
      }

      // morph
      let f = elapsed / morphMs;
      if (f >= 1) f = 1;
      setMorph(f * f * (3 - 2 * f)); // smoothstep
      if (f >= 1) {
        // Commit: the morphed-in logo becomes the resting layer A.
        idx = (idx + 1) % srcs.length;
        a.src = srcs[idx];
        b.src = srcs[(idx + 1) % srcs.length];
        a.style.opacity = "100%";
        a.style.filter = "none";
        b.style.opacity = "0%";
        b.style.filter = "none";
        phase = "hold";
        phaseStart = now;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [srcs, interval, morphMs]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ position: "relative", ...style }}
    >
      {/* Goo threshold — fuses the blurred white logos into metaballs */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <filter id="ctrla-hero-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: "url(#ctrla-hero-goo)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={aRef}
          src={srcs[0]}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", willChange: "opacity, filter" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bRef}
          src={srcs[1]}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0, willChange: "opacity, filter" }}
        />
      </div>
    </div>
  );
}
