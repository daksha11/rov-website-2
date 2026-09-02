"use client";

// ═══════════════════════════════════════════════════════
// SPACE — NEBULA
//
// The magazine's bokashi sky in three dimensions: a handful of enormous soft
// clouds in plum, rose, and amber, parked between the near and far star
// layers so they parallax at their own rate when the ship banks. Five
// sprites, five draw calls, zero downloaded assets.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function makeCloudTexture(inner: string, outer: string, seed: number) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  // Deterministic blotches so every visit has the same sky.
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const blob = (x: number, y: number, r: number, col: string, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col.replace("A)", `${a})`));
    g.addColorStop(1, col.replace("A)", "0)"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  };
  blob(size / 2, size / 2, size / 2, outer, 0.55);
  for (let i = 0; i < 7; i++) {
    blob(size * (0.3 + rand() * 0.4), size * (0.3 + rand() * 0.4), size * (0.12 + rand() * 0.2), inner, 0.35 + rand() * 0.3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// rgba strings with a literal "A)" alpha slot the helper fills in.
const PLUM = "rgba(78,61,115,A)";
const ROSE = "rgba(122,86,88,A)";
const AMBER = "rgba(194,154,80,A)";
const LAV = "rgba(142,118,184,A)";

const CLOUDS = [
  { pos: [-420, 60, -380], scale: 520, inner: LAV, outer: PLUM, seed: 3, opacity: 0.2, spin: 0.3 },
  { pos: [460, -40, -300], scale: 460, inner: AMBER, outer: ROSE, seed: 5, opacity: 0.16, spin: 1.9 },
  { pos: [120, 90, 520], scale: 580, inner: PLUM, outer: PLUM, seed: 8, opacity: 0.18, spin: 4.1 },
  { pos: [-380, -70, 340], scale: 400, inner: ROSE, outer: PLUM, seed: 13, opacity: 0.14, spin: 2.6 },
  { pos: [520, 120, 200], scale: 360, inner: AMBER, outer: AMBER, seed: 21, opacity: 0.1, spin: 0.9 },
] as const;

export default function Nebula() {
  const group = useRef<THREE.Group>(null);
  const textures = useMemo(() => CLOUDS.map((c) => makeCloudTexture(c.inner, c.outer, c.seed)), []);

  // Slower than the near stars, so the two layers slide against each other.
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.0012;
  });

  return (
    <group ref={group}>
      {CLOUDS.map((c, i) => (
        <sprite key={i} position={c.pos as unknown as [number, number, number]} scale={[c.scale, c.scale, 1]}>
          <spriteMaterial map={textures[i]} transparent opacity={c.opacity} depthWrite={false} rotation={c.spin} />
        </sprite>
      ))}
    </group>
  );
}
