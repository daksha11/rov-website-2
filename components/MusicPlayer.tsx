"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import DecryptedText from "./DecryptedText";

export default function MusicPlayer() {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-zinc-900 relative"
      id="music"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "150px 150px",
      }}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {/* Overlay to darken the grid lines */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      <motion.h2
        className="text-4xl font-bold mb-12 text-center relative z-10"
        variants={sectionVariants}
      >
        <DecryptedText text="FEATURED TRACKS" className="text-white" />
      </motion.h2>

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        variants={sectionVariants}
      >
        <iframe
          src="https://open.spotify.com/embed/playlist/6itkDdZEJw54d6ppIlXjgg?utm_source=generator&theme=0"
          width="100%"
          height="500"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        />
      </motion.div>
    </motion.section>
  );
}
