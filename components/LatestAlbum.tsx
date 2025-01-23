"use client";

import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  className?: string; // Applied to the text
  parentClassName?: string; // Applied to the top-level span container
}

function DecryptedText({
  text,
  className = "text-white",
  parentClassName = "",
  ...props
}: DecryptedTextProps) {
  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap relative ${parentClassName}`}
      {...props}
    >
      <span className={className}>{text}</span>
    </motion.span>
  );
}

export default function LatestAlbum() {
  const ref = useRef<HTMLDivElement>(null);
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

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.5 },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 md:px-8 bg-zinc-900"
      id="store"
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <motion.div
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
        variants={sectionVariants}
      >
        {/* Album Cover */}
        <motion.div className="flex-1" variants={sectionVariants}>
          <Image
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3"
            alt="Album Cover"
            width={500}
            height={500}
            className="w-full"
          />
        </motion.div>

        {/* Album Details */}
        <motion.div className="flex-1 space-y-6" variants={sectionVariants}>
          <motion.h2
            className="text-4xl font-bold"
            variants={titleVariants}
          >
            <DecryptedText text="NEW ALBUM OUT NOW" className="text-white" />
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
    </motion.section>
  );
}