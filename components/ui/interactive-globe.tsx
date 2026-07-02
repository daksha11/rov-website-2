"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";
import { coastlinePolygons, isPointOnLand } from "@/data/continent-coastlines";

// --- Public types ---

export interface GlobeTeamMember {
  name: string;
  role: string;
}

export interface GlobeLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
  type: "hq" | "team" | "business";
  members?: GlobeTeamMember[];
}

interface GlobeProps {
  className?: string;
  autoRotateSpeed?: number;
  locations?: GlobeLocation[];
  focusedLocation?: { lat: number; lng: number } | null;
  onInteract?: () => void;
  onLocationClick?: (loc: GlobeLocation) => void;
  // Legacy props (used if locations is not provided)
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

// --- Colors ---

const COLORS = {
  hqMarker: "#C4622D",
  hqGlow: "rgba(196, 98, 45, 0.45)",
  teamMarker: "#F5EDD8",
  teamGlow: "rgba(245, 237, 216, 0.3)",
  businessMarker: "rgba(224, 164, 74, 0.9)",
  businessGlow: "rgba(224, 164, 74, 0.2)",
  landDot: "rgba(196, 98, 45, ALPHA)",
  oceanDot: "rgba(107, 35, 24, ALPHA)",
  coastline: "rgba(196, 98, 45, 0.32)",
  arcWarm: "#C4622D",
  arcTeal: "rgba(224, 164, 74, 0.45)",
  particleWarm: "#C4622D",
  particleTeal: "rgba(224, 164, 74, 1)",
  globeOutline: "rgba(196, 98, 45, 0.22)",
  outerGlow: "rgba(196, 98, 45, 0.07)",
  tooltipBg: "rgba(28, 18, 8, 0.95)",
  tooltipText: "#F5EDD8",
  tooltipSubtext: "rgba(245, 237, 216, 0.6)",
  tooltipAccent: "#C4622D",
};

// --- Math helpers ---

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    -radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

// Convert unit Fibonacci sphere point back to lat/lng
function xyzToLatLng(x: number, y: number, z: number): [number, number] {
  const lat = 90 - (Math.acos(y) * 180) / Math.PI;
  const lng = ((Math.atan2(z, -x) * 180) / Math.PI) - 180;
  return [lat, lng > 180 ? lng - 360 : lng < -180 ? lng + 360 : lng];
}

// Generate Fibonacci sphere points
function generateFibonacciSphere(count: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    points.push([
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi),
    ]);
  }
  return points;
}

// --- Component ---

export function Component({
  className,
  autoRotateSpeed = 0.002,
  locations,
  focusedLocation,
  onInteract,
  onLocationClick,
  dotColor = "rgba(78, 205, 196, ALPHA)",
  arcColor = "rgba(45, 212, 191, 0.5)",
  markerColor = "rgba(78, 205, 196, 1)",
  connections: legacyConnections,
  markers: legacyMarkers,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(0.4);
  const rotXRef = useRef(0.3);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startRotY: number;
    startRotX: number;
  }>({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const hoveredRef = useRef<GlobeLocation | null>(null);
  const pointerOverRef = useRef(false);
  const targetRotYRef = useRef<number | null>(null);
  // Latest projected screen positions of visible markers, for click hit-testing.
  const markerPositionsRef = useRef<{ loc: GlobeLocation; sx: number; sy: number }[]>([]);
  // Whether the current pointer gesture moved far enough to count as a drag (vs a click).
  const draggedRef = useRef(false);

  // Pre-computed dot arrays
  const oceanDotsRef = useRef<[number, number, number][]>([]);
  const landDotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
    // Ocean grid — all Fibonacci points, rendered dim
    oceanDotsRef.current = generateFibonacciSphere(1200);

    // Land dots — denser sampling, filtered to land only
    const candidates = generateFibonacciSphere(3500);
    const land: [number, number, number][] = [];
    for (const pt of candidates) {
      const [lat, lng] = xyzToLatLng(pt[0], pt[1], pt[2]);
      if (isPointOnLand(lat, lng)) {
        land.push(pt);
      }
    }
    landDotsRef.current = land;
  }, []);

  // Derive connections from locations
  const derivedConnections = useRef<{ from: GlobeLocation; to: GlobeLocation; isTeam: boolean }[]>([]);
  useEffect(() => {
    if (!locations) return;
    const hq = locations.find((l) => l.type === "hq");
    if (!hq) return;
    derivedConnections.current = locations
      .filter((l) => l.type !== "hq")
      .map((l) => ({ from: hq, to: l, isTeam: l.type === "team" }));
  }, [locations]);

  // Snap to a focused location by computing the target rotY
  useEffect(() => {
    if (!focusedLocation) {
      targetRotYRef.current = null;
      return;
    }
    const { lat, lng } = focusedLocation;
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    const x0 = -(Math.sin(phi) * Math.cos(theta));
    const y0 = -Math.cos(phi);
    const z0 = Math.sin(phi) * Math.sin(theta);
    const rx = rotXRef.current;
    const x1 = x0;
    const z1 = y0 * Math.sin(rx) + z0 * Math.cos(rx);
    let targetRy = Math.atan2(-x1, z1) + Math.PI;
    // Normalise to nearest equivalent (shortest arc from current rotation)
    const current = rotYRef.current;
    while (targetRy - current > Math.PI) targetRy -= 2 * Math.PI;
    while (targetRy - current < -Math.PI) targetRy += 2 * Math.PI;
    targetRotYRef.current = targetRy;
  }, [focusedLocation]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Guard: skip frame if canvas has no dimensions (not yet laid out)
    if (w === 0 || h === 0) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov = 600;

    // Rotation. A focus target always animates (even while hovering) so a
    // clicked marker glides front-and-center; free auto-spin only runs when the
    // pointer isn't over the globe. Drag suspends both.
    if (!dragRef.current.active) {
      if (targetRotYRef.current !== null) {
        // Lerp toward focused city — shortest arc
        let diff = targetRotYRef.current - rotYRef.current;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        rotYRef.current += diff * 0.055;
      } else if (!pointerOverRef.current) {
        // Correct west-to-east spin: decreasing rotY brings eastern locations into view from right
        rotYRef.current -= autoRotateSpeed;
      }
    }

    timeRef.current += 0.015;
    const time = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    // --- Outer glow (warm terracotta tint) ---
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.5);
    glowGrad.addColorStop(0, COLORS.outerGlow);
    glowGrad.addColorStop(1, "rgba(196, 98, 45, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // --- Globe outline ---
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.globeOutline;
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Ocean dots (very dim) ---
    const oceanDots = oceanDotsRef.current;
    for (let i = 0; i < oceanDots.length; i++) {
      let [x, y, z] = oceanDots[i];
      x *= radius; y *= radius; z *= radius;
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.02, (1 - (z + radius) / (2 * radius)) * 0.08);
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.oceanDot.replace("ALPHA", depthAlpha.toFixed(3));
      ctx.fill();
    }

    // --- Land dots (bright, continent-shaped) ---
    const landDots = landDotsRef.current;
    for (let i = 0; i < landDots.length; i++) {
      let [x, y, z] = landDots[i];
      x *= radius; y *= radius; z *= radius;
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.15, 1 - (z + radius) / (2 * radius));
      const alpha = depthAlpha * 0.72;
      const dotSize = 1 + depthAlpha * 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.landDot.replace("ALPHA", alpha.toFixed(3));
      ctx.fill();
    }

    // --- Coastline polylines ---
    ctx.strokeStyle = COLORS.coastline;
    ctx.lineWidth = 0.6;
    for (const polygon of coastlinePolygons) {
      ctx.beginPath();
      let started = false;
      let prevVisible = false;
      for (let i = 0; i < polygon.length; i++) {
        let [x, y, z] = latLngToXYZ(polygon[i][0], polygon[i][1], radius);
        [x, y, z] = rotateX(x, y, z, rx);
        [x, y, z] = rotateY(x, y, z, ry);
        const visible = z <= 0;
        const [sx, sy] = project(x, y, z, cx, cy, fov);
        if (visible) {
          if (!started || !prevVisible) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        prevVisible = visible;
      }
      ctx.stroke();
    }

    // --- Use new locations system or legacy ---
    if (locations) {
      drawLocationsSystem(ctx, locations, derivedConnections.current, cx, cy, radius, fov, rx, ry, time);
      // Signal clickability: pointer over a marker → pointer cursor.
      if (!dragRef.current.active) {
        canvas.style.cursor = hoveredRef.current ? "pointer" : "grab";
      }
    } else {
      drawLegacySystem(ctx, legacyMarkers || [], legacyConnections || [], cx, cy, radius, fov, rx, ry, time, dotColor, arcColor, markerColor);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [autoRotateSpeed, locations, legacyMarkers, legacyConnections, dotColor, arcColor, markerColor]);

  // --- New locations drawing system ---
  function drawLocationsSystem(
    ctx: CanvasRenderingContext2D,
    locs: GlobeLocation[],
    conns: { from: GlobeLocation; to: GlobeLocation; isTeam: boolean }[],
    cx: number, cy: number, radius: number, fov: number,
    rx: number, ry: number, time: number,
  ) {
    // Draw arcs
    for (const conn of conns) {
      let [x1, y1, z1] = latLngToXYZ(conn.from.lat, conn.from.lng, radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to.lat, conn.to.lng, radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);

      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      // Elevated midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
      const arcHeight = radius * 1.25;
      const elevX = (midX / midLen) * arcHeight;
      const elevY = (midY / midLen) * arcHeight;
      const elevZ = (midZ / midLen) * arcHeight;
      const [scx, scy] = project(elevX, elevY, elevZ, cx, cy, fov);

      // Arc stroke — warm for team, teal for business
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      if (conn.isTeam) {
        ctx.strokeStyle = "rgba(196, 98, 45, 0.55)";
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = COLORS.arcTeal;
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // Multiple traveling particles
      const particleColor = conn.isTeam ? COLORS.particleWarm : COLORS.particleTeal;
      const phaseOffset = conn.from.lat * 0.1;
      for (let p = 0; p < 3; p++) {
        const t = ((time * 0.8 + phaseOffset + p * 2.1) % 6.28) / 6.28;
        const px = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
        const py = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
        const particleSize = 1.5 + Math.sin(t * Math.PI) * 1;
        const particleAlpha = 0.3 + Math.sin(t * Math.PI) * 0.7;
        ctx.beginPath();
        ctx.arc(px, py, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace("1)", `${particleAlpha.toFixed(2)})`).replace("0.35)", `${(particleAlpha * 0.8).toFixed(2)})`);
        ctx.fill();
      }
    }

    // Draw markers with hover detection
    let newHovered: GlobeLocation | null = null;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Collect visible markers for drawing order (business first, then team, then HQ on top)
    const sortedLocs = [...locs].sort((a, b) => {
      const order = { business: 0, team: 1, hq: 2 };
      return order[a.type] - order[b.type];
    });

    const markerPositions: { loc: GlobeLocation; sx: number; sy: number }[] = [];

    for (const loc of sortedLocs) {
      let [x, y, z] = latLngToXYZ(loc.lat, loc.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      markerPositions.push({ loc, sx, sy });

      // Hover detection
      const dist = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);
      if (dist < 25) newHovered = loc;

      const pulse = Math.sin(time * 2 + loc.lat) * 0.5 + 0.5;

      if (loc.type === "hq") {
        // HQ: large terracotta marker with double pulse + radial glow
        const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 22 + pulse * 10);
        glowGrad.addColorStop(0, "rgba(196, 98, 45, 0.45)");
        glowGrad.addColorStop(1, "rgba(196, 98, 45, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(sx - 30, sy - 30, 60, 60);

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(sx, sy, 9 + pulse * 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196, 98, 45, ${(0.2 + pulse * 0.2).toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner pulse ring
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196, 98, 45, ${(0.35 + pulse * 0.25).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.hqMarker;
        ctx.fill();

        // Label
        ctx.font = "bold 10px 'DM Mono', monospace";
        ctx.fillStyle = COLORS.hqMarker;
        ctx.fillText(`${loc.city} (HQ)`, sx + 10, sy + 3);

      } else if (loc.type === "team") {
        // Team: cream marker with single pulse ring
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 237, 216, ${(0.2 + pulse * 0.2).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.teamMarker;
        ctx.fill();

        // Label
        ctx.font = "10px 'DM Mono', monospace";
        ctx.fillStyle = "rgba(245, 237, 216, 0.8)";
        ctx.fillText(loc.city, sx + 8, sy + 3);

      } else {
        // Business: small brown dot with subtle glow
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 164, 74, ${(0.15 + pulse * 0.15).toFixed(2)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.businessMarker;
        ctx.fill();

        // Label
        ctx.font = "9px 'DM Mono', monospace";
        ctx.fillStyle = "rgba(224, 164, 74, 0.65)";
        ctx.fillText(loc.city, sx + 7, sy + 3);
      }
    }

    hoveredRef.current = newHovered;
    markerPositionsRef.current = markerPositions;

    // --- Tooltip ---
    if (newHovered) {
      const mp = markerPositions.find((m) => m.loc === newHovered);
      if (mp) {
        drawTooltip(ctx, mp.sx, mp.sy, newHovered, cx * 2, cy * 2);
      }
    }
  }

  function drawTooltip(
    ctx: CanvasRenderingContext2D,
    sx: number, sy: number,
    loc: GlobeLocation,
    canvasW: number, canvasH: number,
  ) {
    const padding = 12;
    const lineHeight = 16;
    const headerHeight = 22;

    const members = loc.members || [];
    const hasMembers = members.length > 0;
    const subtitleText = loc.type === "business" ? "Business Operations" : `${members.length} team member${members.length !== 1 ? "s" : ""}`;

    // Measure text widths
    ctx.font = "bold 12px 'DM Mono', monospace";
    const titleWidth = ctx.measureText(loc.city).width;
    ctx.font = "10px 'DM Mono', monospace";
    const subtitleWidth = ctx.measureText(subtitleText).width;

    let maxMemberWidth = 0;
    if (hasMembers) {
      ctx.font = "10px 'DM Mono', monospace";
      for (const m of members) {
        const w = ctx.measureText(`${m.name} — ${m.role}`).width;
        if (w > maxMemberWidth) maxMemberWidth = w;
      }
    }

    const contentWidth = Math.max(titleWidth, subtitleWidth, maxMemberWidth) + padding * 2;
    const contentHeight = headerHeight + (hasMembers ? 4 + members.length * lineHeight : 0) + padding * 2;

    // Position tooltip — flip if near edge
    let tx = sx + 16;
    let ty = sy - contentHeight / 2;
    if (tx + contentWidth > canvasW - 10) tx = sx - contentWidth - 16;
    if (ty < 10) ty = 10;
    if (ty + contentHeight > canvasH - 10) ty = canvasH - contentHeight - 10;

    // Background
    ctx.fillStyle = COLORS.tooltipBg;
    ctx.beginPath();
    const r = 8;
    ctx.moveTo(tx + r, ty);
    ctx.lineTo(tx + contentWidth - r, ty);
    ctx.quadraticCurveTo(tx + contentWidth, ty, tx + contentWidth, ty + r);
    ctx.lineTo(tx + contentWidth, ty + contentHeight - r);
    ctx.quadraticCurveTo(tx + contentWidth, ty + contentHeight, tx + contentWidth - r, ty + contentHeight);
    ctx.lineTo(tx + r, ty + contentHeight);
    ctx.quadraticCurveTo(tx, ty + contentHeight, tx, ty + contentHeight - r);
    ctx.lineTo(tx, ty + r);
    ctx.quadraticCurveTo(tx, ty, tx + r, ty);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = loc.type === "hq" ? "rgba(196, 98, 45, 0.45)" : loc.type === "team" ? "rgba(245, 237, 216, 0.2)" : "rgba(224, 164, 74, 0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // City name
    ctx.font = "bold 12px 'DM Mono', monospace";
    ctx.fillStyle = loc.type === "hq" ? COLORS.tooltipAccent : COLORS.tooltipText;
    ctx.fillText(loc.city, tx + padding, ty + padding + 12);

    // Subtitle
    ctx.font = "10px 'DM Mono', monospace";
    ctx.fillStyle = COLORS.tooltipSubtext;
    ctx.fillText(subtitleText, tx + padding, ty + padding + headerHeight + 2);

    // Members list
    if (hasMembers) {
      const startY = ty + padding + headerHeight + 8;
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        ctx.font = "10px 'DM Mono', monospace";
        // Name
        ctx.fillStyle = COLORS.tooltipText;
        const nameW = ctx.measureText(m.name).width;
        ctx.fillText(m.name, tx + padding, startY + i * lineHeight + 10);
        // Role
        ctx.fillStyle = COLORS.tooltipSubtext;
        ctx.fillText(` — ${m.role}`, tx + padding + nameW, startY + i * lineHeight + 10);
      }
    }
  }

  // --- Legacy drawing system (backward compat) ---
  function drawLegacySystem(
    ctx: CanvasRenderingContext2D,
    markers: { lat: number; lng: number; label?: string }[],
    connections: { from: [number, number]; to: [number, number] }[],
    cx: number, cy: number, radius: number, fov: number,
    rx: number, ry: number, time: number,
    dotCol: string, arcCol: string, markCol: string,
  ) {
    for (const conn of connections) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0], conn.to[1], radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2, midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
      const arcH = radius * 1.25;
      const [scx, scy] = project((midX / midLen) * arcH, (midY / midLen) * arcH, (midZ / midLen) * arcH, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcCol;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      const t = (Math.sin(time * 1.2 + conn.from[0] * 0.1) + 1) / 2;
      const tx = (1 - t) ** 2 * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty = (1 - t) ** 2 * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = markCol;
      ctx.fill();
    }
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = markCol.replace("1)", `${0.2 + pulse * 0.15})`);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markCol;
      ctx.fill();
      if (marker.label) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillStyle = markCol.replace("1)", "0.6)");
        ctx.fillText(marker.label, sx + 8, sy + 3);
      }
    }
  }

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // --- Pointer handlers ---
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Don't clear focus yet — a stationary press is a click (focus a marker),
    // only a real drag should release the focus and take manual control.
    draggedRef.current = false;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotY: rotYRef.current,
      startRotX: rotXRef.current,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    // Track mouse for hover tooltips
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    // Once the gesture crosses the drag threshold, it's a drag: release any
    // focus lerp and let the pointer steer the globe directly.
    if (!draggedRef.current && Math.hypot(dx, dy) > 5) {
      draggedRef.current = true;
      targetRotYRef.current = null;
      onInteract?.();
    }
    rotYRef.current = dragRef.current.startRotY + dx * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + dy * 0.005));
  }, [onInteract]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current.active = false;
    if (draggedRef.current) return; // a drag, not a click — nothing to select

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Hit-test the click against the nearest visible marker.
    let hit: GlobeLocation | null = null;
    let best = 22; // px radius
    for (const m of markerPositionsRef.current) {
      const d = Math.hypot(px - m.sx, py - m.sy);
      if (d < best) { best = d; hit = m.loc; }
    }

    if (hit) onLocationClick?.(hit);
    else onInteract?.(); // clicking empty space clears the focus
  }, [onLocationClick, onInteract]);

  const onPointerEnter = useCallback(() => {
    pointerOverRef.current = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    pointerOverRef.current = false;
    mouseRef.current = { x: -9999, y: -9999 };
    hoveredRef.current = null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("cursor-grab active:cursor-grabbing", className)}
      style={{ width: "100%", height: "100%" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
}
