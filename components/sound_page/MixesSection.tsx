"use client";
import { useState } from "react";
import Image from "next/image";

export default function MixesSection() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-auto w-full bg-cover bg-center px-8 md:px-26 py-20 rounded-t-[47px] -mt-[30px]"
      style={{ backgroundImage: "url('/assets/background/3.webp')" }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Left side - Image Grid */}
        <div className="md:col-span-6 grid grid-cols-3 gap-4">
          {[
            "/assets/images/gallery1.webp",
            "/assets/images/gallery2.webp",
            "/assets/images/gallery3.webp",
            "/assets/images/gallery4.webp",
            "/assets/images/gallery5.webp",
            "/assets/images/gallery6.webp",
            "/assets/images/gallery7.webp",
            "/assets/images/gallery8.webp",
            "/assets/images/gallery9.webp",
          ].map((src, i) => (
            <div
              key={i}
              className="relative w-full aspect-square bg-[#b7ac9c] shadow-lg overflow-hidden rounded-sm p-2"
            >
              <Image
                src={src}
                alt={`ROV Studios music production portfolio ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
            </div>
          ))}
        </div>

        {/* Right side - Flip Card */}
        <div className="md:col-span-6 flex justify-center">
          <div
            className="relative md:h-[500px] h-[400px] w-[400px] cursor-pointer [perspective:1000px]"
            onMouseEnter={() => setFlipped(true)} 
            onMouseLeave={() => setFlipped(false)} 

          >
            {/* Inner wrapper */}
            <div
              className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 bg-[url('/assets/images/gallerybg.webp')] bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center [backface-visibility:hidden]">
                <div className="absolute inset-0 bg-[#4a2b16]/80"></div>
                <div className="relative z-10 text-center text-white px-6">
                  <h2 className="text-[#c7bbab] text-4xl md:text-6xl font-extrabold leading-tight uppercase"
                  style={{fontFamily: "anton"}}>
                    $50 Mixes <br /> 48-Hour Delivery
                  </h2>
                  <h2 className=" text-[#c7bbab] text-4xl md:text-5xl mt-5 leading-tight font-extrabold uppercase"
                  style={{fontFamily: "anton"}}>
                    3 Revisions Included
                  </h2>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 bg-[url('/assets/images/gallerybg.webp')] bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="absolute inset-0 bg-[#4a2b16]/90"></div>
                <div className="relative z-10 h-full text-[#ccc8be] p-8 flex flex-col justify-center"
                style={{fontFamily: "futura"}}>
                  <ul className="space-y-3 md:text-2xl text-lg">
                    <li>✓ Professional mix + master</li>
                    <li>✓ Loudness-optimized for streaming</li>
                    <li>✓ Social-ready versions (IG, TikTok, etc.)</li>
                    <li>✓ Full creative support when you need it</li>
                  </ul>
                  <p className="mt-6 md:text-2xl text-lg">
                    First time working with us? <br className="md:block hidden"/>
                    Demo mix is free. No strings. Just proof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}