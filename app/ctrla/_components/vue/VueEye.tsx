"use client";

// ═══════════════════════════════════════════════════════
// VUE — THE EYE
//
// Vue's visor is a blank screen: scripts/optimize-vue-poses.mjs erases the
// painted sigil out of the art, so this SVG is the only eye there is. That is
// the whole point — an overlay on top of a painted eye can glow, but it can
// never close. This one can.
//
// The paths are traced from the original painted sigil, so the drawn eye lands
// on the same footprint the artist put it on: an angular lens with two nested
// rings, a diamond pupil, and six rays. The viewBox is the tight bounding box
// of that sigil, and the pose registry places it, so `preserveAspectRatio` is
// deliberately "none" — the ~5% differences between poses are the perspective
// the artist drew, and stretching to the measured rect reproduces it.
// ═══════════════════════════════════════════════════════

import { useId, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ed } from "../editorial";

gsap.registerPlugin(DrawSVGPlugin);

// The sigil's own coordinate space. 128 x 100 is the painted glyph's aspect.
const VB = { w: 128, h: 100 };
// Where the eye looks *from*. The pupil and inner ring track around this.
const CENTER = { x: 55, y: 47 };

export type VueMood =
  /** Open, steady, breathing. The default. */
  | "calm"
  /** Rings pull in and the glow tightens — Vue is reading something closely. */
  | "focused"
  /** Lens widens and the rays flare. Use on arrival, or on a reveal. */
  | "alert";

const MOOD: Record<VueMood, { lens: number; rays: number; glow: number; blink: [number, number] }> = {
  calm: { lens: 1, rays: 1, glow: 1, blink: [4, 9] },
  focused: { lens: 0.88, rays: 0.7, glow: 0.85, blink: [6, 13] },
  alert: { lens: 1.1, rays: 1.25, glow: 1.35, blink: [2.5, 5] },
};

export interface VueEyeProps {
  mood?: VueMood;
  /** How far the pupil drifts toward the pointer, in viewBox units. */
  gazeRange?: number;
  /** Draw the eye on when it scrolls into view rather than showing it open. */
  wakeOnScroll?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function VueEye({
  mood = "calm",
  gazeRange = 7,
  wakeOnScroll = true,
  className,
  style,
}: VueEyeProps) {
  const root = useRef<SVGSVGElement>(null);
  // Filter/gradient ids have to be unique per instance or the first Vue on the
  // page steals every other Vue's glow.
  const uid = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const svg = root.current;
      if (!svg) return;

      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const lens = svg.querySelector<SVGGElement>("[data-vue='lens']");
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-vue='stroke']", svg);
      const rays = gsap.utils.toArray<SVGLineElement>("[data-vue='ray']", svg);
      const iris = svg.querySelector<SVGGElement>("[data-vue='iris']");
      const gaze = svg.querySelector<SVGGElement>("[data-vue='gaze']");
      const glowGroup = svg.querySelector<SVGGElement>("[data-vue='glow']");
      const m = MOOD[mood];

      // Presentation-attribute opacity clamps at 1, so `alert` reads through a
      // wider lens and flared rays rather than a brighter-than-full glow.
      gsap.set(glowGroup, { opacity: Math.min(1, m.glow) });
      gsap.set(lens, { transformOrigin: `${CENTER.x}px ${CENTER.y}px`, scale: m.lens });
      gsap.set(rays, { transformOrigin: `${CENTER.x}px ${CENTER.y}px`, scale: m.rays });

      if (reduced) {
        // Everything drawn, nothing moving.
        gsap.set([...strokes, ...rays], { drawSVG: "100%", opacity: 1 });
        return;
      }

      // ── wake ── the eye draws itself on, lens outward.
      const wake = gsap
        .timeline({ paused: wakeOnScroll })
        .fromTo(
          strokes,
          { drawSVG: "50% 50%" },
          { drawSVG: "0% 100%", duration: 0.55, stagger: 0.09, ease: "power2.out" }
        )
        .fromTo(
          rays,
          { drawSVG: "50% 50%", opacity: 0 },
          { drawSVG: "0% 100%", opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" },
          "-=0.25"
        );

      if (wakeOnScroll) gsap.set([...strokes, ...rays], { drawSVG: "50% 50%" });

      // ── blink ── the lens collapses to a line. Only possible because the
      // visor underneath is genuinely empty.
      let blinkId = 0;
      const blink = () => {
        gsap
          .timeline({ onComplete: schedule })
          .to(lens, { scaleY: 0.04, duration: 0.09, ease: "power2.in" })
          .to(lens, { scaleY: m.lens, duration: 0.13, ease: "power2.out" });
      };
      const schedule = () => {
        const [lo, hi] = m.blink;
        blinkId = window.setTimeout(blink, (lo + Math.random() * (hi - lo)) * 1000);
      };

      // ── pulse ── the rays breathe.
      const pulse = gsap.to(rays, {
        scale: m.rays * 1.14,
        opacity: 0.55,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // ── gaze ── the pupil leans toward the pointer. Pointer tracking and
      // idle drift live on two nested groups so they compose instead of
      // overwriting each other's x/y.
      const gx = gsap.quickTo(gaze, "x", { duration: 0.7, ease: "power3.out" });
      const gy = gsap.quickTo(gaze, "y", { duration: 0.7, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        if (!r.width) return;
        const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
        gx(gsap.utils.clamp(-gazeRange, gazeRange, dx * gazeRange * 1.6));
        gy(gsap.utils.clamp(-gazeRange * 0.5, gazeRange * 0.5, dy * gazeRange * 0.8));
      };

      // Idle drift, so Vue is never frozen when the pointer is elsewhere.
      const drift = gsap.to(iris, {
        x: () => gsap.utils.random(-gazeRange * 0.4, gazeRange * 0.4),
        y: () => gsap.utils.random(-gazeRange * 0.2, gazeRange * 0.2),
        duration: 2.6,
        ease: "sine.inOut",
        repeatRefresh: true,
        repeat: -1,
      });

      // Wake on arrival, and go quiet while off-screen — six of these on one
      // page should cost nothing when none of them are visible.
      //
      // IntersectionObserver rather than ScrollTrigger: "is the eye on screen"
      // is the only question being asked, and IO answers it without caring
      // which element scrolls or needing a refresh when the page reflows
      // around lazy images.
      let woken = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!woken) {
              woken = true;
              wake.play();
            }
            schedule();
            pulse.play();
            drift.play();
            window.addEventListener("pointermove", onMove, { passive: true });
          } else {
            clearTimeout(blinkId);
            pulse.pause();
            drift.pause();
            window.removeEventListener("pointermove", onMove);
          }
        },
        { rootMargin: "0px 0px -12% 0px" }
      );
      io.observe(svg);

      return () => {
        clearTimeout(blinkId);
        window.removeEventListener("pointermove", onMove);
        io.disconnect();
      };
    },
    { scope: root, dependencies: [mood, gazeRange, wakeOnScroll] }
  );

  const glow = `vue-glow-${uid}`;

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%", overflow: "visible", ...style }}
    >
      <defs>
        {/* Two blurs, tight and wide, merged under the crisp strokes. Kept
            small in viewBox units — the painted sigil glowed close to the
            line, and a wide blur turns the rays to mush at cameo sizes. */}
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.5" result="soft" />
          <feGaussianBlur stdDeviation="4.2" result="wide" />
          <feComponentTransfer in="wide" result="wideDim">
            <feFuncA type="linear" slope="0.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="wideDim" />
            <feMergeNode in="soft" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter={`url(#${glow})`}
        fill="none"
        stroke={ed.gold}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-vue="glow"
      >
        {/* rays — outside the lens, so they survive a blink */}
        <g data-vue="rayset">
          {(
            [
              [69, 2.2, 74.4, 12.7],
              [10.5, 15.2, 21.4, 26.1],
              [116.5, 23.2, 124.5, 33.3],
              [14.9, 78.2, 18.5, 89],
              [58.1, 87.2, 62.1, 98.4],
              [102.8, 77.8, 111.5, 88.3],
            ] as const
          ).map(([x1, y1, x2, y2], i) => (
            <line key={i} data-vue="ray" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="5.4" />
          ))}
        </g>

        {/* the lens — collapses on a blink */}
        <g data-vue="lens">
          <path
            data-vue="stroke"
            d="M0 63 L55 18 L128 57 Q100 70 59 76 Q22 73 0 63 Z"
            strokeWidth="5.4"
          />
          <path
            data-vue="stroke"
            d="M25 52.5 L56.8 34.7 L112.9 55 Q88 63 60.8 66.9 Q38 63 25 52.5 Z"
            strokeWidth="4"
          />
          {/* iris — the part that tracks the pointer */}
          <g data-vue="gaze">
            <g data-vue="iris">
            <path
              data-vue="stroke"
              d="M36.4 50.2 L55 40.2 L83.6 49.8 Q72 54 59 56.1 Q45 54 36.4 50.2 Z"
              strokeWidth="3.3"
            />
            <path
              data-vue="stroke"
              d="M46.7 47 L55.4 41.9 L64.1 47 L55.4 52.1 Z"
              strokeWidth="2.5"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
