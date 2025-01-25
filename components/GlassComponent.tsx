"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import DecryptedText from "@/components/DecryptedText"; // Ensure this import is correct

// Variants for animations
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function GlassBack() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image scoped to this component */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/GlassBackground.jpg')" }} // Replace with your image path
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-8">
        <div
          className="glass-panel w-full max-w-5xl aspect-[16/9] rounded-[2rem] p-16 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex h-full gap-8"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Album Cover */}
            <motion.div className="flex-1" variants={sectionVariants}>
              <Image
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3"
                alt="Album Cover"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>

            {/* Album Details */}
            <motion.div className="flex-1 space-y-6" variants={sectionVariants}>
              <motion.h2
                className="text-4xl font-bold"
                variants={titleVariants}
              >
                <DecryptedText
                  text="NEW ALBUM OUT NOW"
                  className="text-white"
                />
              </motion.h2>
              <h3 className="text-2xl text-gray-400">Echoes of Tomorrow</h3>
              <p className="text-gray-300">
                Experience our latest album, a journey through sound and emotion.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition">
                  LISTEN NOW
                </button>
                <button className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition">
                  STORE
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced glass reflections */}
          <div className="absolute inset-0 pointer-events-none rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <div
              className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)] transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Glass effect styles
const styles = `
  .glass-panel {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(40px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .glass-panel:hover {
    background: rgba(0, 0, 0, 0.45);
    box-shadow: 
      0 30px 60px -15px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.15),
      inset 0 0 35px rgba(0, 0, 0, 0.3);
    transform: scale(1.005);
  }

  .glass-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 20%,
      transparent 80%
    );
    border-radius: inherit;
    pointer-events: none;
  }
`;

// Inject styles into the document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}