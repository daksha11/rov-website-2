/* eslint-disable @next/next/no-img-element */
"use client"
import { TypeAnimation } from "react-type-animation";

export default function VisionSection() {
  return (
    <div
      role="img"
      aria-label="ROV Studios vision for sound engineering"
      className="relative w-full bg-cover  bg-center pb-10 pt-6 rounded-t-[30px] md:rounded-t-[50px] -mt-[20px] md:-mt-[27px]"
      style={{
        backgroundImage: "url('/assets/background/2.jpg')",
      }}
    >
      <div style={{fontFamily:"anton"}} className="relative  mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center ">
        
        {/* Left Content */}
        <div className="text-white space-y-4 md:space-y-6 md:col-span-7 pt-8 md:pt-10">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl  leading-snug md:leading-[1.1]  uppercase text-[#443c37] md:pl-10 pl-4">
            YOU&apos;VE GOT THE VISION. THE BARS.
          </p>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl  leading-snug md:leading-[1.1]  uppercase text-[#443c37] md:pl-10 pl-4">
            THE MELODY THAT WON&apos;T LEAVE YOUR HEAD.
          </p>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl  leading-snug md:leading-[1.1]  uppercase text-[#443c37] md:pl-10 pl-4">
            BUT MIXING?
          </p>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl  leading-snug md:leading-[1.1]  uppercase text-[#443c37] md:pl-10 pl-4">
            THAT&apos;S WHERE DREAMS GO TO DIE IN ENDLESS REVISIONS.
          </p>

          <p
            style={{ fontFamily: "pagaki" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-6 md:mt-10 md:ml-10 ml-4 uppercase pt-4 md:pt-6 text-[#302218]"
          >
            <TypeAnimation
              sequence={[
                "HERE’S WHAT TRUE CHANGES EVERYTHING:",
                2000,
                "",
                500,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{ display: "inline-block" }}
            />
          </p>
        </div>

        {/* Right Side */}
        <div className="relative h-full w-full text-white md:col-span-5 flex flex-col items-center md:items-start">
          {/* Arrow Image */}
          <img
            src="/assets/images/aboutdownarrow.png"
            alt=""
            className="w-20 sm:w-28 md:w-40 lg:w-58  transform rotate-290 animate-[float-x_3s_ease-in-out_infinite] md:block hidden"
          />

          {/* Speech Bubble */}
          <div className="relative flex justify-center -mt-6 md:-mt-[36px] w-full">
            <img
              src="/assets/images/commentbg.webp"
              className="w-[260px] sm:w-[320px] md:w-[380px] lg:w-[400px] h-auto object-contain"
              alt="Sound engineering customer testimonial"
            />
            <p
              style={{ fontFamily: "pagaki" }}
              className="absolute inset-0 flex items-center justify-center text-center text-base sm:text-lg md:text-xl lg:text-3xl text-[#624d4d] leading-relaxed px-2 sm:px-4 "
            >
              we get it. You&apos;re not <br /> trying to spend <br /> months tweaking EQ!
            </p>
          </div>

          {/* Hand Image */}
          <div className=" justify-end w-full md:flex hidden">
            <img
              src="/assets/images/abouthand.png"
              alt=""
              className="w-28 sm:w-36 md:w-48  lg:w-96 mt-4 md:mt-6 -mr-8 animate-[float-x_3s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}