'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const springConfig = { damping: 20, stiffness: 400, mass: 0.5 };

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derived values for spotlight (offset by -250) and cursor (offset by -16)
  const spotlightX = useTransform(smoothX, v => v - 250);
  const spotlightY = useTransform(smoothY, v => v - 250);
  const cursorX = useTransform(smoothX, v => v - 16);
  const cursorY = useTransform(smoothY, v => v - 16);

  const rafRef = useRef<number | null>(null);

  // Check if the device is mobile (screen width ≤ 768px)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Update cursor position on mouse move, throttled to one update per frame
  useEffect(() => {
    if (isMobile) return;

    const updateCursor = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isMobile, mouseX, mouseY]);

  // Hide/show cursor when hovering over an iframe
  useEffect(() => {
    if (isMobile) return;

    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);

    iframe.addEventListener('mouseenter', hide);
    iframe.addEventListener('mouseleave', show);

    return () => {
      iframe.removeEventListener('mouseenter', hide);
      iframe.removeEventListener('mouseleave', show);
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Spotlight effect */}
      <motion.div
        className="spotlight fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          x: spotlightX,
          y: spotlightY,
          background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 70%
          )`,
          filter: 'blur(50px)',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Custom cursor circle */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white z-50 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
