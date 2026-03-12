"use client"

import Image from "next/image"

export default function Culture() {
  return (
    <section
      className="relative bg-[#604f45]  text-white font-['Poppins'] bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('/assets/background/new7.jpg')", }}
    >
      

      {/* Content wrapper */}
      <div className="relative w-full">
        {/* Title */}
        <h1
          className="text-center pt-10 text-3xl sm:text-5xl md:text-6xl lg:text-8xl tracking-wider px-4"
          style={{ fontFamily: "pagaki" }}
        >
          CULTURE AND PURPOSE
        </h1>

        {/* Paragraphs */}
        <div className="text-lg  md:text-2xl lg:text-4xl px-4 sm:px-8 md:px-16 pt-6 md:pt-8 ">
          <p>We built Ctrl-A because every artist we know is overwhelmed</p>
          <p>Too many tools. Too little soul.</p>
          <p>
            Ctrl-A is our answer—a living space for creators to pause, breathe,
            and come home to the vision.
          </p>
          <p>This isn’t branding fluff. This is culture work.</p>
          <p>
            From Atlanta’s studios to your screen, we’re building rituals,
            tools, and community for real ones who are ready to trust the
            process again. CTA:
          </p>
        </div>

        {/* Image bottom right */}
        <div className="flex justify-end  md:-mr-[30px] md:-mb-[5%] mt-6 md:mt-0">
            <Image
            src="/assets/images/bridg.webp"
            alt="Atlanta bridge representing CTRL A creative culture"
            width={400}
            height={300}
            className="w-72 lg:w-[400px] h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}