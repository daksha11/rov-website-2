"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — LOADING SCREEN
// One smooth gooey morph (flat logo → 3D logo) over the
// void ground + palette-tuned shader, then it hands off to
// the page. The dismissal is gated on the page actually
// being ready (window load + fonts), not a fixed timer, so
// it never reveals an unpainted page or hangs forever.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { ed } from "./editorial";
import { currentVolume } from "../_volumes";

// White logo variants read cleanly as metaballs under the threshold filter.
// The morph runs once: flat logo settles into the 3D logo.
// (Filenames contain spaces — encoded for use as <img> sources.)
const LOGO_FROM = encodeURI("/ctrla/Logos/CTRL A_flat logo_white.svg");
const LOGO_TO = encodeURI("/ctrla/Logos/CTRL A_3D logo_white.svg");

// One subtle ground shift as the morph happens (void → panel). Both stay dark
// so the white logo and light caption read cleanly throughout. (Note: ed.ink is
// now a LIGHT cream, so it must NOT be used as a loader ground.)
const BG_FROM = ed.void;
const BG_TO = ed.panel;

// Cosmic set decoration — used sparingly, pinned to the edges so the
// centre stays clear for the logo morph. Each drifts on its own loop.
type Decor = {
  src: string;
  anim: string; // CSS animation class
  style: React.CSSProperties;
};
const ASSET = (name: string) => encodeURI(`/ctrla/Assets and Textures/${name}`);
const DECOR: Decor[] = [
  { src: ASSET("CTRL A_saturn.png"), anim: "ctrla-float-a", style: { top: "12%", right: "9%", width: "clamp(64px,11vw,128px)", opacity: 0.9 } },
  { src: ASSET("CTRL A_planets.png"), anim: "ctrla-float-b", style: { bottom: "14%", left: "8%", width: "clamp(54px,9vw,104px)", opacity: 0.85 } },
  { src: ASSET("CTRL A_spaceship.png"), anim: "ctrla-drift", style: { top: "22%", left: "10%", width: "clamp(44px,7vw,84px)", opacity: 0.95 } },
  { src: ASSET("CTRL A_galaxy.png"), anim: "ctrla-float-b", style: { bottom: "16%", right: "11%", width: "clamp(60px,10vw,120px)", opacity: 0.55 } },
  { src: ASSET("CTRL A_comet.png"), anim: "ctrla-comet", style: { top: "8%", left: "-14%", width: "clamp(70px,14vw,150px)", opacity: 0.9 } },
];

export default function CtrlALoader({ onDone }: { onDone?: () => void }) {
  const fromRef = useRef<HTMLImageElement>(null);
  const toRef = useRef<HTMLImageElement>(null);
  const [shifted, setShifted] = useState(false); // ground colour
  const [morphDone, setMorphDone] = useState(false); // the single morph finished
  const [ready, setReady] = useState(false); // page actually loaded
  const [leaving, setLeaving] = useState(false); // fading out

  // ── The single gooey morph: flat logo → 3D logo, exactly once ──
  useEffect(() => {
    const START_DELAY = 280; // a brief beat on the flat logo first
    const MORPH_MS = 1150; // the morph itself
    let raf = 0;
    let start = 0;
    let finished = false;

    // fraction 0 = fully "from" logo, 1 = fully "to" logo
    const setMorph = (f: number) => {
      const a = fromRef.current;
      const b = toRef.current;
      if (!a || !b) return;
      const fb = Math.max(f, 0.0001);
      const inv = Math.max(1 - f, 0.0001);
      b.style.filter = `blur(${Math.min(8 / fb - 8, 100)}px)`;
      b.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      a.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      a.style.opacity = `${Math.pow(1 - f, 0.4) * 100}%`;
    };

    setMorph(0); // rest on the flat logo until the morph kicks in

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - START_DELAY;
      if (elapsed <= 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      let f = elapsed / MORPH_MS;
      if (f >= 1) f = 1;
      const eased = f < 1 ? f * f * (3 - 2 * f) : 1; // smoothstep
      setMorph(eased);
      if (f >= 1) {
        if (!finished) {
          finished = true;
          setMorphDone(true);
        }
        return; // stop — the morph happens only once
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const bgT = setTimeout(() => setShifted(true), START_DELAY);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bgT);
    };
  }, []);

  // ── Actually wait for the page behind us to be ready ──
  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((res) =>
            window.addEventListener("load", () => res(), { once: true })
          );
    const fonts =
      typeof document !== "undefined" && (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
        ? (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
        : Promise.resolve();

    Promise.all([loaded, fonts]).then(markReady);
    // Safety net: never let the loader hang if a resource stalls.
    const safety = setTimeout(markReady, 7000);

    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
  }, []);

  // ── Hand off once the morph has played AND the page is ready ──
  useEffect(() => {
    if (!(morphDone && ready) || leaving) return;
    const settle = setTimeout(() => setLeaving(true), 360); // hold on the 3D logo a beat
    return () => clearTimeout(settle);
  }, [morphDone, ready, leaving]);

  useEffect(() => {
    if (!leaving) return;
    const done = setTimeout(() => onDone?.(), 520); // matches the fade
    return () => clearTimeout(done);
  }, [leaving, onDone]);

  return (
    <div
      aria-label="Loading CTRL-A"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: shifted ? BG_TO : BG_FROM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(28px,5vw,52px)",
        overflow: "hidden",
        opacity: leaving ? 0 : 1,
        transition: "opacity .5s ease, background-color .8s ease",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      {/* Palette-tuned shader, behind the morph */}
      <AnimatedShaderBackground style={{ zIndex: 0 }} intensity={1.5} speed={3.2} />

      {/* Cosmic set pieces — edge-pinned, gently drifting */}
      {DECOR.map((d) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={d.src}
          src={d.src}
          alt=""
          aria-hidden="true"
          className={d.anim}
          style={{ position: "absolute", zIndex: 1, height: "auto", pointerEvents: "none", ...d.style }}
        />
      ))}

      {/* SVG goo threshold — fuses the blurred white logos into metaballs */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <filter id="ctrla-loader-goo">
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

      {/* Gooey logo morph (single pass) */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(72vw, 420px)",
          height: "clamp(120px, 26vw, 240px)",
          filter: "url(#ctrla-loader-goo)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={fromRef}
          src={LOGO_FROM}
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 1 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={toRef}
          src={LOGO_TO}
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0 }}
        />
      </div>

      {/* Gooey caption — gentle word cycle while loading */}
      <div style={{ position: "relative", zIndex: 1, height: "clamp(40px,8vw,64px)", width: "100%" }}>
        <GooeyText
          texts={["CTRL-A", currentVolume.issueMeta.volume, "Loading"]}
          morphTime={1}
          cooldownTime={0.8}
          textClassName="text-[#F0E6E0] font-semibold tracking-tight text-4xl md:text-5xl"
          className="h-full"
        />
      </div>

      {/* Thin progress hairline */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(60vw, 260px)",
          height: 2,
          background: "rgba(240,230,224,0.16)",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <div className="ctrla-loader-bar" style={{ background: ed.gold }} />
      </div>
    </div>
  );
}
