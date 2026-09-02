"use client";

// ═══════════════════════════════════════════════════════
// SPACE — SCENE ROOT
//
// The <Canvas> and everything inside it. This file and its siblings are the
// only place in the repo (besides the loader's aurora) allowed to touch three,
// and they are only ever reached through a dynamic ssr:false import, so none
// of this weight can leak into the magazine bundle.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Starfield from "./Starfield";
import Nebula from "./Nebula";
import Bodies from "./Bodies";
import Ship from "./Ship";
import Trail from "./Trail";
import Waypoint from "./Waypoint";
import { frame, useSpace } from "../_state/useSpace";

// ── Quality governor ───────────────────────────────────
// The scene itself is light (about sixty draw calls); what a machine chokes
// on is pixels. So the one knob worth turning automatically is the render
// scale. Every two seconds: under 50fps, step the DPR down a quarter; a
// steady 58+ for three windows in a row, step it back up toward the cap.
// Hysteresis keeps it from flickering between tiers. Never touches MSAA,
// which cannot change after the context exists.
const DPR_MIN = 1;
const DPR_STEP = 0.25;
const WINDOW = 2; // seconds
const GRACE = 3; // seconds, so shader compile jank at load does not count

function QualityGovernor({ cap }: { cap: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useThree((s) => s.viewport.dpr);
  const gl = useThree((s) => s.gl);

  // `?debug` puts the renderer's counters on window for headless checks.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug")) return;
    (window as unknown as { __space?: unknown }).__space = { info: gl.info, frame };
  }, [gl]);
  const acc = useRef({ frames: 0, t: 0, age: 0, goodRuns: 0 });

  useEffect(() => {
    useSpace.getState().setQuality(Math.round(dpr * 100) / 100);
  }, [dpr]);

  useFrame((_, dt) => {
    const a = acc.current;
    a.age += dt;
    if (a.age < GRACE) return;
    a.frames++;
    a.t += dt;
    if (a.t < WINDOW) return;
    const fps = a.frames / a.t;
    a.frames = 0;
    a.t = 0;
    if (fps < 50 && dpr > DPR_MIN) {
      a.goodRuns = 0;
      setDpr(Math.max(DPR_MIN, Math.round((dpr - DPR_STEP) * 100) / 100));
    } else if (fps >= 58 && dpr < cap) {
      a.goodRuns++;
      if (a.goodRuns >= 3) {
        a.goodRuns = 0;
        setDpr(Math.min(cap, Math.round((dpr + DPR_STEP) * 100) / 100));
      }
    } else {
      a.goodRuns = 0;
    }
  });
  return null;
}

// ── The bokashi sky ────────────────────────────────────
// The magazine cover's night → twilight → gold-horizon gradient, wrapped
// around the whole system as a giant inside-out sphere. One draw call, and it
// is most of what makes the scene read as CTRL·A instead of generic space.
function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vPos;
          // Cover-gradient stops, sampled from the magazine's bokashi sky.
          vec3 night   = vec3(0.059, 0.031, 0.125);  // #0F0820
          vec3 plum    = vec3(0.180, 0.133, 0.275);  // #2E2246
          vec3 rose    = vec3(0.478, 0.337, 0.345);  // #7A5658
          vec3 amber   = vec3(0.761, 0.604, 0.314);  // #C29A50
          vec3 gold    = vec3(0.890, 0.761, 0.290);  // #E3C24A

          void main() {
            float h = normalize(vPos).y;             // -1 .. 1
            // A luminous band low on the horizon, night above and below.
            // Kept restrained on purpose: the planets have to read against
            // it, and the sun should be the brightest thing in the sky.
            float band = exp(-pow((h + 0.12) * 6.0, 2.0));
            vec3 col = night;
            col = mix(col, plum, smoothstep(-0.6, 0.05, h) * (1.0 - smoothstep(0.05, 0.7, h)));
            col = mix(col, rose, band * 0.55);
            col = mix(col, amber, band * band * 0.5);
            col = mix(col, gold, pow(band, 4.0) * 0.35);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );
  return (
    <mesh material={material} scale={900}>
      <sphereGeometry args={[1, 32, 24]} />
    </mesh>
  );
}

export default function Scene() {
  // Tab hidden → stop rendering entirely. A space game warming a laptop in a
  // background tab is exactly the reputation this feature must not earn.
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // `?lite` pins dpr 1 and no MSAA: a debug knob for software renderers and
  // headless tests. Everyone else starts at min(device, 1.5) and the governor
  // takes it from there. 2× with 4× MSAA on a retina laptop is most of why a
  // scene this small can drop under 60.
  const lite = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lite"), []);
  const cap = useMemo(() => (lite ? 1 : Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5)), [lite]);

  return (
    <Canvas
      frameloop={frameloop}
      dpr={cap}
      // alpha:false — the sky covers every pixel, so an opaque canvas saves
      // the compositor an alpha blend over the whole viewport each frame.
      gl={{ antialias: !lite, alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.5, far: 2000, position: [0, 26, 70] }}
      style={{ position: "fixed", inset: 0, background: "#0F0820" }}
    >
      {!lite && <QualityGovernor cap={cap} />}
      <Sky />
      <Nebula />
      <Starfield />
      {/* The sun is the key light; a gold-over-plum hemisphere is the fill,
          so shadow sides read as the same sky the bodies sit in. */}
      <hemisphereLight args={["#E3C24A", "#4E3D73", 0.55]} />
      <Bodies />
      <Ship />
      <Trail />
      <Waypoint />
    </Canvas>
  );
}
