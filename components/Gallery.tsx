"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselItem {
  id: number;
  image: string;
}

const items: CarouselItem[] = [
  { id: 1, image: "/misc/changeit.webp" },
  { id: 2, image: "/albums/cover2.webp" },
  { id: 3, image: "/misc/catchthelight.webp" },
  { id: 4, image: "/misc/domcover.webp" },
  { id: 5, image: "/misc/faithretrologothing.webp" },
  { id: 6, image: "/misc/miliy1.webp" },
  { id: 7, image: "/misc/miliy2.webp" },
  { id: 8, image: "/misc/one_at_a_time.webp" }
];

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(5);
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      deltaX < 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
  };

  const getItemStyle = (index: number) => {
    const diff = (index - activeIndex + items.length) % items.length;

    const rotationDegree = diff * 20 - 60;
    const translateX = diff * 85.7143 - 257.143;
    const translateY = diff * 14.2857 - 42.8571;
    const zIndex = index === activeIndex ? 100 : items.length - Math.abs(diff);

    return {
      transform: `translate(${translateX}%, ${translateY}%) rotate(${rotationDegree}deg)`,
      zIndex,
      opacity: 1,
    };
  };

  return (
    <div
      className="min-h-screen pt-16 rounded-t-[30px] md:rounded-t-[50px]"
      style={{
        background: "linear-gradient(to bottom, #18130f 0%, #18130f 50%, #000000 100%)",
      }}
    >
      {/* Gallery Heading without italic */}
      <div
        className="text-[#f5e7d1] text-5xl md:text-7xl lg:text-[140px] uppercase font-bold text-center drop-shadow-xl px-4 relative"
        style={{ fontFamily: "Norwige" }}
      >
        <span
          className="relative inline-block"
          style={{
            background: 'linear-gradient(90deg, #f5e7d1 0%, #ffffff 25%, #f5e7d1 50%, #ffffff 75%, #f5e7d1 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shine 3s linear infinite'
          }}
        >
          MUSIC ARTWORK
        </span>
      </div>

      {/* Carousel container */}
      <div
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 cursor-pointer z-50 transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
          aria-label="Previous image"
        >
          <ArrowLeft className="w-8 h-8 transition-transform group-hover:-translate-x-1" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 cursor-pointer z-50 transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 group"
          aria-label="Next image"
        >
          <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Carousel */}
        <div className="relative w-full h-full [perspective:1000px]">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="absolute w-[320px] h-[320px] left-1/2 top-1/2 -ml-[160px] -mt-[160px] transition-all duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
              style={getItemStyle(index)}
            >
              <div
                className={`relative w-full h-full rounded-[5px] overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-[1.02] ${index === activeIndex ? "scale-105 z-[100]" : "scale-95"
                  }`}
              >
                <Image
                  src={item.image}
                  alt={`Album artwork ${item.id}`}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority={index === activeIndex}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery;