"use client";

import Image from "next/image";

interface CardTemplateProps {
  heading: string;
  para1: string;
  para2: string;
}

export default function CardTemplate({ heading, para1, para2 }: CardTemplateProps) {
  return (
    <section
      className="relative pb-16 bg-[#36391f] min-h-screen text-white font-['Poppins'] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background/new8.webp')", }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content wrapper */}
      <div className="relative w-full">
        {/* Title */}
        <h1
          className="text-center pt-10 text-4xl lg:text-7xl tracking-wider px-4"
          style={{ fontFamily: "sink" }}
        >
          {heading}
        </h1>

        <div className="relative md:mt-16 mt-8 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 md:gap-8 gap-4 items-center">
          {/* Left Card (col-span-5) */}
          <div className="md:col-span-5 flex justify-center md:p-0 p-3">
            <div className="bg-black overflow-hidden w-full max-w-md">
              <Image
                src="/assets/images/dishes.webp"
                alt="CTRL A creative showcase"
                width={300}
                height={300}
                className="object-cover w-full h-full p-3 transition-transform duration-500 ease-in-out transform 
                  hover:scale-98 hover:rotate-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Content (col-span-7) */}
          <div className="md:col-span-7 space-y-4 md:p-0 p-3">
            <p className="md:text-[22px] text-lg leading-relaxed">{para1}</p>
            <p className="md:text-[22px] text-lg leading-relaxed">{para2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}