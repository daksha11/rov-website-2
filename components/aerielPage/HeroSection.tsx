"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        loop={true}
        className="mySwiper"
      >
        {[1, 2, 3].map((idx) => (
          <SwiperSlide key={idx}>
            <section className="relative w-full h-screen overflow-hidden">
              {/* Background Video */}
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Aerial drone footage of Lake Lanier by ROV Studios"
                title="Aerial Cinematography - ROV Studios"
              >
                <source src="/video/1.mp4" type="video/mp4" />
              </video>

              {/* Content */}
              <div className="relative z-10 h-full flex pt-20 pb-10 px-6 lg:px-20 text-[#dcd7c8]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {/* Left Column */}
                  <div className="flex flex-col justify-between">
                    <h1
                      className="flex flex-col justify-between h-full"
                      style={{fontFamily: "anton"}}
                    >
                      <span className="text-4xl md:text-6xl lg:text-8xl text-white leading-tight tracking-wider">
                        ELEVATE YOUR <br /> VISION
                      </span>
                      <span className="text-4xl md:text-7xl lg:text-8xl text-white tracking-wider">
                        LITERALLY.
                      </span>
                    </h1>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col justify-between text-white md:text-right">
                    <p
                      className="text-2xl leading-[1.5] text-[#dcd7c8]"
                      style={{fontFamily: "futura"}}
                    >
                      Lake Lanier || Swipe <br />
                      <span>Filmed by</span> <br />
                      <span className="font-semibold md:text-3xl text-2xl">
                        Range Of View Studios
                      </span>
                    </p>
                    <p className="md:text-2xl text-lg font-medium tracking-wider italic text-[#dcd7c8] leading-[1.3]"
                    style={{fontFamily: "futura"}}>
                      We capture the impossible. <br />
                      Your vision, from a new <br /> perspective
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrow Images */}
      <div className="custom-prev md:block hidden absolute top-1/2 -translate-y-1/2 left-4 z-10 cursor-pointer mt-8">
        <Image
          src="/assets/images/swiperarrowleft.png"
          alt="Previous slide"
          width={80}
          height={56}
          className="object-contain"
        />
      </div>
      <div className="custom-next md:block hidden absolute top-1/2 -translate-y-1/2 right-4 z-10 cursor-pointer mt-8">
        <Image
          src="/assets/images/swiperarrowright.webp"
          alt="Next slide"
          width={80}
          height={56}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default HeroSection;