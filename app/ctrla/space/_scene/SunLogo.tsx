"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE SUN IS THE MARK
//
// The CTRL·A logo at the centre of the system. Redesigned to feel like a
// holographic artifact floating in the sun's corona: bright white core with
// a subtle glass edge, orbiting accent lights, and a gentle hover bob.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const LOGO_URL = "/ctrla/ctrla-flat-logo-white.svg";

export default function SunLogo({ size }: { size: number }) {
  const data = useLoader(SVGLoader, LOGO_URL);
  const group = useRef<THREE.Group>(null);
  const innerMesh = useRef<THREE.Mesh>(null);
  const outerMesh = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const accentLight = useRef<THREE.PointLight>(null);

  const geometry = useMemo(() => {
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 18,
      bevelEnabled: true,
      bevelThickness: 3,
      bevelSize: 2.5,
      bevelSegments: 3,
      curveSegments: 4,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const w = bb.max.x - bb.min.x;
    const h = bb.max.y - bb.min.y;
    const d = bb.max.z - bb.min.z;
    geo.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), -(bb.min.z + d / 2));
    const s = (size * 1.6) / w;
    geo.scale(s, s, s);
    geo.rotateX(Math.PI);
    geo.computeVertexNormals();
    return geo;
  }, [data, size]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;

    // Slow, majestic rotation
    group.current.rotation.y = t * 0.15;

    // Gentle floating hover
    group.current.position.y = Math.sin(t * 0.4) * 0.8;

    // Subtle breathe on the inner glow
    if (innerMesh.current) {
      const mat = innerMesh.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.8 + Math.sin(t * 1.2) * 0.4;
    }

    // Outer shell pulses subtly
    if (outerMesh.current) {
      const mat = outerMesh.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.12 + Math.sin(t * 0.8 + 1) * 0.04;
    }

    // Orbiting accent rings
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.6;
      ring1.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.4;
      ring2.current.rotation.y = Math.cos(t * 0.25) * 0.4;
    }

    // Orbiting accent light
    if (accentLight.current) {
      const r = size * 2.5;
      accentLight.current.position.set(
        Math.cos(t * 0.5) * r,
        Math.sin(t * 0.35) * r * 0.5,
        Math.sin(t * 0.5) * r
      );
      accentLight.current.intensity = 80 + Math.sin(t * 2) * 30;
    }
  });

  return (
    <group ref={group}>
      {/* Inner core: bright white, hot emissive — the logo itself */}
      <mesh ref={innerMesh} geometry={geometry}>
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={1.8}
          roughness={0.15}
          metalness={0.0}
        />
      </mesh>

      {/* Outer ghost shell: slightly larger, translucent, cool-toned edge */}
      <mesh ref={outerMesh} geometry={geometry} scale={1.06}>
        <meshStandardMaterial
          color="#B8D4FF"
          emissive="#7EB8FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.6}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting accent ring 1 */}
      <mesh ref={ring1}>
        <torusGeometry args={[size * 1.8, 0.08, 8, 64]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting accent ring 2 — wider, dimmer */}
      <mesh ref={ring2}>
        <torusGeometry args={[size * 2.4, 0.05, 8, 64]} />
        <meshBasicMaterial
          color="#A8CCFF"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Moving accent light to give the bevels life */}
      <pointLight
        ref={accentLight}
        color="#B8D4FF"
        intensity={80}
        distance={size * 6}
        decay={2}
      />
    </group>
  );
}
