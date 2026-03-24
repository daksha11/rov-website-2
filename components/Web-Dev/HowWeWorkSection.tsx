"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HowWeWorkSection() {
  return (
    <section className="relative w-full rounded-t-[50px] -mt-[32px] md:h-screen h-auto md:py-0 py-16 flex items-center justify-center bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 rounded-t-[50px] overflow-hidden">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/assets/images/Untitled-3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center">

          {/* Top Text - HOW WE */}
          <motion.h2
            style={{ fontFamily: "anton" }}
            className="text-[#dcd7c8] mb-2 sm:mb-3 text-5xl sm:text-[80px] md:text-[115px] tracking-wide self-start"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            HOW WE
          </motion.h2>

          {/* Center Text - WORK */}
          <motion.h1
            style={{
              WebkitTextStroke: "1px #b0a48f",
              WebkitTextFillColor: "#dcd7c8",
              fontFamily: "pagaki",
            }}
            className="relative text-6xl mt-10 sm:text-[120px] md:text-[180px] font-black leading-none inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            {/* 🔥 Arrows (bilkul top-left) */}
            <div className="absolute -top-6 -left-12 flex flex-row gap-[4px] -rotate-245">
              <span className="w-3 sm:w-4 h-8 sm:h-10 bg-[#dcd7c8] rotate-[15deg] [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></span>
              <span className="w-3 sm:w-4 h-8 sm:h-10 bg-[#dcd7c8] rotate-[5deg]  [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></span>
              <span className="w-3 sm:w-4 h-8 sm:h-10 bg-[#dcd7c8] -rotate-[10deg] [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></span>
            </div>


            WORK
          </motion.h1>


          {/* Bottom Text - WITH YOU */}
          <motion.h2
            style={{ fontFamily: "anton" }}
            className="text-[#dcd7c8] -m-[3%] text-5xl sm:text-[80px] md:text-[115px] tracking-wide self-end"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            WITH YOU
          </motion.h2>
        </div>
      </div>

      {/* Left bottom mic - show only md+ */}
      <motion.div
        className="hidden md:block absolute bottom-10 left-0 w-72 h-80 opacity-90"
        initial={{ opacity: 1 }}
        animate={{ x: [0, -20, 0], opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/assets/images/mic.webp"
          alt="Microphone illustration representing ROV Studios creative process"
          fill
          className="object-cover object-top"
        />
      </motion.div>


      {/* Right Arrow - show only md+ */}
      <motion.div
        className="hidden md:block absolute top-8 right-0 w-52 h-48 opacity-90"
        initial={{ opacity: 1 }}
        animate={{ x: [0, -20, 0], opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/assets/images/arrow.webp"
          alt=""
          fill
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}