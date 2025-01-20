'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true); // State to control cursor visibility

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  // Function to hide the cursor
  const hideCursor = () => setIsVisible(false);
  // Function to show the cursor
  const showCursor = () => setIsVisible(true);

  // Attach event listeners to the playlist iframe
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('mouseenter', hideCursor);
      iframe.addEventListener('mouseleave', showCursor);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('mouseenter', hideCursor);
        iframe.removeEventListener('mouseleave', showCursor);
      }
    };
  }, []);

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
      
      {/* Cursor circle */}
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