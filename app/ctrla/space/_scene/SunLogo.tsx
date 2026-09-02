"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE SUN IS THE MARK
//
// The CTRL·A flat logo, loaded from the same SVG the nav uses, extruded into
// a slowly turning gold form at the centre of the system. Loaded through
// Suspense, so the plain gold core stands in until the shapes arrive.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const LOGO_URL = "/ctrla/ctrla-flat-logo-white.svg";

export default function SunLogo({ size }: { size: number }) {
  const data = useLoader(SVGLoader, LOGO_URL);
  const mesh = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    // The logo's hand-drawn outlines are thousands of tiny curves; a low
    // curve segment count keeps the extrusion well under 50k triangles.
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 42,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 4,
      bevelSegments: 2,
      curveSegments: 3,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const w = bb.max.x - bb.min.x;
    const h = bb.max.y - bb.min.y;
    const d = bb.max.z - bb.min.z;
    geo.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), -(bb.min.z + d / 2));
    const s = (size * 1.75) / w;
    geo.scale(s, s, s);
    // SVG y runs down; a half-turn about x sets it upright without flipping
    // the winding the way a negative scale would.
    geo.rotateX(Math.PI);
    geo.computeVertexNormals();
    return geo;
  }, [data, size]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    mesh.current.rotation.y = t * 0.22;
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      {/* The key light sits inside this mesh, so emissive carries the colour
          and the hemisphere fill gives the bevels their edge. */}
      {/* Cream like the nav mark, lit gold from within, so it reads as a
          light shape against the halo instead of gold on gold. */}
      <meshStandardMaterial color="#FFF4D6" emissive="#E3C24A" emissiveIntensity={0.55} roughness={0.4} metalness={0.15} />
    </mesh>
  );
}
