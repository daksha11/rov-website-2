{/*
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

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
*/}
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', // For absolute positioning of the heading
    }}>
      {/* Leftmost Corner Logo (rov-logo) */}
      <div style={{
        position: 'absolute',
        top: '20px', // Adjust as needed
        left: '20px', // Adjust as needed
      }}>
        <img 
          src="rov-logo.png" 
          alt="ROV Logo" 
          style={{ width: '100px', height: 'auto' }} // Adjust size as needed
        />
      </div>
      {/* Centered Image */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
        <img 
          src="rov-colour.png" 
          alt="ROV" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </div>

      {/* Rightmost Corner Heading */}
      <div style={{
        position: 'absolute',
        top: '20px', // Adjust as needed
        right: '20px', // Adjust as needed
        textAlign: 'right',
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
          CREATIVE<br />STUDIO
        </div>
      </div>

      {/* Text at the Left */}
      <div style={{
        position: 'absolute',
        bottom: '20px', // Adjust as needed
        left: '20px', // Adjust as needed
        fontSize: '1.2rem',
      }}>
        Creation, production & promotion of artists. In Atlanta. And everywhere.
      </div>
    </div>
  );
};

export default Hero;