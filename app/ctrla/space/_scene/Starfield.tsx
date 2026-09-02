"use client";

// Two instanced point layers: a far shell that never moves and a nearer band
// that drifts almost imperceptibly, which is what sells depth when the ship
// banks. Two draw calls for six thousand stars.

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function makeStars(count: number, minR: number, maxR: number, seed: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  // Deterministic pseudo-random so the sky is the same on every visit.
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const gold = new THREE.Color("#E3C24A");
  const paper = new THREE.Color("#F0E6E0");
  const lav = new THREE.Color("#8E76B8");
  for (let i = 0; i < count; i++) {
    // Uniform on a spherical shell, thinned near the poles for a banded sky.
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = minR + rand() * (maxR - minR);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const roll = rand();
    const c = roll < 0.08 ? gold : roll < 0.2 ? lav : paper;
    const dim = 0.45 + rand() * 0.55;
    colors[i * 3] = c.r * dim;
    colors[i * 3 + 1] = c.g * dim;
    colors[i * 3 + 2] = c.b * dim;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export default function Starfield() {
  const far = useMemo(() => makeStars(4200, 550, 850, 7), []);
  const near = useMemo(() => makeStars(1800, 260, 480, 99), []);
  const nearRef = useRef<THREE.Points>(null);

  useFrame((_, dt) => {
    if (nearRef.current) nearRef.current.rotation.y += dt * 0.0035;
  });

  return (
    <>
      <points geometry={far}>
        <pointsMaterial size={1.7} sizeAttenuation vertexColors transparent opacity={0.9} depthWrite={false} />
      </points>
      <points ref={nearRef} geometry={near}>
        <pointsMaterial size={1.1} sizeAttenuation vertexColors transparent opacity={0.75} depthWrite={false} />
      </points>
    </>
  );
}
