"use client";

import { Music } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function DesignBreak() {
  const [text, setText] = useState("ఇచ్చిపడేద్దాం");

  const handleMouseEnter = () => {
    setText(prevText => 
      prevText === "ఇచ్చిపడేద్దాం" ? "Ichipadedham" : "ఇచ్చిపడేద్దాం"
    );
  };

  return (
    <div className="w-full h-auto bg-black text-white flex flex-col items-center justify-center px-1 sm:px-4 overflow-hidden py-2 sm:py-8">
      <header className="w-full border-y border-white/20 flex flex-col">
        {/* Top row */}
        <div className="grid grid-cols-12 border-b border-white/20 w-full">
          {/* Range Of View Collective */}
          <div className="col-span-5 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full">
            <div className="rounded-full border border-white/40 px-2 sm:px-6 py-1 sm:py-2">
              <h1 className="text-[10px] sm:text-xl font-light tracking-wider text-center">
                Range Of
                <br />
                View Collective
              </h1>
            </div>
          </div>

          {/* Logo */}
          <div className="col-span-3 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full">
            <div className="bg-[#B84835] p-1.5 sm:p-4 rounded-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <HandIcon className="w-4 sm:w-12 h-4 sm:h-12 text-black" />
              </motion.div>
            </div>
          </div>

          {/* Music Notes */}
          <div className="col-span-4 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full">
            <div className="flex space-x-0.5 sm:space-x-2">
              {[...Array(8)].map((_, i) => (
                <Music 
                  key={i} 
                  className="w-2 sm:w-5 h-2 sm:h-5 text-white"
                  style={{
                    transform: `translateY(${i % 2 ? '2px' : '-2px'})`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-12 w-full">
          {/* Telugu Text */}
          <div
            className="col-span-4 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full"
            onMouseEnter={handleMouseEnter}
          >
            <h2 className="text-sm sm:text-2xl font-telugu">{text}</h2>
          </div>

          {/* Middle section */}
          <div className="col-span-5 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[8px] sm:text-base text-white/70 text-center"
            >
              replace with other fluttering graphic
            </motion.div>
          </div>

          {/* Since 2021 with Hand Icon */}
          <div className="col-span-3 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center gap-1 sm:gap-3 w-full">
            <h2 className="text-[10px] sm:text-xl font-light tracking-wider">Since 2021</h2>
            <div className="relative w-3 sm:w-8 h-3 sm:h-8">
              <HandIcon className="w-full h-full text-[#D2B48C]" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// Custom Hand Icon component
const HandIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 16V4H4v12h16m0-14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16M8 7h3v6H8V7m5 0h3v6h-3V7Z" />
  </svg>
);