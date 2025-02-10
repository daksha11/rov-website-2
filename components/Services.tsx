"use client";

import Image from "next/image";
import { Waves, Palette, Mail, Instagram, Linkedin } from "lucide-react";
import DecryptedText from "./DecryptedText";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const [modalOpen, setModalOpen] = useState(false);

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
      className="py-20 px-4 md:px-8 bg-black relative"
      id="services"
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {/* Title Section */}
      <div className="relative z-10 text-center">
        <motion.h2 className="text-4xl font-bold mb-16 text-white" variants={titleVariants}>
          <DecryptedText text="OUR SERVICES" className="text-white" />
        </motion.h2>
      </div>

      <motion.div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 relative z-10" variants={sectionVariants}>
        {/* Mixing & Mastering Service */}
        <div className="group relative overflow-hidden rounded-2xl">
          <div className="aspect-square relative">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3"
              alt="Studio mixing console"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold">Mixing & Mastering</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your raw tracks into professional, radio-ready productions.
            </p>
            <button
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
              onClick={() => setModalOpen(true)}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Album Art Service */}
        <div className="group relative overflow-hidden rounded-2xl">
          <div className="aspect-square relative">
            <Image
              src="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?ixlib=rb-4.0.3"
              alt="Album artwork design"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-8 h-8 text-teal-400" />
              <h3 className="text-2xl font-bold">Album Artwork</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Make a visual impact with stunning album artwork.
            </p>
            <button
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors"
              onClick={() => setModalOpen(true)}
            >
              Learn More
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-black text-white p-8 rounded-lg shadow-lg text-center w-96 relative border border-gray-700">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={() => setModalOpen(false)}>
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:rangeofviewmusic@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Mail className="w-5 h-5 text-white" />
                Email
              </a>
              <a
                href="https://www.instagram.com/rangeofviewmusic/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/range-of-view-music/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Linkedin className="w-5 h-5 text-blue-500" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}