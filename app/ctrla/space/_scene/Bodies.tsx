"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE BODIES
//
// Renders every entry in the map registry: the sun, planets, moons,
// asteroids, and the comet. All geometry is procedural — a displaced
// icosahedron per body, generated once from its seed — so the whole system
// costs zero downloaded assets.
//
// Positions are recomputed every frame from orbit params (planets around the
// sun, moons around their parent) and written into `frame.bodyPositions`,
// which is what the ship's docking check and the HUD distances read.
// ═══════════════════════════════════════════════════════

import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BODIES, type CelestialBody } from "../_map/map";
import { frame, useSpace } from "../_state/useSpace";
import SunLogo from "./SunLogo";

// ── Simplex 3D Noise ───────────────────────────────────
const SNOISE = /* glsl */ `
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z); 
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

// A fresnel shell: transparent face-on, glowing at the limb, in the body's
// own glow colour. Additive, so it reads as light, not paint. The same
// shader, tuned hotter, is the sun's bloom edge.
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Smoother, thicker fresnel for better atmospheric scattering
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor, rim * uStrength);
  }
`;
function makeAtmosphere(color: string, power: number, strength: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power * 0.8 }, // Thicker atmosphere
      uStrength: { value: strength * 1.5 }, // Brighter edge
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
  });
}

// ── Procedural Clouds ──────────────────────────────────
// Scrolling simplex noise spheres mapped onto slightly larger geometry
const CLOUD_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const CLOUD_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vPos;
  ${SNOISE}
  void main() {
    float n = snoise(vPos * 0.3 + uTime * 0.05);
    float n2 = snoise(vPos * 0.8 - uTime * 0.02);
    float clouds = smoothstep(0.1, 0.6, n * 0.6 + n2 * 0.4);
    gl_FragColor = vec4(uColor, clouds * 0.45);
  }
`;
function makeClouds(color: string) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: CLOUD_VERT,
    fragmentShader: CLOUD_FRAG,
  });
}

// ── Procedural low-poly rock ───────────────────────────
// Icosahedron with per-vertex noise displacement, flat-shaded. The seed makes
// every body's lumps its own; the size scales them.
function makeBodyGeometry(size: number, seed: number, bumpy: number) {
  const geo = new THREE.IcosahedronGeometry(size, 2);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Cheap deterministic noise from the vertex direction + seed.
    const n =
      Math.sin(v.x * 2.1 + seed) * Math.sin(v.y * 1.7 + seed * 2.0) * Math.sin(v.z * 2.3 + seed * 0.5);
    v.multiplyScalar(1 + n * bumpy);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  // Flat shading needs unwelded faces. IcosahedronGeometry already ships
  // non-indexed in r184, so only unweld if some future geometry is indexed.
  const flat = geo.index ? geo.toNonIndexed() : geo;
  flat.computeVertexNormals();
  if (flat !== geo) geo.dispose();
  return flat;
}

// ── Gold small-caps label sprite ───────────────────────
// Canvas-rasterized text on a sprite, so every body carries its name the way
// the magazine's labels do. Generated once per body.
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

// Soft radial gold dot, shared by the sun's core glow. Drawn once.
let glowTexCache: THREE.CanvasTexture | null = null;
function getGlowTex() {
  if (glowTexCache) return glowTexCache;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,244,200,1)");
  g.addColorStop(0.25, "rgba(227,194,74,0.7)");
  g.addColorStop(0.6, "rgba(227,194,74,0.18)");
  g.addColorStop(1, "rgba(227,194,74,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexCache = new THREE.CanvasTexture(c);
  return glowTexCache;
}

function Body({ body }: { body: CelestialBody }) {
  const group = useRef<THREE.Group>(null);
  const glowTex = useMemo(getGlowTex, []);
  const ringRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Sprite>(null);
  const coreGlowRef = useRef<THREE.Sprite>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const isSun = body.kind === "sun";
  const isSmall = body.kind === "moon" || body.kind === "asteroid";

  const geometry = useMemo(
    () => makeBodyGeometry(body.size, body.look.seed, body.kind === "asteroid" ? 0.22 : isSun ? 0.02 : 0.09),
    [body, isSun]
  );
  const label = useMemo(() => makeLabelTexture(body.label), [body.label]);
  const atmosphere = useMemo(
    () => makeAtmosphere(body.look.palette[2], isSun ? 2.2 : isSmall ? 3.2 : 2.6, isSun ? 1.1 : isSmall ? 0.45 : 0.7),
    [body.look.palette, isSun, isSmall]
  );
  const clouds = useMemo(
    () => (body.kind === "planet" ? makeClouds("#FFFFFF") : null),
    [body.kind]
  );
  const cityUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    frame.bodyPositions.set(body.id, new THREE.Vector3());
    return () => {
      frame.bodyPositions.delete(body.id);
      geometry.dispose();
      label.tex.dispose();
      atmosphere.dispose();
      if (clouds) clouds.dispose();
    };
  }, [body.id, geometry, label, atmosphere, clouds]);

  useFrame(({ clock, camera }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const { radius, speed, phase } = body.orbit;
    const a = phase + t * speed;
    // Moons orbit their parent's live position; everything else the origin.
    const cx = body.parent ? frame.bodyPositions.get(body.parent)?.x ?? 0 : 0;
    const cz = body.parent ? frame.bodyPositions.get(body.parent)?.z ?? 0 : 0;
    g.position.set(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius);
    frame.bodyPositions.get(body.id)?.copy(g.position);
    g.rotation.y = t * (isSun ? 0.02 : 0.1);
    
    if (clouds) clouds.uniforms.uTime.value = t;
    cityUniforms.uTime.value = t;

    // Dock ring: visible and breathing only while this body is the near one.
    if (ringRef.current) {
      const near = useSpace.getState().nearId === body.id;
      const m = ringRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, near ? 0.55 + Math.sin(t * 4) * 0.2 : 0, 0.1);
    }

    // The sun's halos are sized to read from the outer orbits. Up close,
    // additive sprites that wide would wash the whole frame gold, so they
    // fade out as the camera closes in and the fresnel edge takes over.
    if (isSun && (coreGlowRef.current || haloRef.current)) {
      const d = camera.position.distanceTo(g.position);
      if (coreGlowRef.current) {
        (coreGlowRef.current.material as THREE.SpriteMaterial).opacity = 0.85 * THREE.MathUtils.smoothstep(d, 16, 50);
      }
      if (haloRef.current) {
        (haloRef.current.material as THREE.SpriteMaterial).opacity = 0.26 * THREE.MathUtils.smoothstep(d, 34, 150);
      }
    }

    // Labels are screen-constant, so a distant cluster of moons would pile
    // its names on top of each other. Big stops stay labelled from anywhere;
    // small bodies only announce themselves once the ship is fairly close.
    if (labelRef.current) {
      const d = Math.hypot(g.position.x - frame.shipPosition.x, g.position.z - frame.shipPosition.z);
      const reach = isSmall ? 70 : 400;
      const want = THREE.MathUtils.clamp(1 - (d - reach * 0.7) / (reach * 0.3), 0, 1) * 0.92;
      const m = labelRef.current.material as THREE.SpriteMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, want, 0.15);
    }
  });

  const [deep, mid, glow] = body.look.palette;

  return (
    <group ref={group}>
      {isSun ? (
        <>
          {/* The system's key light lives inside the sun. r184 lights are in
              physical units with inverse-square falloff, so the intensity
              is in the thousands to reach the outer orbits. */}
          <pointLight intensity={14000} decay={2} color="#F2D27A" />
          {/* The mark itself, extruded and turning. The plain core stands in
              while the SVG loads. */}
          <Suspense
            fallback={
              <mesh geometry={geometry}>
                <meshBasicMaterial color={glow} />
              </mesh>
            }
          >
            <SunLogo size={body.size} />
          </Suspense>
          {/* A dim amber heart behind the mark, so it never reads as a cut-out
              when seen edge-on. */}
          <mesh scale={body.size * 0.4}>
            <sphereGeometry args={[1, 24, 18]} />
            <meshBasicMaterial color={mid} />
          </mesh>
          {/* Bloom without a post pass: a hot core sprite, a wide soft halo,
              and a fresnel edge on the heart. */}
          <sprite ref={coreGlowRef} scale={[body.size * 6, body.size * 6, 1]}>
            <spriteMaterial map={glowTex} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
          <sprite ref={haloRef} scale={[body.size * 13, body.size * 13, 1]}>
            <spriteMaterial map={glowTex} transparent opacity={0.26} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
          <mesh scale={body.size * 1.05} material={atmosphere}>
            <sphereGeometry args={[1, 32, 24]} />
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={geometry}>
            {/* Emissive carries the body's own colour on the night side, so a
                planet turned away from the sun is dim, never black. */}
            <meshStandardMaterial 
              color={mid} 
              emissive={mid} 
              emissiveIntensity={0.28} 
              flatShading 
              roughness={0.85}
              onBeforeCompile={(shader) => {
                if (body.kind !== "planet") return;
                shader.uniforms.uTime = cityUniforms.uTime;
                shader.vertexShader = `
                  varying vec3 vWorldPos;
                  ${shader.vertexShader}
                `.replace(
                  `#include <worldpos_vertex>`,
                  `#include <worldpos_vertex>
                   vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
                );
                shader.fragmentShader = `
                  uniform float uTime;
                  varying vec3 vWorldPos;
                  ${SNOISE}
                  ${shader.fragmentShader}
                `.replace(
                  `#include <emissivemap_fragment>`,
                  `#include <emissivemap_fragment>
                   vec3 sunDir = normalize(-vWorldPos); // Sun is at origin
                   float sunDot = dot(normalize(vNormal), normalize((viewMatrix * vec4(sunDir, 0.0)).xyz));
                   if (sunDot < 0.1) {
                     float n = snoise(vWorldPos * 2.0);
                     if (n > 0.75) {
                       totalEmissiveRadiance += vec3(1.0, 0.8, 0.4) * (0.1 - sunDot) * 2.5 * ((n - 0.75) * 4.0);
                     }
                   }
                  `
                );
              }}
            />
          </mesh>
          {/* Atmosphere: a lit limb in the body's glow colour. */}
          <mesh scale={body.size * (isSmall ? 1.16 : 1.2)} material={atmosphere}>
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
          {/* Clouds for planets */}
          {clouds && (
            <mesh scale={body.size * 1.08} material={clouds}>
              <sphereGeometry args={[1, 24, 18]} />
            </mesh>
          )}
        </>
      )}

      {/* Comet tail: a stretched cone of additive gold behind the head. */}
      {body.kind === "comet" && (
        <mesh position={[-body.size * 3.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[body.size * 0.9, body.size * 6, 8, 1, true]} />
          <meshBasicMaterial color="#E3C24A" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Dock ring, flat on the ecliptic. */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[body.size * 2.1, body.size * 2.25, 48]} />
        <meshBasicMaterial color="#E3C24A" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* The name, floating above. Screen-constant size, so a label never
          balloons when the ship passes close. */}
      <sprite ref={labelRef} position={[0, body.size + (isSun ? 6 : 2.6), 0]} scale={[label.aspect * (isSmall ? 0.03 : 0.04), isSmall ? 0.03 : 0.04, 1]}>
        <spriteMaterial map={label.tex} transparent opacity={0} depthWrite={false} depthTest={false} sizeAttenuation={false} />
      </sprite>
    </group>
  );
}

import { StationBody } from "./Station";
import { FLIGHT } from "../_map/flight";

// ── Asteroid Belt (world border) ────────────────────────
// A ring of small procedural rocks at WORLD_RADIUS to visually
// represent the edge of the navigable map.
function AsteroidBelt() {
  const rocks = useMemo(() => {
    const count = 260;
    const radius = FLIGHT.WORLD_RADIUS;
    const arr: { pos: [number, number, number]; rot: [number, number, number]; scale: number; seed: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.sin(i * 137.5) * 0.04);
      const r = radius + Math.sin(i * 7.3) * 18 + Math.cos(i * 13.1) * 10;
      const y = Math.sin(i * 3.7) * 6 + Math.cos(i * 11.3) * 4;
      const s = 0.3 + Math.abs(Math.sin(i * 17.7)) * 1.4;
      arr.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [i * 1.1, i * 2.3, i * 0.7],
        scale: s,
        seed: i,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} rotation={rock.rot} scale={rock.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6B5B4F" flatShading roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function Bodies() {
  const ordered = useMemo(() => {
    const rank = { sun: 0, planet: 1, comet: 2, asteroid: 3, moon: 4, station: 5 } as const;
    return [...BODIES].sort((a, b) => rank[a.kind] - rank[b.kind]);
  }, []);
  return (
    <>
      {ordered.map((b) => (
        b.kind === "station" ? <StationBody key={b.id} body={b} /> : <Body key={b.id} body={b} />
      ))}
      <AsteroidBelt />
    </>
  );
}

