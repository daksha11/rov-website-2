"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CardSwap, { Card } from '@/components/effects/CardSwap';
import GradientBlob from '@/components/effects/GradientBlob';

const ElevateSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="w-full flex items-center justify-center relative overflow-hidden"
      style={{ padding: 'clamp(2.5rem, 5vw, 3.75rem) clamp(1.5rem, 5vw, 4rem)' }}
    >
      <GradientBlob position="top-left" size="clamp(25rem, 50vw, 50rem)" blur="clamp(6.25rem, 12.5vw, 12.5rem)" />
      <GradientBlob position="bottom-right" size="clamp(25rem, 50vw, 50rem)" blur="clamp(6.25rem, 12.5vw, 12.5rem)" />

      {/* Banner Card */}
      <div
        className="flex w-full max-w-full flex-col justify-center items-center rounded-[15px] relative z-10 overflow-hidden"
        style={{
          minHeight: 'clamp(16rem, 20vw, 17.5rem)',
          padding: 'clamp(2.5rem, 4vw, 3.75rem) clamp(2rem, 4vw, 3.75rem)',
          gap: '0.625rem',
          border: '1px solid rgba(255, 244, 227, 0.40)',
          background: '#110C09',
          boxShadow: '0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Content Wrapper */}
        <div
          className="flex items-center justify-between w-full relative max-[968px]:flex-col max-[968px]:items-center"
          style={{ gap: 'clamp(2rem, 5vw, 3.75rem)' }}
        >
          {/* Left Content */}
          <div
            className="flex flex-col items-start text-left max-[968px]:items-center max-[968px]:text-center"
            style={{ flex: '1.2', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            <h2
              className="font-semibold text-[#FFF4E3] m-0"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
                lineHeight: '1.1',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Take a look at our latest website case study!
            </h2>

            {/* CTA Wrapper */}
            <div
              className="flex items-center justify-start w-full gap-[calc(clamp(3.5rem,5vw,4.25rem)*0.625)] max-[968px]:justify-center max-[968px]:pl-0 max-[968px]:gap-6 max-[640px]:flex-col max-[640px]:items-center"
              style={{
                marginTop: 'clamp(1rem, 2vw, 2rem)',
                paddingLeft: 'clamp(1.875rem, 3vw, 2.5rem)',
              }}
            >
              {/* Arrow Button with decorative circles */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/casestudy'}
                className="elevate-arrow-btn rounded-full bg-[#FFF4E3] flex items-center justify-center cursor-pointer transition-all duration-300 relative z-[2] shrink-0 hover:shadow-md"
                style={{
                  width: 'clamp(3.5rem, 5vw, 4.25rem)',
                  height: 'clamp(3.5rem, 5vw, 4.25rem)',
                }}
              >
                {/* Decorative Circles */}
                <div className="absolute w-full h-full border-[2px] border-[#FFF4E3] rounded-full left-[-62.5%] z-[-1] hidden min-[969px]:block pointer-events-none" />
                <div className="absolute w-full h-full border-[2px] border-[#FFF4E3] rounded-full right-[-62.5%] z-[-1] hidden min-[969px]:block pointer-events-none" />
                
                <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" className="w-[35%] h-[35%] relative z-10 pointer-events-none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* CTA Link with preview */}
              <div
                className="relative inline-block"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute bottom-full left-1/2 mb-6 w-[320px] h-[200px] z-50 pointer-events-none hidden md:block"
                      initial={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                      transition={{ duration: 0.2 }}
                      id="hover-preview-container"
                    >
                      <div className="w-full h-full bg-black rounded-xl border border-white/20 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">
                        <Image
                          src="/casestudy/iknacasestudy.webp"
                          alt="Case study preview"
                          fill
                          sizes="320px"
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      </div>
                      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 rotate-45 w-4 h-4 bg-black border-b border-r border-white/20" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.a
                  href="/casestudy"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center no-underline border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap relative z-1"
                  style={{
                    height: 'clamp(3.5rem, 5vw, 4.25rem)',
                    padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
                    borderRadius: '41.444px',
                    background: 'linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)',
                    boxShadow: '3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)',
                    fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
                    letterSpacing: '0.05em',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  READ THE STORY
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right Section - Card Swap */}
          <div className="flex-1 flex justify-center items-center relative min-h-[450px] w-full max-[968px]:mt-8 max-[968px]:min-h-[350px]">
            <CardSwap width={380} height={280} delay={4000}>
               <Card>
                <Image src="/albums/rov_album_1.webp" alt="ROV Album 1" fill sizes="380px" className="object-cover rounded-xl" loading="lazy" />
              </Card>
              <Card>
                <Image src="/albums/rov_album_2.webp" alt="ROV Album 2" fill sizes="380px" className="object-cover rounded-xl" loading="lazy" />
              </Card>
              <Card>
                <Image src="/albums/rov_album_3.webp" alt="ROV Album 3" fill sizes="380px" className="object-cover rounded-xl" loading="lazy" />
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevateSection;
