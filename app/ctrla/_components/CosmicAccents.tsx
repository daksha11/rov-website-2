"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — COSMIC ACCENTS (Phase 2)
// Ambient, illustrative space-vibe flourishes built on the
// brand asset set + GSAP. Used sparingly: a drawn divider,
// a one-shot comet, a faint parallax starfield. Every one
// is scroll-triggered and respects prefers-reduced-motion.
// ═══════════════════════════════════════════════════════

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ASSET = (name: string) => encodeURI(`/ctrla/Assets and Textures/${name}`);
const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// The brand cosmic set, ready to drop anywhere.
export const COSMIC = {
  saturn: ASSET("CTRL A_saturn.svg"),
  planets: ASSET("CTRL A_planets.svg"),
  spaceship: ASSET("CTRL A_spaceship.svg"),
  galaxy: ASSET("CTRL A_galaxy.svg"),
  comet: ASSET("CTRL A_comet.svg"),
  sideLines1: ASSET("CTRL A_side lines_1.svg"),
  sideLines2: ASSET("CTRL A_side lines_2.svg"),
  longLines: ASSET("CTRL A_long lines.svg"),
};

// ── Floating asset — depth parallax on scroll + an idle micro
// animation that suits the body (orbit/spin, hover-bob, sway,
// pulse). The wrapper owns the scroll transform; the inner image
// owns the idle transform, so the two never fight.
export type CosmicMotion = "spin" | "bob" | "sway" | "pulse";

export function FloatingAsset({
  src,
  size = "120px",
  top,
  left,
  right,
  bottom,
  driftFrom = 30,
  driftTo = -30,
  opacity = 0.5,
  motion = "bob",
  className,
}: {
  src: string;
  size?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  driftFrom?: number;
  driftTo?: number;
  opacity?: number;
  motion?: CosmicMotion;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced()) {
        gsap.set(el, { yPercent: (driftFrom + driftTo) / 2 });
        return;
      }
      gsap.fromTo(
        el,
        { yPercent: driftFrom },
        {
          yPercent: driftTo,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ctrla-cosmic-float"
      style={{ position: "absolute", top, left, right, bottom, width: size, zIndex: 1, pointerEvents: "none" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={`ctrla-cosmic-anim ctrla-cosmic-${motion}${className ? ` ${className}` : ""}`}
        style={{ width: "100%", height: "auto", display: "block", opacity }}
      />
    </div>
  );
}

// ── Drawn divider — the "long lines" ribbon strokes itself in ──
// Filled brand art re-rendered as stroke so we can animate the path.
export function DrawLine({
  color = "#A56A67",
  height = 44,
  style,
}: {
  color?: string;
  height?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const paths = ref.current?.querySelectorAll("path");
      if (!paths || !paths.length) return;
      if (reduced()) {
        paths.forEach((p) => gsap.set(p, { strokeDashoffset: 0, opacity: 0.85 }));
        return;
      }
      paths.forEach((p, i) => {
        const len = (p as SVGPathElement).getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.9 });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.7,
          ease: "power2.inOut",
          delay: i * 0.18,
          scrollTrigger: { trigger: ref.current, start: "top 86%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 659.36 118.91"
      aria-hidden="true"
      style={{ width: "100%", height, display: "block", overflow: "visible", ...style }}
    >
      <path
        d="M615.28,43.33l-37.34,14.45-46.7,21.27c-12.1,5.51-25.04,7.51-38.14,5.35l-35.2-5.81c-20.02-3.31-40.12-.43-58.26,8.3l-29.2,14.05c-13.58,6.54-27.32,10.72-40.77,11.01h0c-13.87.3-27.43-3.54-40.17-13.24-39.9-30.37-51.57-67.47-105.7-50.44-28.6,9-75.2,13.24-103.05,6.43l-49.32-12.06c-9.97-2.57-28.48-5.6-31.44-5.6v8.09c1.95.23,17.12,4.64,26.11,7.09l42.02,12.03c37.25,10.67,88.11.09,124.87-13.25,24.14-8.76,36.82-2.93,53.75,13.9l32.45,32.27c14.36,14.28,31.77,21.36,50.48,21.72,8.49.16,17.24-1.05,26.1-3.61,47.58-13.73,54.22-32.54,114.69-29.82l37.82,1.7c8.66.39,17.53-1.98,25.49-5.46l48.81-21.35c25.67-11.23,46.72-18.86,75.72-15.32l1.06.11v-8.09h-1.04c-14.73-.16-29.35.98-43.05,6.28Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <path
        d="M658.84.71c-15.98,2.47-29.97,8.76-43.1,18.29-14.91,10.82-29.73,20.24-46.77,27.78-27.67,12.24-58.09,12.96-87.48,5.96-19.36-4.61-38.24-7.01-57.99-4.6-13.54,1.65-26.86,4.74-39.28,10.56l-37.33,17.49c-5.57,2.61-11.36,3.79-17.22,3.92h0c-5.36.11-10.78-.66-16.17-2.06-16.74-4.38-30.67-13.3-44.29-23.8l-27.99-21.58c-8.74-6.74-19.02-10.44-30-10.28-7.59.11-14.38,1.8-21.52,3.65l-29.28,7.58c-26.25,5.21-51.57,1.03-76.11-9.35L42.61,6.6C29.52,1.07,15.89-1.04,1.34.48l-1.34.15v7.51l1.25-.17c12.88-1.74,25.82.22,38.12,5.03l38.09,14.91c35.14,14.79,73.37,15.4,109,1.3,11.44-4.53,23.91-6.65,35.67-2.25,8.57,3.2,15.65,9.31,22.49,15.22,22.1,19.1,51.02,36.87,80.08,40.74,1.66.22,3.32.33,4.99.36h0c8.38.15,16.73-2,24.47-5.14l28.42-11.56c36.18-14.71,61.26-15.5,99.74-9.38l29.14,2.47c22.4.49,43.09-3.58,63.5-12.24,15.86-6.73,30.51-13.72,44.87-23.29,11.82-7.88,24.31-13.52,38.97-15.92l.58-.07V.62l-.52.09Z"
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
}

// ── One-shot comet — streaks across once when its band scrolls in ──
export function CometStreak({ style }: { style?: CSSProperties }) {
  const ref = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced()) {
        gsap.set(el, { opacity: 0 });
        return;
      }
      gsap.set(el, { opacity: 0, xPercent: -140, yPercent: 40 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.parentElement, start: "top 78%", once: true },
      });
      tl.to(el, { opacity: 0.95, duration: 0.35 })
        .to(el, { xPercent: 520, yPercent: -60, duration: 2.4, ease: "power1.in" }, "<")
        .to(el, { opacity: 0, duration: 0.55 }, "-=0.7");
    },
    { scope: ref }
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={ASSET("CTRL A_comet.png")}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ position: "absolute", width: "clamp(80px, 12vw, 168px)", height: "auto", pointerEvents: "none", zIndex: 0, ...style }}
    />
  );
}

// ── Faint starfield — slow vertical parallax behind a dark band ──
export function StarField({
  src = ASSET("CTRL A_stars texture_beige.svg"),
  opacity = 0.16,
}: {
  src?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      gsap.to(el, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-14% 0",
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
