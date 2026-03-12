"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function WhatMakesUsDifferent() {
  return (
    <section className="relative rounded-t-[50px] -mt-[27px] w-full h-auto  flex items-start justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/background/hustlebg.webp"
          alt="Background"
          fill
          className="object-cover rounded-t-[50px]"
          priority
        />
           {/* 🔥 Dark Overlay */}
        <div className="absolute inset-0 bg-black/25 rounded-t-[50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-2/3   relative flex flex-col gap-4 md:py-24 py-16">
          <h2
            style={{ fontFamily: "sink" }}
            className="text-5xl  md:text-8xl  text-[#f3f0e7] transform skew-x-3 md:skew-x-6 rotate-1 md:rotate-3 drop-shadow-[3px_3px_2px_rgba(0,0,0,0.6)] relative"
          >
            What Makes Us
            {/* Decorative Wedges - hide on mobile */}
            <div className="hidden md:flex absolute -top-8 left-[520px] flex-row-reverse gap-2 rotate-45 animate-[float_3s_ease-in-out_infinite]">
              <span className="w-4 sm:w-6 h-12 sm:h-18 bg-[#c7c7c7] rotate-[20deg] [clip-path:polygon(0%_0%,100%_0%,70%_100%,30%_100%)]"></span>
              <span className="w-4 sm:w-6 h-12 sm:h-18 bg-[#c7c7c7] rotate-6 [clip-path:polygon(0%_0%,100%_0%,70%_100%,30%_100%)]"></span>
              <span className="w-4 sm:w-6 h-12 sm:h-18 bg-[#c7c7c7] rotate-[-12deg] [clip-path:polygon(0%_0%,100%_0%,70%_100%,30%_100%)]"></span>
            </div>
          </h2>

          <h3
          
            className="text-4xl md:text-8xl font-bold text-[#70695a] transform skew-x-2 md:skew-x-6 rotate-1 md:rotate-4 tracking-wide md:tracking-widest relative"
            style={{
              WebkitTextStroke: "1px #f3f0e7",
              WebkitTextFillColor: "#70695a",
            }}
          >
            <TypeAnimation
              sequence={["DIFFERENT?", 2000, "", 500]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{ display: "inline-block" }}
            />
          </h3>
        </div>

        {/* Right Side - Logo Image */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-end items-start pt-5">
  <motion.div
    className="relative w-48 sm:w-56 md:w-70 flex flex-col items-center"
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    viewport={{ once: false }}
  >
    <div className="relative w-full h-24 sm:h-28 md:h-32">
      <Image
        src="/assets/images/diffImg.webp"
        alt="ROV Studios brand identity architecture"
        fill
        className="object-cover"
      />
    </div>

    {/* 👇 Image ke niche text */}
    <p className=" text-center text-sm md:text-base font-semibold text-[#f3f0e7]">
      Brand Identity Architecture
    </p>
  </motion.div>
</div>

      </div>
    </section>
  );
}