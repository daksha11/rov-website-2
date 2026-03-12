/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from "react";

export default function AgencyIntro() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section
      className="relative w-full h-auto flex items-center justify-center text-white -mt-[20px] md:-mt-[30px] rounded-t-[30px] md:rounded-t-[50px]"
      style={{
        backgroundImage: "url('/assets/background/12.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="relative w-full max-w-7xl h-[370px]  md:h-[500px] cursor-pointer [perspective:1000px]"
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        {/* Inner Card */}
        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front Side (Heading) */}
          <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
            <h2
              style={{ fontFamily: "anton" }}
              className="text-[#f5e7d1] text-5xl  md:text-7xl lg:text-[140px] uppercase leading-snug sm:leading-tight md:leading-tight text-center drop-shadow-xl px-4"
            >
              We didn&apos;t start as <br />
              <span className="flex justify-center items-center gap-3 sm:gap-4">
                <span className="block">An Agency</span>
                <img
                  src="/assets/images/quote.png"
                  alt="Agency Logo"
                  className="w-8 h-16 sm:w-10 sm:h-20 md:w-14 md:h-36 transform rotate-20 animate-bounce mt-2 sm:mt-5"
                />
              </span>
            </h2>
          </div>

          {/* Back Side (Details) */}
          <div style={{fontFamily:"futura"}} className="absolute inset-0 flex  items-center justify-center px-4 sm:px-6 md:px-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="space-y-3 sm:space-y-4  max-w-4xl text-base sm:text-lg md:text-xl lg:text-3xl uppercase text-[#f5e7d1] leading-relaxed sm:leading-normal md:leading-snug">
              <p>
                It began as a community – artists, producers, engineers connecting online in a Discord server.
              </p>
              <p>
                Late nights spent sharing honest feedback. Real struggles. Growing together.
              </p>
              <p>
                Those genuine conversations, that shared hustle – that&apos;s where R.O.V. was born.
              </p>
              <p>
                That same collaborative spirit? It&apos;s what drives us today and what we bring to every brand we build.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}