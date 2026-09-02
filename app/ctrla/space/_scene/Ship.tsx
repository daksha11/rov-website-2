"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE SHIP
//
// Flight model, chase camera, docking, landing dive, FPS meter. Deliberately
// no physics engine: a ship in empty space is thrust, damping, and a
// heading. Flight is planar (the ecliptic), which is what makes it
// navigable instead of nauseating, and the camera lag + FOV stretch is what
// makes it feel fast.
//
// The parking problem is solved in three layers:
//   envelope   inside 4× dock range the speed cap falls with distance, so
//              the ship settles toward a body instead of overshooting it
//   magnetic   sit still inside the ring for a second and it docks itself;
//              E docks now, W waves off
//   no-clip    bodies push the ship out; you cannot fly through the sun
//
// Everything per-frame lives in refs. React only hears about it when the
// near/docked body changes.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BODIES, bodyById, restPosition, type CelestialBody } from "../_map/map";
import { FLIGHT, dockRange } from "../_map/flight";
import { frame, useSpace } from "../_state/useSpace";

export { dockRange };

const { ACCEL, ACCEL_BOOST, MAX_SPEED, MAX_SPEED_BOOST, WORLD_RADIUS } = FLIGHT;
const TURN_SLOW = 2.8; // rad/s when parked
const TURN_FAST = 1.6; // rad/s at full boost
const ENVELOPE = 4; // × dock range
const PARK_SPEED = 8; // cap at the ring
const MAGNET_SPEED = 6; // must be under this to start the fill
const MAGNET_TIME = 1.0; // seconds inside the ring before auto-dock

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Spawn beside a `?at=` stop, facing it, or at the default pad if none. */
function spawn(): { pos: THREE.Vector3; heading: number } {
  const fallback = { pos: new THREE.Vector3(0, 0, 44), heading: 0 };
  if (typeof window === "undefined") return fallback;
  const at = new URLSearchParams(window.location.search).get("at");
  const body = at ? bodyById(at) : null;
  if (!body) return fallback;
  const rest = restPosition(body.id);
  // Park just outside the dock ring, on the side away from the sun, so the
  // first thing in view is the stop and the sun is behind it. The sun sits
  // at the origin, so "away" is undefined there; park on +z like the pad.
  const len = Math.hypot(rest.x, rest.z);
  const out = dockRange(body.size) + 9;
  const ux = len > 1e-3 ? rest.x / len : 0;
  const uz = len > 1e-3 ? rest.z / len : 1;
  const pos = new THREE.Vector3(rest.x + ux * out, 0, rest.z + uz * out);
  const heading = Math.atan2(-(rest.x - pos.x), -(rest.z - pos.z));
  return { pos, heading };
}

export default function Ship() {
  const group = useRef<THREE.Group>(null);
  const engine = useRef<THREE.Sprite>(null);
  const { camera } = useThree();

  // ── frame state ──
  const start = useMemo(spawn, []);
  const pos = useRef(start.pos.clone());
  const vel = useRef(new THREE.Vector3());
  const heading = useRef(start.heading); // 0 faces -z, toward the sun from the pad
  const roll = useRef(0);
  const camRoll = useRef(0);
  const keys = useRef(new Set<string>());
  const fpsAcc = useRef({ frames: 0, t: 0 });
  const shake = useRef(0);
  const fill = useRef(0);
  const magnetArmed = useRef(true);
  const wasDocked = useRef(false);
  const parkAngle = useRef(0);
  const parkRadius = useRef(0);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Engine glow texture: a soft radial gold dot, drawn once.
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(227,194,74,1)");
    g.addColorStop(0.4, "rgba(227,194,74,0.55)");
    g.addColorStop(1, "rgba(227,194,74,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  // Put the camera on the ship before the first frame so a deep-link spawn
  // does not swoop in from the default pad.
  useEffect(() => {
    fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));
    camera.position.copy(pos.current).addScaledVector(fwd, -19).setY(9.5);
    lookTarget.copy(pos.current).addScaledVector(fwd, 11);
    camera.lookAt(lookTarget);
    frame.shipPosition.x = pos.current.x;
    frame.shipPosition.z = pos.current.z;
    frame.shipHeading = heading.current;
  }, [camera, fwd, lookTarget]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      // Any flight input hands control back from the autopilot.
      if (["w", "a", "s", "d", " ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        if (useSpace.getState().autopilotId) {
          useSpace.getState().setAutopilot(null);
          frame.tookOver = true;
        }
        if (k.startsWith("arrow") || k === " ") e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05); // never let a hitch teleport the ship
    const g = group.current;
    if (!g) return;
    const state = useSpace.getState();
    const k = keys.current;
    const docked = !!state.dockedId;
    const landing = state.landingId ? frame.bodyPositions.get(state.landingId) : null;

    // ── nearest body, once, for the envelope, the ring, and no-clip ──
    let nearest: CelestialBody | null = null;
    let nearestD = Infinity;
    for (const b of BODIES) {
      const p = frame.bodyPositions.get(b.id);
      if (!p) continue;
      const d = Math.hypot(p.x - pos.current.x, p.z - pos.current.z);
      if (d < nearestD) {
        nearestD = d;
        nearest = b;
      }
    }

    // ── input ──
    let thrust = k.has("w") || k.has("arrowup") ? 1 : 0;
    const brake = k.has("s") || k.has("arrowdown") || k.has(" ");
    let yaw = (k.has("a") || k.has("arrowleft") ? 1 : 0) - (k.has("d") || k.has("arrowright") ? 1 : 0);
    let boost = k.has("shift");
    const manualYaw = yaw !== 0;

    // ── autopilot: steer toward the target, dock on arrival ──
    const ap = state.autopilotId;
    if (ap && !docked) {
      const target = frame.bodyPositions.get(ap);
      const body = bodyById(ap);
      if (target && body) {
        const dx = target.x - pos.current.x;
        const dz = target.z - pos.current.z;
        const dist = Math.hypot(dx, dz);
        const want = Math.atan2(-dx, -dz);
        const diff = wrapAngle(want - heading.current);
        yaw = THREE.MathUtils.clamp(diff * 3, -1, 1);
        // Thrust only when roughly facing the target; the envelope does the
        // braking on approach.
        thrust = Math.abs(diff) < 0.5 ? THREE.MathUtils.clamp((dist - dockRange(body.size)) / 40, 0.15, 1) : 0;
        boost = false;
        if (dist < dockRange(body.size) * 0.95) {
          vel.current.set(0, 0, 0);
          state.dock(ap);
        }
      } else {
        state.setAutopilot(null);
      }
    }

    // ── fly-by-wire: holding W with no turn input eases toward the waypoint ──
    const wp = state.route[state.step] ?? null;
    if (!ap && !docked && thrust > 0 && !manualYaw && wp) {
      const target = frame.bodyPositions.get(wp);
      if (target) {
        const want = Math.atan2(-(target.x - pos.current.x), -(target.z - pos.current.z));
        const diff = wrapAngle(want - heading.current);
        yaw = THREE.MathUtils.clamp(diff * 1.5, -1, 1) * 0.3;
      }
    }

    // ── approach envelope: the speed cap falls as a body gets close ──
    // Only while closing on it. Leaving a planet (or the spawn pad next to
    // the sun) is never throttled, or the first thing a pilot feels is mud.
    let cap: number = boost ? MAX_SPEED_BOOST : MAX_SPEED;
    let inEnvelope = false;
    if (nearest && !docked) {
      const dr = dockRange(nearest.size);
      const env = dr * ENVELOPE;
      const np = frame.bodyPositions.get(nearest.id)!;
      const nx = (pos.current.x - np.x) / (nearestD || 1);
      const nz = (pos.current.z - np.z) / (nearestD || 1);
      const closing = -(vel.current.x * nx + vel.current.z * nz) > 0.5 || vel.current.lengthSq() < 1;
      if (nearestD < env && closing) {
        inEnvelope = true;
        const t = THREE.MathUtils.clamp((nearestD - dr) / (env - dr), 0, 1);
        cap = THREE.MathUtils.lerp(PARK_SPEED, MAX_SPEED, t * t);
        boost = false;
      }
    }
    frame.approachId = inEnvelope && nearest ? nearest.id : null;

    // ── flight model ──
    if (docked) {
      thrust = 0;
      yaw = 0;
    }
    const speedNow = vel.current.length();
    const turnRate = THREE.MathUtils.lerp(TURN_SLOW, TURN_FAST, speedNow / MAX_SPEED_BOOST);
    heading.current += yaw * turnRate * dt;
    fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));

    const boosting = boost && thrust > 0 && !docked;
    if (boosting) frame.boosted = true;
    const accel = boost ? ACCEL_BOOST : ACCEL;
    if (thrust > 0) vel.current.addScaledVector(fwd, accel * thrust * dt);
    // Coasting bleeds speed slowly; braking bleeds it fast.
    vel.current.multiplyScalar(Math.exp(-(brake ? 4.5 : 0.9) * dt));
    let speed = vel.current.length();
    if (speed > cap) {
      // Ease onto the cap rather than clamping, so the envelope feels like
      // drag, not a wall.
      const eased = THREE.MathUtils.lerp(speed, cap, 1 - Math.exp(-6 * dt));
      vel.current.multiplyScalar(eased / speed);
      speed = eased;
    }

    if (docked && state.dockedId) {
      // Parked orbit: circle the body slowly so the panel sits over a
      // moving planet, and hand control back cleanly on undock.
      const body = bodyById(state.dockedId)!;
      const p = frame.bodyPositions.get(state.dockedId)!;
      if (parkRadius.current === 0) {
        parkAngle.current = Math.atan2(pos.current.z - p.z, pos.current.x - p.x);
        parkRadius.current = Math.max(Math.hypot(pos.current.x - p.x, pos.current.z - p.z), body.size * 1.5);
      }
      parkAngle.current += dt * 0.22;
      parkRadius.current = THREE.MathUtils.lerp(parkRadius.current, dockRange(body.size) * 0.8, 1 - Math.exp(-1.5 * dt));
      pos.current.set(p.x + Math.cos(parkAngle.current) * parkRadius.current, 0, p.z + Math.sin(parkAngle.current) * parkRadius.current);
      // Face along the orbit.
      const wantHeading = -parkAngle.current;
      heading.current += wrapAngle(wantHeading - heading.current) * (1 - Math.exp(-3 * dt));
      fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));
      vel.current.set(0, 0, 0);
      speed = 0;
    } else {
      parkRadius.current = 0;
      pos.current.addScaledVector(vel.current, dt);
    }

    // ── no-clip: bodies push the ship out ──
    if (!docked) {
      for (const b of BODIES) {
        const p = frame.bodyPositions.get(b.id);
        if (!p) continue;
        const min = b.size * 1.35 + 1.2;
        const dx = pos.current.x - p.x;
        const dz = pos.current.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d < min && d > 1e-4) {
          const nx = dx / d;
          const nz = dz / d;
          pos.current.x = p.x + nx * min;
          pos.current.z = p.z + nz * min;
          const inward = vel.current.x * nx + vel.current.z * nz;
          if (inward < 0) {
            vel.current.x -= nx * inward * 1.4;
            vel.current.z -= nz * inward * 1.4;
          }
        }
      }
    }

    // Soft edge of the world: past the last orbit, space gently pushes back.
    const r = Math.hypot(pos.current.x, pos.current.z);
    if (r > WORLD_RADIUS) {
      frame.edged = true;
      const push = (r - WORLD_RADIUS) * 0.8;
      vel.current.x -= (pos.current.x / r) * push * dt;
      vel.current.z -= (pos.current.z / r) * push * dt;
    }

    // Bank into turns, and a touch more when fast.
    roll.current = THREE.MathUtils.lerp(roll.current, -yaw * (0.5 + (speed / MAX_SPEED_BOOST) * 0.25), 1 - Math.exp(-6 * dt));

    g.position.copy(pos.current);
    g.rotation.set(0, heading.current, roll.current);
    frame.shipPosition.x = pos.current.x;
    frame.shipPosition.y = pos.current.y;
    frame.shipPosition.z = pos.current.z;
    frame.shipSpeed = speed;
    frame.shipHeading = heading.current;

    if (engine.current) {
      const s = 1.2 + thrust * (boost ? 3.2 : 2.0) + speed / MAX_SPEED;
      engine.current.scale.set(s, s, 1);
    }

    // ── docking: the ring, and the magnetic fill ──
    if (wasDocked.current && !docked) magnetArmed.current = false; // just undocked: leave the ring first
    wasDocked.current = docked;
    if (!docked) {
      const inRing = nearest && nearestD < dockRange(nearest.size) ? nearest.id : null;
      state.setNear(inRing);
      if (!inRing) magnetArmed.current = true;
      if (inRing && magnetArmed.current && state.introSeen && speed < MAGNET_SPEED && thrust === 0 && !ap) {
        fill.current += dt / MAGNET_TIME;
        if (fill.current >= 1) {
          fill.current = 0;
          vel.current.set(0, 0, 0);
          state.dock(inRing);
        }
      } else {
        fill.current = Math.max(0, fill.current - dt * 3);
      }
    } else {
      fill.current = 0;
    }
    frame.dockFill = fill.current;

    // ── camera ──
    const cam = camera as THREE.PerspectiveCamera;
    let wantFov: number;
    if (landing && state.landingId) {
      // Landing dive: fall toward the body from wherever the camera is,
      // tightening the lens, until the HUD's colour wipe takes over.
      const body = bodyById(state.landingId)!;
      tmp.copy(camera.position).sub(landing).setY(0);
      if (tmp.lengthSq() < 1e-4) tmp.set(0, 0, 1);
      tmp.normalize();
      camTarget.copy(landing).addScaledVector(tmp, body.size * 2.2).setY(body.size * 0.9);
      camera.position.lerp(camTarget, 1 - Math.exp(-2.4 * dt));
      camera.lookAt(landing);
      wantFov = 36;
    } else {
      // Chase: lag behind, pull back and widen with speed.
      const speedNorm = speed / MAX_SPEED_BOOST;
      const dist = 19 + speedNorm * 9;
      const height = 9.5 + speedNorm * 3;
      camTarget.copy(pos.current).addScaledVector(fwd, -dist).setY(height);
      camera.position.lerp(camTarget, 1 - Math.exp(-4.5 * dt));
      // Boost shake: a small, fast wobble that rises with the boost and
      // settles as soon as Shift lifts.
      shake.current = THREE.MathUtils.lerp(shake.current, boosting ? 1 : 0, 1 - Math.exp(-(boosting ? 5 : 9) * dt));
      if (shake.current > 0.01) {
        const t = clock.elapsedTime;
        const a = shake.current * 0.16;
        camera.position.x += Math.sin(t * 41) * a;
        camera.position.y += Math.sin(t * 53 + 1.3) * a * 0.7;
      }
      lookTarget.copy(pos.current).addScaledVector(fwd, 11);
      // The camera rolls a beat behind the ship, so turns feel physical.
      camRoll.current = THREE.MathUtils.lerp(camRoll.current, roll.current * 0.35, 1 - Math.exp(-3.5 * dt));
      up.set(Math.sin(camRoll.current), Math.cos(camRoll.current), 0);
      camera.up.copy(up);
      camera.lookAt(lookTarget);
      wantFov = 55 + speedNorm * 17 + shake.current * 4;
    }
    if (Math.abs(cam.fov - wantFov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, wantFov, 1 - Math.exp(-3 * dt));
      cam.updateProjectionMatrix();
    }

    // ── fps meter, once a second ──
    fpsAcc.current.frames++;
    fpsAcc.current.t += rawDt;
    if (fpsAcc.current.t >= 1) {
      state.setFps(Math.round(fpsAcc.current.frames / fpsAcc.current.t));
      fpsAcc.current.frames = 0;
      fpsAcc.current.t = 0;
    }
  });

  return (
    <group ref={group}>
      {/* Hull: a low-poly dart, nose toward -z. Paper white like the helmet. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.15, 5.2, 6]} />
        <meshStandardMaterial color="#F0E6E0" flatShading roughness={0.6} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.55, -0.4]} scale={[0.55, 0.42, 0.9]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#24123A" roughness={0.25} metalness={0.4} />
      </mesh>
      {/* Wings, swept back, night with a gold edge */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.1, -0.15, 1.1]} rotation={[0, side * -0.35, side * 0.12]}>
          <mesh>
            <boxGeometry args={[2.6, 0.16, 1.4]} />
            <meshStandardMaterial color="#24123A" flatShading roughness={0.7} />
          </mesh>
          <mesh position={[side * 1.32, 0, 0]}>
            <boxGeometry args={[0.12, 0.2, 1.4]} />
            <meshStandardMaterial color="#E3C24A" emissive="#E3C24A" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      {/* Engine glow */}
      <sprite ref={engine} position={[0, 0, 2.9]}>
        <spriteMaterial map={glowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {/* A small local light so the hull reads even far from the sun. */}
      <pointLight position={[0, 2, 1]} intensity={0.6} distance={14} color="#E3C24A" />
    </group>
  );
}
