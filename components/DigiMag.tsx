"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const DigiMag = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
        <h1 className="text-4xl sm:text-8xl font-bold text-white-900">DIGIMAG</h1>
        <Image src="/rov-colour.png" alt="DigiMag Logo" width={70} height={70} className="w-[70px] h-[70px] sm:w-[140px] sm:h-[140px]" />
      </div>

      <div className="grid grid-cols-4 gap-1 sm:gap-4">
        {/* Large Left Card */}
        <div className="relative col-span-2 row-span-2 group overflow-hidden flex items-center justify-center">
          <div className="w-full h-[200px] sm:h-[400px] relative overflow-hidden">
            <Image
              src="/cover1.png"
              alt="Change My Mind"
              width={800}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <h3 className="text-white text-sm sm:text-xl font-bold">Change My Mind</h3>
              <p className="text-white/80 text-[10px] sm:text-sm mt-1 sm:mt-2">Featured in a top lifestyle blog</p>
            </div>
            <ArrowUpRight className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white w-4 h-4 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col col-span-1 gap-1 sm:gap-4">
          {/* Top Image */}
          <div className="relative group overflow-hidden">
            <div className="w-full h-[100px] sm:h-[200px] relative overflow-hidden">
              <Image
                src="/cover2.png"
                alt="Birthday"
                width={400}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                <h3 className="text-white text-xs sm:text-lg font-bold">Birthday</h3>
                <p className="text-white/80 text-[8px] sm:text-sm">Featured in a top lifestyle blog</p>
              </div>
              <ArrowUpRight className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white w-4 h-4 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Bottom Image */}
          <div className="relative group overflow-hidden">
            <div className="w-full h-[100px] sm:h-[200px] relative overflow-hidden">
              <Image
                src="/cover1.png"
                alt="Birthday"
                width={500}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                <h3 className="text-white text-xs sm:text-lg font-bold">Birthday</h3>
                <p className="text-white/80 text-[8px] sm:text-sm">Featured in a top lifestyle blog</p>
              </div>
              <ArrowUpRight className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white w-4 h-4 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative col-span-1 row-span-2 group overflow-hidden">
          <div className="w-full h-[200px] sm:h-[400px] relative overflow-hidden">
            <Image
              src="/cover2.png"
              alt="Wedding"
              width={400}
              height={800}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <h3 className="text-white text-sm sm:text-xl font-bold">Wedding</h3>
              <p className="text-white/80 text-[10px] sm:text-sm">Submitted to bridal magazines</p>
            </div>
            <ArrowUpRight className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white w-4 h-4 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiMag;