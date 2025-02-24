import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselItem {
  id: number;
  title: string;
  image: string;
  number: string;
}

const items: CarouselItem[] = [
  { id: 1, title: "", image: "/cover1.png", number: "" },
  { id: 2, title: "", image: "/cover2.png", number: "" },
  { id: 3, title: "", image: "/cover3.png", number: "" },
  { id: 4, title: "", image: "/rov_album_4.webp", number: "" },
  { id: 5, title: "", image: "/rov_album_1.webp", number: "" },
  { id: 6, title: "", image: "/rov_album_2.webp", number: "" },
  { id: 7, title: "", image: "/rov_album_3.webp", number: "" },
];

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(5);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
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
      opacity: 1, // Ensure all images are fully visible
    };
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-transparent border-none text-white cursor-pointer z-20 p-4 transition-opacity duration-300 hover:opacity-70"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-transparent border-none text-white cursor-pointer z-20 p-4 transition-opacity duration-300 hover:opacity-70"
        >
          <ArrowRight className="w-8 h-8" />
        </button>

        {/* Carousel */}
        <div className="relative w-full h-full [perspective:1000px]">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="absolute w-[320px] h-[480px] left-1/2 top-1/2 -ml-[160px] -mt-[240px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={getItemStyle(index)}
            >
              <div
                className={`relative w-full h-full rounded-[20px] overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-[1.02] ${
                  index === activeIndex ? "scale-105 z-[100]" : "scale-95"
                }`}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Content */}
                <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <div className="absolute right-0 bottom-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-12 right-0 text-3xl font-bold opacity-100">
                    {item.number}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for the fonts */}
      <style jsx>{`
        @font-face {
          font-family: "Flight Maybe Maj";
          src: url("/fonts/Flight Maybe Maj.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

export default Gallery;
