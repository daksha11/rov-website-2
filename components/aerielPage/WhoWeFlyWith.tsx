"use client";
import Image from "next/image";
import React from "react";

const WhoWeFlyWith = () => {
  return (
    <section className="relative md:rounded-t-[50px] md:-mt-[27px] bg-[#291408] w-full h-auto pt-8 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 h-full items-center px-4 md:px-8">
        {/* Left Side - Video */}
        <div className="md:col-span-8 flex items-center justify-center order-1 md:order-none">
          <video
            className="w-full h-[40vh] sm:h-[50vh] md:h-[80vh] object-cover border border-[#dcd9d5] rounded-md shadow-lg"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Aerial drone footage showcasing real estate and event videography"
            title="ROV Studios Drone Videography"
          >
            <source src="/video/2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Side - Styled Box */}
        <div className="md:col-span-4 flex justify-center items-center h-full order-2 md:order-none">
          <div className="relative bg-[#dcd9d5] text-[#1e0202] rounded-lg w-full md:w-full h-auto md:h-full flex flex-col items-center shadow-md ">
            {/* Heading */}
            <h3
              className="text-3xl sm:text-4xl md:text-5xl text-center my-4 md:my-7 bg-[#cac4be] py-2 md:py-3 w-full"
              style={{fontFamily: "anton"}}
            >
              WHO WE FLY WITH
            </h3>

            {/* Content */}
            <div
              className="text-2xl sm:text-3xl font-bold text-center tracking-wider uppercase px-4 md:px-0"
              style={{fontFamily: "futura"}}
            >
              <h2 className="text-4xl sm:text-5xl tracking-wider font-semibold mt-4 md:mt-8">
                REAL ESTATE
              </h2>

              <p className="mt-8 md:mt-12 md:text-3xl text-xl">MISC</p>
              <p className="mt-2 md:text-3xl text-xl">Creative Projects</p>
              <p className="mt-2 md:text-3xl sm:text-xl mb-16 md:mb-0">
                Event Planner
              </p>
            </div>

            {/* Camera Image */}
            <div className="absolute md:block hidden  md:bottom-[-45px]   md:-right-18">
              <Image
                src="/assets/images/camera.webp"
                alt="Camera Icon"
                width={224}
                height={224}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeFlyWith;