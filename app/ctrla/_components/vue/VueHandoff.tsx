"use client";

// ═══════════════════════════════════════════════════════
// VUE — THE HAND-OFF
//
// Vue stands beside a section and a gold thread draws out of her palm to its
// heading. Vue points, the line arrives, you read the heading. It is the one
// gesture that ties the mascot to the page's actual structure instead of
// parking her next to it.
//
// The thread is a real measurement, not a guessed curve: the hand point comes
// from the pose registry, the target from the first heading inside the slot,
// and both are re-measured on resize. DrawSVGPlugin then draws the path on
// scroll-in.
//
// Use it three times on a page at the outside. A gesture that happens at every
// section stops being a gesture.
// ═══════════════════════════════════════════════════════

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Vue from "./Vue";
import { VUE_POSES, type VueColorway, type VuePose } from "./poses";
import { ed as edDark, edLight } from "../editorial";

gsap.registerPlugin(DrawSVGPlugin);

export interface VueHandoffProps {
  children: ReactNode;
  /** Only `showing` and `pointing` read as an offer. `leaning` does not. */
  pose?: Extract<VuePose, "showing" | "pointing">;
  colorway?: VueColorway;
  height?: number;
  /**
   * The active theme. Defaults to the magazine's dark ground; pass `edLight`
   * on the toolkit pages, where gold thread on cream is close to invisible.
   */
  theme?: typeof edDark;
  className?: string;
  style?: CSSProperties;
}

export default function VueHandoff({
  children,
  pose = "showing",
  colorway,
  height = 260,
  theme,
  className,
  style,
}: VueHandoffProps) {
  const ed = theme ?? edDark;
  const isLight = ed.ground === edLight.ground;
  const cw = colorway ?? (isLight ? "clay" : "purple");
  const thread = isLight ? ed.plum : ed.gold;
  const wrap = useRef<HTMLDivElement>(null);
  const vueBox = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [d, setD] = useState("");

  const spec = VUE_POSES[pose];

  const measure = useCallback(() => {
    const w = wrap.current;
    const v = vueBox.current;
    const s = slot.current;
    if (!w || !v || !s) return;

    const wr = w.getBoundingClientRect();
    const vr = v.getBoundingClientRect();
    if (!wr.width || !vr.width) return;

    // Where the thread leaves Vue's hand, in wrapper pixels.
    const hx = vr.left - wr.left + spec.hand.x * vr.width;
    const hy = vr.top - wr.top + spec.hand.y * vr.height;

    // Where it lands: the first heading in the slot, on its leading edge.
    const target = s.querySelector<HTMLElement>("h1, h2, h3, [data-vue-target]") ?? s;
    const tr = target.getBoundingClientRect();
    const tx = tr.left - wr.left;
    const ty = tr.top - wr.top + tr.height / 2;

    // A slack curve, as if the thread has weight. The control points hang
    // below the straight line by a fraction of the run.
    const run = Math.max(1, tx - hx);
    const sag = Math.min(58, run * 0.3);
    setD(`M ${hx} ${hy} C ${hx + run * 0.35} ${hy + sag}, ${tx - run * 0.35} ${ty + sag}, ${tx} ${ty}`);
  }, [spec.hand.x, spec.hand.y]);

  useGSAP(
    () => {
      measure();

      const ro = new ResizeObserver(() => measure());
      if (wrap.current) ro.observe(wrap.current);
      // Fonts land after first paint and move the heading, so re-measure once
      // they do rather than drawing to a stale target.
      document.fonts?.ready.then(measure).catch(() => {});

      // IO, not ScrollTrigger — see the note in VueEye. It also lets the
      // thread re-measure at the moment it becomes visible, which is the point
      // where the heading has finally stopped moving.
      let drawn = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || drawn || !path.current) return;
          drawn = true;
          measure();
          const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
          if (reduced) {
            gsap.set(path.current, { drawSVG: "100%", opacity: 1 });
            return;
          }
          gsap.fromTo(
            path.current,
            { drawSVG: "0%", opacity: 1 },
            { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }
          );
        },
        { rootMargin: "0px 0px -18% 0px" }
      );
      if (wrap.current) io.observe(wrap.current);

      return () => {
        ro.disconnect();
        io.disconnect();
      };
    },
    { scope: wrap, dependencies: [measure] }
  );

  return (
    <div
      ref={wrap}
      // The gesture needs horizontal room to read as a gesture. Below 900px
      // the stylesheet drops Vue entirely rather than stacking her above the
      // heading, where the thread would point at nothing. Because that is a
      // `display: none`, the lazy image never loads on phones either.
      className={["ctrla-vue-handoff", className].filter(Boolean).join(" ")}
      style={style}
    >
      <div ref={vueBox} className="ctrla-vue-handoff-figure">
        <Vue pose={pose} colorway={cw} height={height} mood="alert" />
      </div>

      <div ref={slot} style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>

      {/* The thread. Sits over both columns but takes no clicks. */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
      >
        <path
          ref={path}
          data-vue="thread"
          d={d}
          fill="none"
          stroke={thread}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={d ? 1 : 0}
        />
      </svg>
    </div>
  );
}
