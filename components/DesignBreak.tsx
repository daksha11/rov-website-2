"use client";

import { useState } from "react";
import { createGlobalStyle } from "styled-components";

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

  const handleMouseEnter = () => {
    setText(prevText => 
      prevText === "ఇచ్చిపడేద్దాం" ? "Ichipadedham" : "ఇచ్చిపడేద్దాం"
    );
  };

  return (
    <div className="w-full h-auto bg-black text-white flex flex-col items-center justify-center px-1 sm:px-4 overflow-hidden py-2 sm:py-8" style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}>
      <GlobalStyle />
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

          {/* Logo with background image */}
          <div className="col-span-3 border-r border-white/20 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full bg-cover bg-center"
               style={{ backgroundImage: "url('/2.svg')" }}>
            <div className="flex justify-center items-center w-24 sm:w-32 h-24 sm:h-32">
              {/* This will now show the background image */}
            </div>
          </div>

          {/* Background Image Container */}
          <div className="col-span-4 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center w-full bg-cover bg-center"
               style={{ backgroundImage: "url('/3.svg')" }}>
            {/* The background image will cover the space, adjust if needed */}
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
            <div className="text-[8px] sm:text-base text-white/70 text-center">
              replace with other fluttering graphic
            </div>
          </div>

          {/* Since 2021 with Hand Icon */}
          <div className="col-span-3 py-2 sm:py-6 px-1 sm:px-4 flex items-center justify-center gap-1 sm:gap-3 w-full">
            <h2 className="text-[10px] sm:text-xl font-light tracking-wider">Since 2021</h2>
            <div className="relative w-3 sm:w-8 h-3 sm:h-8">
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
