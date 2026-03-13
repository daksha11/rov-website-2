"use client";
import Image from "next/image";
import React from "react";

const VisionImpact = () => {
  const slides = [
    {
      heading: "IMPACT",
      percent: "55%",
      desc: "Of companies using drone footage see measurable increases in customer inquiries",
    },
    {
      heading: "IMPACT",
      percent: "2-3X",
      desc: "Longer viewing time when aerial shots are included",
    },
    {
      heading: "IMPACT",
      percent: "150%",
      desc: "Higher ROI / Drone content outperforms traditional video",
    },
  ];

  return (
    <section className="bg-[#42210b] w-full min-h-screen py-8 md:py-18 md:rounded-t-[50px] ">
      <div className="container mx-auto flex flex-wrap justify-center gap-10 px-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              backgroundImage: "url('/assets/background/visionimpactbg.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom",
            }}
            className="relative bg-[#DCD9D5]  text-[#1e0202] rounded-lg w-full sm:w-[300px] md:w-[350px] md:h-[530px] h-[400px] flex flex-col items-center shadow-md"
          >
            {/* Header */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl text-center mt-4 bg-[#cac4be] py-3 w-full uppercase tracking-widest"
            style={{fontFamily: "anton"}}>
              {slide.heading}
            </h3>

            {/* Percentage + Description */}
            <div className="font-bold text-center w-full px-4  flex flex-col items-center  flex-grow"
            style={{fontFamily: "futura"}}>
              <h2 className="md:text-7xl text-5xl font-extrabold tracking-wider mt-12"
              style={{fontFamily: "futura"}}>
                {slide.percent}
              </h2>
              <p className="text-base md:text-[26px] lowercase  leading-snug px-2 md:px-10 mt-7"
              style={{fontFamily: "futura"}}>
                {slide.desc}
              </p>
            </div>

            {/* Camera Image */}
            <div className="absolute -bottom-4 -right-7 z-10">
              <Image
                src="/assets/images/camera.png"
                alt=""
                width={160}
                height={70}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisionImpact;