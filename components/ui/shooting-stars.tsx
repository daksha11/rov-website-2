"use client";

import { useEffect, useRef } from "react";

/**
 * A real night-sky effect: a field of faint twinkling stars plus sporadic
 * shooting stars that dash across at random positions/angles and fade out.
 *
 * Canvas fills its parent (never a fixed pixel size): sized from the parent's
 * clientWidth/clientHeight, guards 0-dimension frames, canvas style stays 100%.
 * Pauses when scrolled off-screen; respects prefers-reduced-motion (the meteors
 * stop, the static starfield stays).
 */
export default function ShootingStars({
  className,
  style,
  colors = ["#E3C24A", "#F0E6E0", "#A56A67"],
  starColor = "#F0E6E0",
}: {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  /** Colour of the static twinkle field (use a dark value on light grounds). */
  starColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      container.removeChild(canvas);
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;

    // ── Static twinkling starfield ──
    type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number };
    let stars: Star[] = [];
    const buildStars = () => {
      const count = Math.round((W * H) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.5 + 0.18,
        tw: Math.random() * 1.6 + 0.4,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      if (W === 0 || H === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Shooting stars ──
    type Meteor = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      life: number;
      maxLife: number;
      color: string;
      width: number;
    };
    const meteors: Meteor[] = [];
    let nextSpawn = 0.4; // seconds until the next one

    const spawn = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = Math.random() * 320 + 420; // px/s — quick
      const angle = ((Math.random() * 16 + 20) * Math.PI) / 180; // 20–36° down
      const dirX = (fromLeft ? 1 : -1) * Math.cos(angle);
      const dirY = Math.sin(angle);
      const x = fromLeft ? Math.random() * W * 0.55 : W * 0.45 + Math.random() * W * 0.55;
      const y = Math.random() * H * 0.5;
      meteors.push({
        x,
        y,
        vx: dirX * speed,
        vy: dirY * speed,
        len: Math.random() * 90 + 80,
        life: 0,
        maxLife: Math.random() * 0.45 + 0.55, // 0.55–1.0s
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 1.1 + 1.1,
      });
    };

    // Pause when off-screen.
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { rootMargin: "120px" });
    io.observe(container);

    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || W === 0 || H === 0) {
        last = t;
        return;
      }
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      const time = t / 1000;

      ctx.clearRect(0, 0, W, H);

      // Twinkling field
      ctx.fillStyle = starColor;
      for (const s of stars) {
        const a = s.a * (0.55 + 0.45 * Math.sin(time * s.tw + s.ph));
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Meteors
      if (!reduce) {
        nextSpawn -= dt;
        if (nextSpawn <= 0) {
          spawn();
          if (Math.random() < 0.22) spawn(); // occasional pair
          nextSpawn = Math.random() * 1.7 + 0.5; // random gap, real-sky cadence
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const p = m.life / m.maxLife;
          if (p >= 1 || m.x < -160 || m.x > W + 160 || m.y > H + 160) {
            meteors.splice(i, 1);
            continue;
          }
          const alpha = Math.sin(Math.min(p, 1) * Math.PI); // streak in then fade out
          const inv = 1 / Math.hypot(m.vx, m.vy);
          const tailX = m.x - m.vx * inv * m.len;
          const tailY = m.y - m.vy * inv * m.len;
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, m.color);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = grad;
          ctx.lineWidth = m.width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          // bright head
          ctx.beginPath();
          ctx.fillStyle = m.color;
          ctx.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [colors, starColor]);

  return <div ref={containerRef} aria-hidden className={className} style={{ position: "absolute", inset: 0, ...style }} />;
}
