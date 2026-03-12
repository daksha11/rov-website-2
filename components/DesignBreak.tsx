"use client";

import { useState } from "react";
import Image from "next/image";
import { createGlobalStyle } from "styled-components";
import CircularText from './CircularText';
import Waves from "./Waves";
import FuzzyText from "./FuzzyText";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

export default function DesignBreak() {
  const [text, setText] = useState("ఇచ్చిపడేద్దాం");
  const images = ["/R_break.webp", "/O_break.webp", "/V_break.webp"];
  const [currentImage, setCurrentImage] = useState(images[0]);

  const handleMouseEnter = () => {
    setText(prevText => 
      prevText === "ఇచ్చిపడేద్దాం" ? "Ichipadedham" : "ఇచ్చిపడేద్దాం"
    );
  };

  const handleImageHover = () => {
    setCurrentImage(prevImage => {
      const nextIndex = (images.indexOf(prevImage) + 1) % images.length;
      return images[nextIndex];
    });
  };

  return (
    <div className="w-full h-auto bg-black text-white flex flex-col items-center justify-center px-1 sm:px-4 overflow-hidden py-2 sm:py-8" style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}>
      <GlobalStyle />
      <header className="w-full border-y border-white/20 flex flex-col">
        {/* Top row */}
        <div className="grid grid-cols-12 border-b border-white/20 w-full">
          {/* Range Of View Collective with Semi-Circle Outline */}
          <div className="col-span-5 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full relative">
            {/* Circular Text */}
            <CircularText 
              text="RANGE*OF*VIEW*STUDIOS*" 
              spinDuration={10}
              onHover="slowDown"
              className="text-white z-10"
            />
            {/* Semi-Circle Outline on the Right */}
            <div 
              className="absolute right-0 top-0 h-full w-[50%] border-r border-white/50"
              style={{
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
                borderTopRightRadius: "100%",
                borderBottomRightRadius: "100%",
                background: "transparent", // Ensure no fill
              }}
            />
          </div>

          {/* Image that changes on hover */}
          <div
            className="col-span-3 border-r border-white/20 w-full h-full flex items-center justify-center relative"
            onMouseEnter={handleImageHover}
          >
            <Image src={currentImage} alt="ROV Studios brand identity" fill className="object-cover" sizes="25vw" />
          </div>

          {/* Background Image Container */}
          <div className="col-span-4 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full bg-cover bg-center"
               style={{ backgroundImage: "url('/3.svg')" }}>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-12 w-full">
          {/* Telugu Text */}
          <div
            className="col-span-4 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full"
            onMouseEnter={handleMouseEnter}
          >
            <FuzzyText 
              text={text} 
              baseIntensity={0.2} 
              hoverIntensity={0.5} 
              enableHover={false}
            />
          </div>

          {/* Middle section */}
          <div className="col-span-5 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full">
            <div className="text-[8px] sm:text-base text-white/70 text-center">
              replace with other fluttering graphic
            </div>
          </div>

          {/* Since 2021 with Hand Icon and Waves */}
          <div className="col-span-3 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center gap-1 sm:gap-3 w-full relative">
            <Waves 
              lineColor="rgba(255, 255, 255, 0.2)"  
              backgroundColor="transparent"          
              waveSpeedX={0.09}                    
              waveSpeedY={0.05}
              waveAmpX={32}
              waveAmpY={16}
              xGap={10}
              yGap={32}
              friction={0.925}
              tension={0.005}
              maxCursorMove={100}
              className="z-0"                        
            />
            <div className="relative z-10 flex items-center gap-1 sm:gap-3"> 
              <h2 className="text-[10px] sm:text-xl font-light tracking-wider">Since 2021</h2>
              <div className="relative w-3 sm:w-8 h-3 sm:h-8">
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}