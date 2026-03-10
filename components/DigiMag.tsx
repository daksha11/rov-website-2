"use client";

import Link from "next/link";
import TrueFocus from "./TrueFocus";
import TiltedCard from "./TiltedCard";
import GradientBlob from "./GradientBlob";

const DigiMag = () => {
  return (
    <div
      id="digi-mag"
      className="w-full px-6 sm:px-12 md:px-16 mt-16 mb-24 relative"
    >
      <GradientBlob position="top-left" />
      <GradientBlob position="bottom-right" />

      <div className="relative z-10">
        {/* Header */}
        <div className="w-full flex justify-start mb-10">
          <div className="w-full text-left">
            <TrueFocus
              sentence="CTRL A\\"
              manualMode
              blurAmount={5}
              borderColor="rgba(255,255,255,0.7)"
              glowColor="rgba(255,255,255,0.6)"
              animationDuration={0.15}
              pauseBetweenAnimations={1.5}
              fontSize="clamp(3rem, 15vw, 14rem)"
              fontFamily="Norwige"
              letterSpacing="0.05em"
              className="justify-start"
            />
          </div>
        </div>

        {/* CREATIVE BENTO GRID - Limited to 2 rows with a fade effect */}
        <div className="relative group/mag">
          <div
            className="
            grid grid-cols-2 md:grid-cols-4
            gap-3 sm:gap-4
            overflow-hidden
            max-h-[400px] sm:max-h-[550px] md:max-h-[750px]
            relative
          "
          >
            {/* 1. Item 1: 2 columns, 1 row -> wide, fills height of row 1 */}
            <div className="col-span-2 row-span-1">
              <TiltedCard
                imageSrc="/video/starscollidemv.mp4"
                altText="Stars Collide MV"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={15}
                showTooltip={false}
              />
            </div>

            {/* 2. Item 2: 1 column, 1 row -> aspect square */}
            <div className="col-span-1 row-span-1 aspect-square">
              <TiltedCard
                imageSrc="/chain.webp"
                altText="ROV Chain"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={15}
                showTooltip={false}
              />
            </div>

            {/* 3. Item 3: 1 column, 2 rows (spans both) -> fills both rows + gap */}
            <div className="col-span-1 row-span-2">
              <TiltedCard
                imageSrc="/woman2.webp"
                altText="Vices"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={15}
                showTooltip={false}
              />
            </div>

            {/* 4. Item 4: 1 column, 1 row -> aspect square */}
            <div className="col-span-1 row-span-1 aspect-square">
              <TiltedCard
                imageSrc="/ddk_1.webp"
                altText="DDK Album"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={15}
                showTooltip={false}
              />
            </div>

            {/* 5. Item 5: 2 columns, 1 row -> wide, fills height of row 2 */}
            <div className="col-span-2 row-span-1">
              <TiltedCard
                imageSrc="/james.mp4"
                altText="Open Verse"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={15}
                showTooltip={false}
              />
            </div>

            {/* Fade Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#110808] to-transparent z-20 pointer-events-none" />
          </div>

          {/* Glassy "View More" Button */}
          <div className="absolute -bottom-12 md:-bottom-16 left-1/2 -translate-x-1/2 z-30">
            <Link href="/ctrla">
              <button
                className="
                  group relative px-6 py-2.5 md:px-8 md:py-3 rounded-full 
                  bg-white/5 backdrop-blur-xl border border-white/10
                  text-white text-xs md:text-sm font-medium tracking-[0.2em]
                  transition-all duration-300 hover:bg-white/10 hover:border-white/20
                  flex items-center gap-3 overflow-hidden
                  shadow-[0_0_20px_rgba(0,0,0,0.5)]
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                VIEW MORE
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiMag;