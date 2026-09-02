"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE HUD
//
// Every piece of interface is DOM over the canvas: the masthead label, the
// route chips with live distances, the waypoint arrow, the dock prompt and
// magnetic fill, the intro, Vue's guide bubble, the star-map overlay, the
// FPS meter, the landing wipe, photo mode. DOM text is crisp, accessible,
// and costs the GPU nothing, which in-canvas UI never manages. Nothing here
// may import from _scene (that would pull three into the page chunk).
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BODIES, MAJOR_STOPS, bodyById, type CelestialBody } from "./_map/map";
import { HOME_LINE } from "./_map/narration";
import { routeFor } from "./_map/routes";
import { FLIGHT } from "./_map/flight";
import { frame, useSpace } from "./_state/useSpace";
import { track } from "./_state/track";
import { readProfile } from "@/lib/ctrla/profile";
import { VueBust } from "../_components/vue/Vue";
import { ed } from "../_components/editorial";
import DockPanel from "./DockPanel";
import StarMap from "./StarMap";
import Guide from "./Guide";

export default function Hud() {
  const router = useRouter();
  const nearId = useSpace((s) => s.nearId);
  const dockedId = useSpace((s) => s.dockedId);
  const autopilotId = useSpace((s) => s.autopilotId);
  const landingId = useSpace((s) => s.landingId);
  const photo = useSpace((s) => s.photo);
  const visited = useSpace((s) => s.visited);
  const introSeen = useSpace((s) => s.introSeen);
  const mapOpen = useSpace((s) => s.mapOpen);
  const fps = useSpace((s) => s.fps);
  const quality = useSpace((s) => s.quality);
  const route = useSpace((s) => s.route);
  const step = useSpace((s) => s.step);
  const guideHidden = useSpace((s) => s.guideHidden);

  const near = nearId ? bodyById(nearId) : null;
  const docked = dockedId ? bodyById(dockedId) : null;
  const landing = landingId ? bodyById(landingId) : null;
  const waypointId = route[step] ?? null;

  // ── flag the document while the ship is up ──
  // The CTRL·A nav is a glass bar (backdrop-filter). Over a page that is
  // fine; over a canvas that repaints every frame it re-blurs a full-width
  // strip 60 times a second. globals.css swaps it for a plain scrim while
  // this attribute is present.
  useEffect(() => {
    document.documentElement.setAttribute("data-ctrla-space", "");
    return () => document.documentElement.removeAttribute("data-ctrla-space");
  }, []);

  // ── photo mode flag, same trick ──
  useEffect(() => {
    if (photo) document.documentElement.setAttribute("data-ctrla-photo", "");
    else document.documentElement.removeAttribute("data-ctrla-photo");
    return () => document.documentElement.removeAttribute("data-ctrla-photo");
  }, [photo]);

  // ── the line: drawn from the quiz profile, if there is one ──
  const [home, setHome] = useState<CelestialBody | null>(null);
  useEffect(() => {
    const p = readProfile();
    if (!p) return;
    useSpace.getState().setRoute(routeFor(p));
    const b = bodyById(p.crafts[0]);
    if (b && HOME_LINE[b.id]) setHome(b);
  }, []);

  // ── keys the HUD owns: E dock, Esc close, M map, P photo, H guide ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useSpace.getState();
      if (s.landingId) return;
      const k = e.key.toLowerCase();
      if (k === "e" && s.nearId && !s.dockedId && s.introSeen) s.dock(s.nearId);
      else if (k === "escape") {
        if (s.photo) s.togglePhoto(false);
        else if (s.mapOpen) s.toggleMap(false);
        else if (s.dockedId) s.undock();
      } else if (k === "m" && s.introSeen && !s.photo) s.toggleMap();
      else if (k === "p" && s.introSeen && !s.dockedId && !s.mapOpen) s.togglePhoto();
      else if (k === "h" && s.introSeen) s.toggleGuide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── live distances + speed + dock fill, polled at 8Hz from frame refs ──
  const [dists, setDists] = useState<Record<string, number>>({});
  const [speed, setSpeed] = useState(0);
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const out: Record<string, number> = {};
      for (const b of BODIES) {
        const p = frame.bodyPositions.get(b.id);
        if (p) out[b.id] = Math.hypot(p.x - frame.shipPosition.x, p.z - frame.shipPosition.z);
      }
      setDists(out);
      setSpeed(frame.shipSpeed);
      setFill(frame.dockFill);
    }, 125);
    return () => clearInterval(id);
  }, []);

  // ── waypoint arrow: positioned every frame from the scene's projection,
  //    written straight to the element so React never sees 60Hz ──
  const arrowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = arrowRef.current;
      if (!el) return;
      const w = frame.waypoint;
      const s = useSpace.getState();
      if (!w.visible || w.onScreen || s.dockedId || s.mapOpen || s.photo) {
        if (el.style.display !== "none") el.style.display = "none";
        return;
      }
      const W = window.innerWidth;
      const H = window.innerHeight;
      const m = 72; // inset from the edge, clear of the nav and chips
      const cx = W / 2;
      const cy = H / 2;
      const dx = Math.cos(w.angle);
      const dy = Math.sin(w.angle);
      // Scale the direction to the inset box edge.
      const kx = dx !== 0 ? (W / 2 - m) / Math.abs(dx) : Infinity;
      // Asymmetric vertically: the chip bar owns the bottom 110px.
      const ky = dy !== 0 ? (dy > 0 ? H / 2 - 120 : H / 2 - m - 40) / Math.abs(dy) : Infinity;
      const k = Math.min(kx, ky);
      const x = cx + dx * k;
      const y = cy + dy * k + (dy > 0 ? 0 : 20);
      el.style.display = "flex";
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      const svg = el.firstElementChild as HTMLElement | null;
      if (svg) svg.style.transform = `rotate(${(w.angle * 180) / Math.PI}deg)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── landing: the dive runs in the scene; here the wipe, then the page ──
  useEffect(() => {
    if (!landing) return;
    track("space_enter", { body: landing.id, via: "ship" });
    const t = setTimeout(() => router.push(landing.stop.href), 1000);
    return () => clearTimeout(t);
  }, [landing, router]);

  // ── photo mode: copy a deep link to the nearest stop ──
  const [photoAt, setPhotoAt] = useState<CelestialBody | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!photo) return;
    let best: CelestialBody | null = null;
    let bestD = Infinity;
    for (const b of BODIES) {
      const p = frame.bodyPositions.get(b.id);
      if (!p) continue;
      const d = Math.hypot(p.x - frame.shipPosition.x, p.z - frame.shipPosition.z);
      if (d < bestD) {
        bestD = d;
        best = b;
      }
    }
    setPhotoAt(best);
    setCopied(false);
    if (best && navigator.clipboard) {
      navigator.clipboard
        .writeText(`${window.location.origin}/ctrla/space?at=${best.id}`)
        .then(() => setCopied(true))
        .catch(() => setCopied(false));
    }
  }, [photo]);

  const fly = (b: CelestialBody) => {
    useSpace.getState().setAutopilot(b.id);
    useSpace.getState().toggleMap(false);
  };

  const startHome = () => {
    const s = useSpace.getState();
    s.dismissIntro();
    if (home) s.setAutopilot(home.id);
  };

  const streak = Math.max(0, Math.min(1, (speed - FLIGHT.MAX_SPEED) / (FLIGHT.MAX_SPEED_BOOST - FLIGHT.MAX_SPEED)));
  const waypoint = waypointId ? bodyById(waypointId) : null;
  // Chips show the line when there is one, otherwise the big stops.
  const chips: CelestialBody[] = route.length ? (route.map((id) => bodyById(id)).filter(Boolean) as CelestialBody[]) : MAJOR_STOPS;

  return (
    <>
      {/* Film grain. Its own cheap class, not the magazine's blend-mode one. */}
      <div aria-hidden className="ctrla-space-grain" />
      {/* Speed streaks past cruise */}
      <div aria-hidden className="ctrla-space-streaks" style={{ opacity: streak * 0.9 }} />

      {/* Masthead */}
      <div className="ctrla-space-masthead">
        <span className="ctrla-space-kicker">CTRL·A · Space</span>
        <span className="ctrla-space-kicker" style={{ opacity: 0.7 }}>
          {route.length ? `${Math.min(step, route.length)} / ${route.length} on your line · ` : ""}
          {visited.length} / {BODIES.length} charted
        </span>
      </div>

      {/* Waypoint arrow, off-screen only */}
      <div ref={arrowRef} className="ctrla-space-arrow" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke={ed.gold} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
        {waypoint && (
          <span className="ctrla-space-kicker">
            {waypoint.label}
            {dists[waypoint.id] !== undefined && <span style={{ opacity: 0.7 }}> · {Math.round(dists[waypoint.id])}</span>}
          </span>
        )}
      </div>

      {/* Chips: the line, in order; click to autopilot there */}
      {introSeen && !docked && (
        <nav className="ctrla-space-chips" aria-label={route.length ? "Your line" : "Stops"}>
          {chips.map((b, i) => {
            const d = dists[b.id];
            const seen = visited.includes(b.id);
            const active = autopilotId === b.id;
            const current = waypointId === b.id;
            return (
              <button key={b.id} type="button" onClick={() => fly(b)} className="ctrla-space-chip" data-active={active} data-seen={seen} data-current={current}>
                {route.length ? <span className="ctrla-space-chip-n">{String(i + 1).padStart(2, "0")}</span> : null}
                <span className="ctrla-space-chip-dot" style={{ background: seen ? ed.gold : b.look.palette[1] }} />
                {b.label}
                {d !== undefined && <span className="ctrla-space-chip-dist">{Math.round(d)}</span>}
              </button>
            );
          })}
          <button type="button" onClick={() => useSpace.getState().toggleMap(true)} className="ctrla-space-chip" aria-label="Open the map">
            <kbd style={{ marginRight: 0 }}>M</kbd>
          </button>
        </nav>
      )}

      {/* Dock prompt, with the magnetic fill */}
      {introSeen && near && !docked && (
        <div className="ctrla-space-prompt">
          {fill > 0 ? (
            <>
              Docking at <strong>{near.label}</strong> · <kbd>E</kbd> now · <kbd>W</kbd> wave off
            </>
          ) : (
            <>
              <kbd>E</kbd> Dock at <strong>{near.label}</strong> · or hold still
            </>
          )}
          <span className="ctrla-space-fill" aria-hidden>
            <i style={{ width: `${Math.round(fill * 100)}%` }} />
          </span>
        </div>
      )}
      {introSeen && autopilotId && !near && !docked && (
        <div className="ctrla-space-prompt" style={{ opacity: 0.85 }}>
          Autopilot <span aria-hidden>→</span> <strong>{bodyById(autopilotId)?.label}</strong> · any key to take over
        </div>
      )}

      {/* Speed + fps + render scale, small, bottom-right */}
      <div className="ctrla-space-meter">
        <span>{Math.round(speed)} u/s</span>
        <span style={{ opacity: 0.6 }}>{fps} fps</span>
        <span style={{ opacity: 0.6 }}>{quality}×</span>
        <span style={{ opacity: 0.6 }}>
          <kbd style={{ marginRight: 4 }}>P</kbd>photo
        </span>
        <span style={{ opacity: 0.6 }}>
          <kbd style={{ marginRight: 4 }}>H</kbd>
          {guideHidden ? "vue" : "quiet"}
        </span>
      </div>

      {/* Vue, the guide */}
      <Guide />

      {/* Photo mode frame */}
      {photo && (
        <div className="ctrla-space-frame" aria-hidden>
          <span className="ctrla-space-kicker">CTRL·A · Space{photoAt ? ` · ${photoAt.label}` : ""}</span>
          <span className="ctrla-space-kicker">{copied ? "Link copied" : "Photo mode"} · P to exit</span>
        </div>
      )}

      {/* Intro */}
      {!introSeen && (
        <div className="ctrla-space-dock">
          <div className="ctrla-space-dock-inner">
            <span className="ctrla-space-kicker">CTRL·A · Space · Vol. 01</span>
            <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5vw,68px)", letterSpacing: "-0.03em", lineHeight: 0.92, color: ed.ink, margin: "14px 0 18px" }}>
              Take the ship.
            </h1>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", maxWidth: 520, marginBottom: 18 }}>
              <VueBust pose="showing" size={44} mood="alert" style={{ border: `1px solid ${ed.amber}`, marginTop: 2 }} />
              <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,1.8vw,22px)", lineHeight: 1.4, color: ed.ink, margin: 0 }}>
                {home
                  ? HOME_LINE[home.id]
                  : "Everything in this volume is out here somewhere. I will draw you a line through it once you tell me what you make. Nothing to win. Just look around."}
              </p>
            </div>
            {route.length > 0 && (
              <p className="ctrla-space-kicker" style={{ margin: "0 0 22px", opacity: 0.85 }}>
                Your line · {route.map((id, i) => `${String(i + 1).padStart(2, "0")} ${bodyById(id)?.label ?? id}`).join(" · ")}
              </p>
            )}
            <div className="ctrla-space-keys">
              <span><kbd>W</kbd> thrust</span>
              <span><kbd>A</kbd><kbd>D</kbd> turn</span>
              <span><kbd>Space</kbd> brake</span>
              <span><kbd>Shift</kbd> boost</span>
              <span><kbd>E</kbd> dock</span>
              <span><kbd>M</kbd> map</span>
              <span><kbd>P</kbd> photo</span>
              <span><kbd>H</kbd> quiet Vue</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              {home ? (
                <>
                  <button type="button" className="ctrla-space-enter" onClick={startHome}>
                    Fly to {home.label} <span aria-hidden>→</span>
                  </button>
                  <button type="button" className="ctrla-space-ghost" onClick={() => useSpace.getState().dismissIntro()}>
                    Just fly
                  </button>
                </>
              ) : (
                <button type="button" className="ctrla-space-enter" onClick={() => useSpace.getState().dismissIntro()}>
                  Fly <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dock panel */}
      {docked && !landing && <DockPanel body={docked} onClose={() => useSpace.getState().undock()} onEnter={(b) => useSpace.getState().land(b.id)} />}

      {/* Landing wipe, in the planet's own colour */}
      {landing && <div aria-hidden className="ctrla-space-landing" style={{ background: landing.look.palette[1] }} />}

      {/* Star map overlay */}
      {mapOpen && (
        <div className="ctrla-space-dock" onClick={() => useSpace.getState().toggleMap(false)}>
          <div className="ctrla-space-map-wrap" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span className="ctrla-space-kicker">The map · click a stop to fly there</span>
              <button type="button" className="ctrla-space-ghost" onClick={() => useSpace.getState().toggleMap(false)}>
                Close <kbd>Esc</kbd>
              </button>
            </div>
            <StarMap mode="overlay" onSelect={fly} />
          </div>
        </div>
      )}
    </>
  );
}
