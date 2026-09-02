"use client";

// ═══════════════════════════════════════════════════════
// SPACE — ENGINE TRAIL
//
// A ribbon of additive gold behind the engine. A ring buffer of the last N
// engine positions becomes a triangle strip in the ecliptic plane, wide and
// bright at the head, thin and gone at the tail. Its opacity follows speed,
// so a parked ship has no trail and a boosting one draws a comet. One mesh,
// fifty-six vertices, updated in place.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { frame } from "../_state/useSpace";
import { FLIGHT } from "../_map/flight";

const N = 28;
const ENGINE_BACK = 2.9; // engine sprite sits this far behind the ship origin

export default function Trail() {
  const mesh = useRef<THREE.Mesh>(null);
  const points = useRef(Array.from({ length: N }, () => new THREE.Vector3(0, 0, 44 + ENGINE_BACK)));
  const lastPerp = useRef(new THREE.Vector3(1, 0, 0));
  const opacity = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3));
    const alpha = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      const a = Math.pow(1 - i / (N - 1), 1.6);
      alpha[i * 2] = a;
      alpha[i * 2 + 1] = a;
    }
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    const index: number[] = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      index.push(a, b, c, b, d, c);
    }
    geo.setIndex(index);
    // The strip moves every frame; a generous static bound skips culling math.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), FLIGHT.WORLD_RADIUS * 2);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 0 } },
        vertexShader: /* glsl */ `
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          varying float vAlpha;
          void main() {
            // Gold core cooling to amber at the tail.
            vec3 col = mix(vec3(0.76, 0.60, 0.31), vec3(1.0, 0.92, 0.62), vAlpha);
            gl_FragColor = vec4(col, vAlpha * uOpacity);
          }
        `,
      }),
    []
  );

  const engine = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const perp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const h = frame.shipHeading;
    engine.set(frame.shipPosition.x + Math.sin(h) * ENGINE_BACK, 0, frame.shipPosition.z + Math.cos(h) * ENGINE_BACK);

    // Advance the ring buffer only once the engine has moved a little, so a
    // slow ship draws a short trail rather than a bunched-up bright blob.
    const pts = points.current;
    if (pts[0].distanceToSquared(engine) > 0.36) {
      const tail = pts.pop()!;
      tail.copy(engine);
      pts.unshift(tail);
    } else {
      pts[0].copy(engine);
    }

    const speedNorm = Math.min(frame.shipSpeed / FLIGHT.MAX_SPEED_BOOST, 1);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      const p = pts[i];
      const q = pts[Math.min(i + 1, N - 1)];
      dir.subVectors(p, q);
      if (dir.lengthSq() > 1e-6) {
        perp.set(-dir.z, 0, dir.x).normalize();
        lastPerp.current.copy(perp);
      } else {
        perp.copy(lastPerp.current);
      }
      const w = (0.14 + speedNorm * 0.36) * (1 - i / N);
      pos.setXYZ(i * 2, p.x + perp.x * w, p.y, p.z + perp.z * w);
      pos.setXYZ(i * 2 + 1, p.x - perp.x * w, p.y, p.z - perp.z * w);
    }
    pos.needsUpdate = true;

    // Fade with speed, eased so the trail blooms on boost instead of popping.
    const want = Math.pow(speedNorm, 1.4) * 0.6;
    opacity.current = THREE.MathUtils.lerp(opacity.current, want, 1 - Math.exp(-5 * dt));
    material.uniforms.uOpacity.value = opacity.current;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
