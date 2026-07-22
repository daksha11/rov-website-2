"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper — opacity 0→1, translateY(24px)→0, ~650ms ease-out
 * on entry (brand-kit motion pattern). Respects prefers-reduced-motion: when
 * the user prefers reduced motion, content renders visible with no transform.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  style,
  className,
  id,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "-60px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const motionStyle: React.CSSProperties = reduced
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 650ms ease-out ${delay}ms, transform 650ms ease-out ${delay}ms`,
      };

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{ ...motionStyle, ...style }}
    >
      {children}
    </Tag>
  );
}
