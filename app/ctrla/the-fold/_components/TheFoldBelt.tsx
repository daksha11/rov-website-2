"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — asteroid-belt landing
// A full-bleed canvas renders a slow ambient asteroid belt drifting
// in perspective: the "window" of an all-night focus cafe. Six rooms
// are camera VANTAGES on the same belt (not separate scenes). Picking
// a room eases the camera over ~1.5s; scroll adds a temporary forward
// lean that decays back to the room's ambient drift.
//
// PERFORMANCE: the whole engine lives outside React (refs/module
// scope). The RAF loop never calls setState. Rock silhouettes are
// precomputed once into Float32Arrays; the draw loop does one cos/sin
// per rock. Background gradient is cached. Rocks recycle in place.
// Pauses on document.hidden, caps DPR at 2, honors reduced-motion.
//
// "Find a seat" leads into the immersive cafe (the deeper experience);
// the belt is the entry screen in front of it.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ed } from "../../_components/editorial";

type CamState = { dist: number; spreadY: number; drift: number; tumble: number; dens: number; warm: number };
type Room = { id: string; name: string; floor: string; state: string; line: string; sound: string; cam: CamState };

const ROOMS: Room[] = [
  { id: "commons", name: "The Commons", floor: "the floor", state: "",
    line: "Find your seat. An all-night cafe, out past the map.",
    sound: "murmur", cam: { dist: 1.0, spreadY: 0.30, drift: 0.32, tumble: 1.0, dens: 1.0, warm: 0.5 } },
  { id: "window", name: "The Window Seat", floor: "wide open", state: "wide open",
    line: "Wide open. The belt held at arm's length, all air and distance.",
    sound: "music", cam: { dist: 1.6, spreadY: 0.22, drift: 0.22, tumble: 0.8, dens: 0.7, warm: 0.35 } },
  { id: "back", name: "The Back Room", floor: "in it", state: "in it",
    line: "In it. Rocks close enough to feel, the room dim around you.",
    sound: "hum", cam: { dist: 0.55, spreadY: 0.42, drift: 0.40, tumble: 1.3, dens: 1.5, warm: 0.55 } },
  { id: "quiet", name: "The Quiet Corner", floor: "stuck", state: "stuck",
    line: "Stuck, and that's allowed. The field nearly still, the room sparse.",
    sound: "rain", cam: { dist: 1.2, spreadY: 0.18, drift: 0.10, tumble: 0.4, dens: 0.5, warm: 0.4 } },
  { id: "veranda", name: "The Veranda", floor: "last light", state: "last light",
    line: "Last light. The belt low on the horizon, warm and going gold.",
    sound: "rain", cam: { dist: 1.3, spreadY: 0.16, drift: 0.26, tumble: 0.9, dens: 0.9, warm: 0.85 } },
  { id: "golden", name: "Golden Hour", floor: "locked", state: "locked",
    line: "Locked. The held moment, the belt suspended, the color richest.",
    sound: "music", cam: { dist: 0.9, spreadY: 0.28, drift: 0.14, tumble: 0.6, dens: 1.2, warm: 1.0 } },
];

// ── Canvas palette, sourced from our CTRL-A design tokens ──
// Stops blend from cool void → rose → warm gold as the room's `warm`
// rises, so each vantage carries its own light without baking in a look.
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const PALETTE = {
  rockFar: "#241436", // deep plum stone (far)
  rockMid: "#5B4880", // lifted plum (mid)
  rockNear: "#BC7E6A", // warm rose-stone (near), reads as lit
  accent: ed.gold,
  bgTop: ed.void,
  bgMid: (w: number) => mix([26, 16, 40], [90, 46, 58], clamp01(w)),
  bgBot: (w: number) => mix([42, 22, 53], [138, 90, 42], clamp01(w)),
};

const CONFIG = {
  count: 300, farZ: 1000, nearZ: 1, fov: 340, spreadX: 1500,
  accentChance: 0.05, vMin: 7, vMax: 12, pushMax: 6.0, pushDecay: 0.9, easeRate: 0.045,
} as const;

const SOUNDS = ["mute", "murmur", "music", "rain", "hum"] as const;

type Rock = { x: number; y: number; z: number; size: number; spin: number; spinRate: number; verts: Float32Array; accent: boolean };
const TAU = 6.2831853;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const CAM_KEYS = ["dist", "spreadY", "drift", "tumble", "dens", "warm"] as const;

function makeVerts(): Float32Array {
  const C = CONFIG,
    n = Math.floor(rnd(C.vMin, C.vMax + 1)),
    p = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TAU,
      rr = 0.58 + Math.random() * 0.42;
    p[i * 2] = Math.cos(ang) * rr;
    p[i * 2 + 1] = Math.sin(ang) * rr;
  }
  return p;
}

function createBeltEngine(canvas: HTMLCanvasElement) {
  const C = CONFIG,
    ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf = 0, running = true, reduced = false, push = 0;
  const cam: CamState = { ...ROOMS[0].cam },
    camT: CamState = { ...ROOMS[0].cam };
  const rocks: Rock[] = [];

  function fill(r: Rock, atZ: number | null) {
    r.x = (rnd(-1, 1) * C.spreadX) / 2;
    r.y = rnd(-1, 1) * C.spreadX * cam.spreadY;
    r.z = atZ ?? Math.random() * C.farZ;
    r.size = rnd(5, 38);
    r.spin = rnd(0, TAU);
    r.spinRate = rnd(-1, 1) * 0.012;
    r.verts = makeVerts();
    r.accent = Math.random() < C.accentChance;
  }
  const blank = (): Rock => ({ x: 0, y: 0, z: 0, size: 0, spin: 0, spinRate: 0, verts: makeVerts(), accent: false });
  for (let i = 0; i < C.count; i++) {
    const r = blank();
    fill(r, null);
    rocks.push(r);
  }

  let bgGrad: CanvasGradient | null = null,
    bgWarm = -1,
    bgH = -1;
  function bg() {
    const wq = Math.round(cam.warm * 100) / 100;
    if (bgGrad && wq === bgWarm && h === bgH) return bgGrad;
    const wv = cam.warm,
      g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, PALETTE.bgTop);
    g.addColorStop(0.55, PALETTE.bgMid(wv));
    g.addColorStop(1, PALETTE.bgBot(wv));
    bgGrad = g;
    bgWarm = wq;
    bgH = h;
    return g;
  }

  function draw(a: Rock) {
    const z = a.z * cam.dist,
      k = C.fov / z,
      sx = w * 0.5 + a.x * k,
      sy = h * 0.46 + a.y * k,
      r = a.size * k;
    if (r < 0.4 || sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) return;
    const depth = 1 - a.z / C.farZ,
      alpha = depth * 1.7;
    ctx.globalAlpha = alpha < 1 ? alpha : 1;
    let fillC = PALETTE.rockFar;
    if (depth > 0.66) fillC = PALETTE.rockNear;
    else if (depth > 0.33) fillC = PALETTE.rockMid;
    const co = Math.cos(a.spin) * r,
      si = Math.sin(a.spin) * r,
      p = a.verts,
      n = p.length;
    ctx.beginPath();
    let ux = p[0],
      uy = p[1];
    ctx.moveTo(sx + ux * co - uy * si, sy + ux * si + uy * co);
    for (let i = 2; i < n; i += 2) {
      ux = p[i];
      uy = p[i + 1];
      ctx.lineTo(sx + ux * co - uy * si, sy + ux * si + uy * co);
    }
    ctx.closePath();
    if (a.accent) {
      ctx.save();
      ctx.shadowColor = PALETTE.accent;
      ctx.shadowBlur = r * 1.1;
      ctx.fillStyle = PALETTE.accent;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = fillC;
      ctx.fill();
    }
  }

  function frame() {
    if (!running) return;
    if (w <= 0 || h <= 0) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const t = reduced ? 1 : C.easeRate;
    for (const kk of CAM_KEYS) cam[kk] = lerp(cam[kk], camT[kk], t);
    ctx.fillStyle = bg();
    ctx.fillRect(0, 0, w, h);
    const speed = cam.drift + push;
    if (!reduced) push *= C.pushDecay;
    if (push < 0.002 && push > -0.002) push = 0;
    const tumble = cam.tumble;
    for (let i = 0; i < rocks.length; i++) {
      const a = rocks[i];
      a.z -= speed;
      a.spin += a.spinRate * tumble;
      if (a.z <= C.nearZ) fill(a, C.farZ);
      else if (a.z > C.farZ) fill(a, C.nearZ + 1);
    }
    rocks.sort((p, q) => q.z - p.z);
    for (let i = 0; i < rocks.length; i++) draw(rocks[i]);
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (w <= 0 || h <= 0) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgGrad = null; // height may have changed; rebuild gradient
  }

  function setRoom(id: string) {
    const room = ROOMS.find((r) => r.id === id);
    if (!room) return;
    for (const kk of CAM_KEYS) camT[kk] = room.cam[kk];
    const target = Math.round(C.count * room.cam.dens);
    while (rocks.length < target) {
      const r = blank();
      fill(r, C.farZ);
      rocks.push(r);
    }
    if (rocks.length > target) rocks.length = target;
  }
  const addPush = (d: number) => {
    push = Math.max(-C.pushMax, Math.min(C.pushMax, push + d));
  };
  const setReducedMotion = (v: boolean) => {
    reduced = v;
  };
  const onVis = () => {
    if (document.hidden) running = false;
    else if (!running) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  };

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVis);
  raf = requestAnimationFrame(frame);

  function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVis);
  }
  return { setRoom, addPush, setReducedMotion, destroy };
}

export default function TheFoldBelt({ onEnter }: { onEnter: () => void }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createBeltEngine> | null>(null);
  const [activeId, setActiveId] = useState("commons");
  const [sound, setSound] = useState("murmur");
  const [doorOpen, setDoorOpen] = useState(true);
  const [hintGone, setHintGone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = createBeltEngine(canvas);
    engineRef.current = engine;

    try {
      if (localStorage.getItem("fold.seen") === "1") setDoorOpen(false);
    } catch {}

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    engine.setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => engine.setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    const onWheel = (e: WheelEvent) => {
      engine.addPush(e.deltaY * 0.012);
      setHintGone(true);
    };
    let touchY: number | null = null;
    const onTS = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTM = (e: TouchEvent) => {
      if (touchY == null) return;
      const y = e.touches[0].clientY;
      engine.addPush((touchY - y) * 0.03);
      touchY = y;
      setHintGone(true);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchmove", onTM, { passive: true });

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove", onTM);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const pickRoom = (id: string) => {
    const room = ROOMS.find((r) => r.id === id)!;
    engineRef.current?.setRoom(id);
    setActiveId(id);
    setSound(room.sound);
  };
  const markSeen = () => {
    try {
      localStorage.setItem("fold.seen", "1");
    } catch {}
  };
  // Primary path: step into the immersive cafe (the deeper experience).
  const enterCafe = () => {
    markSeen();
    onEnter();
  };
  // Linger on the belt landing instead of going straight in.
  const lingerOnBelt = () => {
    setDoorOpen(false);
    markSeen();
    pickRoom("commons");
  };
  const room = ROOMS.find((r) => r.id === activeId)!;

  return (
    <div className="fold">
      <canvas ref={canvasRef} className="fold__belt" aria-hidden />
      <div className="fold__vignette" aria-hidden />

      <div className={`fold__door${doorOpen ? "" : " fold__door--gone"}`}>
        <div className="fold__kicker">The Fold</div>
        <h2 className="fold__doorh">A quiet place to work, open all night.</h2>
        <p className="fold__what">An ambient cafe for focus. Pick a room, blend the sound, and stay as long as you like.</p>
        <p className="fold__how">No sign-up, no clock. Out past the map, a seat is always open.</p>
        <button className="fold__enter" onClick={enterCafe}>Find a seat →</button>
        <button className="fold__skip" onClick={lingerOnBelt}>Just let me drift</button>
      </div>

      <div className="fold__stage">
        <header className="fold__top">
          <div className="fold__brand">The Fold · <b>{room.name}</b></div>
          <div className="fold__topnav">
            <button className="fold__stepout" onClick={() => router.push("/ctrla")}>Step out →</button>
            <button className="fold__takeseat" onClick={enterCafe}>Take a seat →</button>
          </div>
        </header>

        <div className="fold__title">
          <div className="fold__floor">{room.floor}</div>
          <h1 className="fold__name">{room.name}</h1>
          <p className="fold__line">{room.line}</p>
          <p className={`fold__hint${hintGone ? " fold__hint--hide" : ""}`}>Scroll to drift through · or pick a room below</p>
        </div>

        <footer className="fold__footer">
          <div className="fold__rooms">
            <span className="fold__lead fold__lead--cue">Pick a room</span>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                className={`fold__room${r.id === activeId ? " fold__room--active" : ""}`}
                onClick={() => pickRoom(r.id)}
              >
                {r.name}
                {r.state && <span className="fold__state">{r.state}</span>}
              </button>
            ))}
          </div>
          <div className="fold__mixer">
            <span className="fold__lead">Blend the sound</span>
            {SOUNDS.map((s) => (
              <button key={s} className="fold__pad" aria-pressed={s === sound} onClick={() => setSound(s)}>
                {s}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
