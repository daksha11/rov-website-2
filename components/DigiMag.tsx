"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const DigiMag = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-8xl font-bold text-white-900">DIGIMAG</h1>
        <Image src="/rov-colour.png" alt="DigiMag Logo" width={140} height={140} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Large Left Card */}
        <div className="relative col-span-2 row-span-2 group overflow-hidden flex items-center justify-center">
          <div className="w-full h-[400px] relative overflow-hidden">
            <Image
              src="/cover1.png"
              alt="Change My Mind"
              width={800}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-bold">Change My Mind</h3>
              <p className="text-white/80 text-sm mt-2">Featured in a top lifestyle blog</p>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col col-span-1 gap-4">
          {/* Top Image */}
          <div className="relative group overflow-hidden">
            <div className="w-full h-[200px] relative overflow-hidden">
              <Image
                src="/cover2.png"
                alt="Birthday"
                width={400}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-bold">Birthday</h3>
                <p className="text-white/80 text-sm">Featured in a top lifestyle blog</p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Bottom Image */}
          <div className="relative group overflow-hidden">
            <div className="w-full h-[200px] relative overflow-hidden">
              <Image
                src="/cover1.png"
                alt="Birthday"
                width={400}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-bold">Birthday</h3>
                <p className="text-white/80 text-sm">Featured in a top lifestyle blog</p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative col-span-1 row-span-2 group overflow-hidden">
          <div className="w-full h-[400px] relative overflow-hidden">
            <Image
              src="/cover2.png"
              alt="Wedding"
              width={400}
              height={800}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-30" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-bold">Wedding</h3>
              <p className="text-white/80 text-sm">Submitted to bridal magazines</p>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiMag;
