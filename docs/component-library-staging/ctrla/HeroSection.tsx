"use client"
import Image from "next/image";

export default function HeroSecton() {
  return (
    <section
      className="relative  lg:h-[100vh] h-[60vh] flex flex-col justify-center items-center px-6 md:px-14 text-white overflow-hidden font-['Poppins'] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background/new5.webp')", }}
    >
      <div
        className="relative max-w-4xl  w-full h-full mt-10 bg-contain bg-no-repeat  bg-center  overflow-hidden "
        style={{ backgroundImage: "url('/assets/images/commentbg.webp')" }}
      >
        {/* 2 Images */}
        <div className="absolute inset-0 flex items-center justify-center ">
          {/* Large Image */}
          <div className="relative w-[180px] h-[160px] lg:w-[560px] lg:h-[500px] md:mb-16 mb-8 ">
            <Image
              src="/assets/images/ctrla.webp"
              alt="CTRL A creative toolkit branding"
              fill
              priority
              className="object-cover h-full w-full transform rotate-10"
            />
          </div>

          {/* Small Image */}
          <div className="relative md:w-18 md:h-48 h-28 w-20 md:mr-13 transform rotate-5 md:mt-24 mb-2">
            <Image
              src="/assets/images/ctrlamark.webp"
              alt="CTRL A logo mark"
              fill
              priority
              className="md:object-cover object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}