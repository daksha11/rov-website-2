"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE WAYPOINT
//
// One lit chevron over the next stop on the line, and the numbers the HUD
// needs to draw its edge-of-screen arrow when that stop is out of frame.
// The projection happens here because only the scene has the camera; the
// HUD reads `frame.waypoint` on its own rAF and never touches three.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { bodyById } from "../_map/map";
import { frame, useSpace } from "../_state/useSpace";

function makeChevron() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "#E3C24A";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(28, 40);
  ctx.lineTo(64, 84);
  ctx.lineTo(100, 40);
  ctx.stroke();
  return new THREE.CanvasTexture(c);
}

export default function Waypoint() {
  const sprite = useRef<THREE.Sprite>(null);
  const tex = useMemo(makeChevron, []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock, size }) => {
    const s = sprite.current;
    if (!s) return;
    const st = useSpace.getState();
    const id = st.route[st.step] ?? null;
    const body = id ? bodyById(id) : null;
    const p = id ? frame.bodyPositions.get(id) : null;
    const show = !!(body && p) && st.dockedId !== id && st.introSeen;
    s.visible = show;
    frame.waypoint.visible = show;
    if (!show || !body || !p) return;

    const t = clock.elapsedTime;
    s.position.set(p.x, p.y + body.size + 4.5 + Math.sin(t * 2.4) * 0.6, p.z);
    const pulse = 0.05 + Math.sin(t * 2.4) * 0.006;
    s.scale.set(pulse, pulse, 1);

    // Project for the HUD arrow.
    v.copy(s.position).project(camera);
    const behind = v.z > 1;
    const onScreen = !behind && Math.abs(v.x) < 0.92 && Math.abs(v.y) < 0.9;
    frame.waypoint.onScreen = onScreen;
    frame.waypoint.x = (v.x * 0.5 + 0.5) * size.width;
    frame.waypoint.y = (-v.y * 0.5 + 0.5) * size.height;
    // Direction from screen centre, in screen space (y down). Behind the
    // camera the projection flips, so flip it back.
    const dx = behind ? -v.x : v.x;
    const dy = behind ? v.y : -v.y;
    frame.waypoint.angle = Math.atan2(dy, dx);
  });

  return (
    <sprite ref={sprite} visible={false}>
      <spriteMaterial map={tex} transparent depthTest={false} depthWrite={false} sizeAttenuation={false} opacity={0.95} />
    </sprite>
  );
}
