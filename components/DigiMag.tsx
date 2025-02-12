"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const DigiMag = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4" id="digi-mag">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
        <h1 className="text-4xl sm:text-8xl font-bold text-white-900">DIGIMAG</h1>
        <Image src="/rov-colour.png" alt="DigiMag Logo" width={70} height={70} className="w-[70px] h-[70px] sm:w-[140px] sm:h-[140px]" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4 auto-rows-[150px] sm:auto-rows-[300px]">
        {/* Large Feature Image */}
        <div className="relative col-span-2 row-span-2 group overflow-hidden">
          <Image src="/ctltrackprint.jpg" alt="Change My Mind" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 group-hover:opacity-30" />
          <div className="absolute bottom-4 left-4">{/*
            <h3 className="text-white text-lg sm:text-2xl font-bold">Change My Mind</h3>
            <p className="text-white/80 text-xs sm:text-sm">Featured in a top lifestyle blog</p> */}
          </div>
        </div>

        {/* Filling Smaller Images */}
        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/one_at_a_time.JPG" alt="Birthday" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/changeit.jpg" alt="Fashion" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="relative col-span-1 row-span-2 group overflow-hidden">
          <Image src="/woman2.png" alt="Wedding" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        {/* Filling the middle gap */}
        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/domcover.JPG" alt="Travel" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="relative col-span-2 row-span-1 group overflow-hidden">
          <Image src="/cybertruck2.png" alt="Culture" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        {/* Bottom Row Fix */}
        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/faithretrologothing.JPG" alt="Food" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/chain.png" alt="Art" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        {/* Filling Last Row Completely */}
        <div className="relative col-span-2 row-span-1 group overflow-hidden">
          <Image src="/event_3.jpg" alt="Design" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="relative col-span-1 row-span-1 group overflow-hidden">
          <Image src="/cover1.png" alt="Photography" layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

export default DigiMag;