'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Track cursor position
  const [isVisible, setIsVisible] = useState(true); // Control cursor visibility
  const [isMobile, setIsMobile] = useState(false); // Track if the device is mobile

  // Check if the device is mobile (screen width ≤ 768px)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIsMobile();

    // Update on window resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Update cursor position on mouse move (only for desktop)
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', updateCursor);
    }

    return () => window.removeEventListener('mousemove', updateCursor);
  }, [isMobile]);

  // Hide/show cursor when hovering over an iframe (only for desktop)
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe && !isMobile) {
      iframe.addEventListener('mouseenter', () => setIsVisible(false));
      iframe.addEventListener('mouseleave', () => setIsVisible(true));
    }

    return () => {
      if (iframe && !isMobile) {
        iframe.removeEventListener('mouseenter', () => setIsVisible(false));
        iframe.removeEventListener('mouseleave', () => setIsVisible(true));
      }
    };
  }, [isMobile]);

  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Spotlight effect */}
      <motion.div
        className="spotlight fixed w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 70%
          )`,
          filter: 'blur(50px)',
          opacity: isVisible ? 1 : 0, // Hide spotlight when cursor is hidden
        }}
        animate={{
          x: position.x - 250, // Center the spotlight on the cursor
          y: position.y - 250, // Center the spotlight on the cursor
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 400,
          mass: 0.5,
        }}
      />

      {/* Custom cursor circle */}
      <motion.div
        className="custom-cursor fixed w-8 h-8 rounded-full border-2 border-white z-50 pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0, // Hide cursor when not visible
        }}
        animate={{
          x: position.x - 16, // Center the cursor circle on the mouse position
          y: position.y - 16, // Center the cursor circle on the mouse position
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 400,
          mass: 0.5,
        }}
      />
    </>
  );
}