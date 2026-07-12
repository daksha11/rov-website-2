"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface Props {
  children: ReactNode;
  index?: number;          // future use ke liye
  disableSticky?: boolean;
  isBook?: boolean;
}

export default function OverlapSection({
  children,
  disableSticky = false,
  isBook = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  const { scrollYProgress } = useScroll();

  // For string-based transforms (percentages)
  const rawY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", isBook ? "-10%" : "0%"]
  );

  // For spring animation
  const rawProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isBook ? -10 : 0]
  );

  const smoothProgress: MotionValue<number> = useSpring(rawProgress, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY: MotionValue<string> = useTransform(
    smoothProgress,
    (value) => `${value}%`
  );

  // Calculate dynamic sticky offset for tall content
  useEffect(() => {
    if (disableSticky) return;

    const updateOffset = () => {
      if (sectionRef.current && typeof window !== 'undefined') {
        const height = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        // If content is taller than viewport, scroll until bottom applies
        // e.g. Height 1200, Window 800 -> Offset -400.
        // If content is shorter (500), Window 800 -> Offset 0 (stick to top)
        const offset = Math.min(0, windowHeight - height);
        setTopOffset(offset);
      }
    };

    updateOffset();

    // Observer for content resizing
    const resizeObserver = new ResizeObserver(updateOffset);
    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }

    // Listener for window resizing
    window.addEventListener('resize', updateOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, [disableSticky, children]);

  const finalY = disableSticky ? "0%" : smoothY;

  return (
    <motion.section
      ref={sectionRef}
      style={{
        y: finalY,
        top: disableSticky ? undefined : topOffset
      }}
      className={`${disableSticky ? "" : "sticky"} w-full z-[100]`}
    >
      <div className="w-full">{children}</div>
    </motion.section>
  );
}