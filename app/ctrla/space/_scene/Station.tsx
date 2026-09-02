"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { type CelestialBody } from "../_map/map";
import { frame, useSpace } from "../_state/useSpace";

// Similar to makeLabelTexture in Bodies.tsx
function makeLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  const scale = 4;
  const ctx = canvas.getContext("2d")!;
  const font = `700 ${13 * scale}px 'Neue Montreal', 'Helvetica Neue', Arial, sans-serif`;
  ctx.font = font;
  const label = text.toUpperCase();
  const spacing = 4 * scale;
  const w = ctx.measureText(label).width + spacing * label.length + 8 * scale;
  canvas.width = Math.ceil(w);
  canvas.height = 22 * scale;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#E3C24A";
  let x = 4 * scale;
  for (const ch of label) {
    ctx.fillText(ch, x, canvas.height / 2);
    x += ctx.measureText(ch).width + spacing;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return { tex, aspect: canvas.width / canvas.height };
}

export function StationBody({ body }: { body: CelestialBody }) {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Sprite>(null);
  const lightsRef = useRef<THREE.Group>(null);
  const rotatingRef = useRef<THREE.Group>(null);

  const label = useMemo(() => makeLabelTexture(body.label), [body.label]);

  useEffect(() => {
    frame.bodyPositions.set(body.id, new THREE.Vector3());
    return () => {
      frame.bodyPositions.delete(body.id);
      label.tex.dispose();
    };
  }, [body.id, label]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const { radius, speed, phase } = body.orbit;
    const a = phase + t * speed;
    g.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    frame.bodyPositions.get(body.id)?.copy(g.position);
    
    // Slow orbit rotation
    g.rotation.y = t * 0.05;

    // Station habitat ring rotation
    if (rotatingRef.current) {
      rotatingRef.current.rotation.x = t * 0.2;
    }

    // Blinking nav lights
    if (lightsRef.current) {
      const pulse = Math.sin(t * 8) > 0 ? 1 : 0.2;
      lightsRef.current.children.forEach((light: any) => {
        if (light.material && light.material.emissiveIntensity !== undefined) {
           light.material.emissiveIntensity = pulse;
        }
      });
    }

    if (ringRef.current) {
      const near = useSpace.getState().nearId === body.id;
      const m = ringRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, near ? 0.55 + Math.sin(t * 4) * 0.2 : 0, 0.1);
    }

    if (labelRef.current) {
      const d = Math.hypot(g.position.x - frame.shipPosition.x, g.position.z - frame.shipPosition.z);
      const reach = 100;
      const want = THREE.MathUtils.clamp(1 - (d - reach * 0.7) / (reach * 0.3), 0, 1) * 0.92;
      const m = labelRef.current.material as THREE.SpriteMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, want, 0.15);
    }
  });

  const [deep, mid, glow] = body.look.palette;

  return (
    <group ref={group}>
      {/* Station Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[body.size * 0.3, body.size * 0.3, body.size * 2, 16]} />
        <meshStandardMaterial color={mid} metalness={0.8} roughness={0.4} flatShading />
      </mesh>
      
      {/* Rotating Habitat Ring */}
      <group ref={rotatingRef}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[body.size * 0.9, body.size * 0.15, 16, 32]} />
          <meshStandardMaterial color={deep} metalness={0.6} roughness={0.5} flatShading />
        </mesh>
        
        {/* Solar Panels on ring */}
        {[0, Math.PI].map((rot, i) => (
          <mesh key={i} position={[0, Math.sin(rot) * body.size * 1.5, Math.cos(rot) * body.size * 1.5]} rotation={[0, 0, rot]}>
             <boxGeometry args={[body.size * 0.8, body.size * 0.05, body.size * 1.2]} />
             <meshStandardMaterial color="#1a2533" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Nav Lights */}
      <group ref={lightsRef}>
         <mesh position={[0, body.size + 0.2, 0]}>
           <sphereGeometry args={[0.1, 8, 8]} />
           <meshStandardMaterial color="#ff2222" emissive="#ff2222" />
         </mesh>
         <mesh position={[0, -body.size - 0.2, 0]}>
           <sphereGeometry args={[0.1, 8, 8]} />
           <meshStandardMaterial color="#22ff22" emissive="#22ff22" />
         </mesh>
      </group>

      {/* Dock ring, flat on the ecliptic. */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[body.size * 2.1, body.size * 2.25, 48]} />
        <meshBasicMaterial color={glow} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <sprite ref={labelRef} position={[0, body.size + 2.6, 0]} scale={[label.aspect * 0.04, 0.04, 1]}>
        <spriteMaterial map={label.tex} transparent opacity={0} depthWrite={false} depthTest={false} sizeAttenuation={false} />
      </sprite>
    </group>
  );
}

