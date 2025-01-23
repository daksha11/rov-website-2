import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-a-concert-venue-with-purple-lights-2683/1080p.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

      {/* Content with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-8 text-center text-white"
        >
          RANGE OF VIEW
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.5 }}
          className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          <Play className="w-5 h-5" />
          <span>Latest Release</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
