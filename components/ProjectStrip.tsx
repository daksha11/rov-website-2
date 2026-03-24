"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProjectStrip: React.FC = () => {
  return (
    <section
      className="w-full flex items-center justify-center relative"
      style={{ padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem)' }}
    >
      <div
        className="flex w-full max-w-full items-end justify-between rounded-[15px] border border-[#999288] relative z-10 overflow-hidden max-[968px]:flex-col max-[968px]:text-center max-[968px]:items-center"
        style={{
          padding: 'clamp(2.5rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3.75rem)',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          background: 'linear-gradient(111deg, #42201C -1.34%, #A64D2B 25.87%, #B16937 59.87%, #EA9A61 93.39%)',
          boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Left Section */}
        <div
          className="flex items-center flex-1 max-[968px]:flex-col"
          style={{ gap: 'clamp(1.25rem, 2.5vw, 2rem)' }}
        >
          <div
            className="bg-black rounded-full flex items-center justify-center shrink-0"
            style={{
              width: 'clamp(4.5rem, 7vw, 6rem)',
              height: 'clamp(4.5rem, 7vw, 6rem)',
            }}
          >
            <Image src="/rov-logo.webp" alt="ROV Logo" width={60} height={60} className="w-[60%] h-auto" />
          </div>
          <div className="flex flex-col gap-1.5 max-[968px]:items-center">
            <h2
              className="font-bold leading-tight text-white m-0"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontFamily: "Norwige, sans-serif",
              }}
            >
              Got a project in mind?
            </h2>
            <p
              className="leading-relaxed text-white/90 m-0 font-light"
              style={{
                fontSize: 'clamp(0.9375rem, 1.4vw, 1.125rem)',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              From web and video to sound and AI,<br />
              we shape ideas into experiences that connect.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="flex items-center shrink-0 max-[968px]:justify-center max-[480px]:flex-col max-[480px]:gap-4"
          style={{ gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}
        >
          {/* Circle group */}
          <div className="flex items-center relative gap-0">
            <div
              className="rounded-full border border-white/50 bg-transparent shrink-0 max-[768px]:w-[clamp(2.75rem,8vw,3.25rem)] max-[768px]:h-[clamp(2.75rem,8vw,3.25rem)]"
              style={{
                width: 'clamp(3rem, 5vw, 3.75rem)',
                height: 'clamp(3rem, 5vw, 3.75rem)',
              }}
            />
            <motion.a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-[#F7F2E4] border-none flex items-center justify-center cursor-pointer transition-all duration-300 relative z-2 shrink-0 -mx-2.5 hover:shadow-lg hover:z-10"
              style={{
                width: 'clamp(3rem, 5vw, 3.75rem)',
                height: 'clamp(3rem, 5vw, 3.75rem)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" className="w-[35%] h-[35%]">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
            <div
              className="rounded-full border border-white/50 bg-transparent shrink-0 max-[768px]:w-[clamp(2.75rem,8vw,3.25rem)] max-[768px]:h-[clamp(2.75rem,8vw,3.25rem)]"
              style={{
                width: 'clamp(3rem, 5vw, 3.75rem)',
                height: 'clamp(3rem, 5vw, 3.75rem)',
              }}
            />
          </div>

          <motion.a
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-shine inline-block no-underline border-none rounded-full bg-[#0E0A08] text-white font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap relative z-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
            style={{
              padding: 'clamp(0.75rem, 1.2vw, 0.9375rem) clamp(1.5rem, 2.5vw, 2rem)',
              fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
              letterSpacing: '0.05em',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
            }}
          >
            LET&apos;S CREATE!
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectStrip;
