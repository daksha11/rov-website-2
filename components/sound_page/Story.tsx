/* eslint-disable @next/next/no-img-element */
"use client"
import { motion,Variants } from "framer-motion";
export default function Story() {
  const text: string[] = ["BUT HERE'S THE THING..."];

  // Parent container
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        ease: "easeInOut",
        duration: 0.6,
      },
    },
  };

  // Letter animation
  const letter: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
  <div
  role="img"
  aria-label="ROV Studios atmospheric studio environment"
  className="relative py-16 md:py-20 overflow-hidden -mt-[20px] md:-mt-[27px] rounded-t-[30px] md:rounded-t-[50px] bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/background/5.jpg')" }}
>

  <div className="relative mx-auto">
    {/* Main heading */}
    <div className="relative mb-10 md:mb-12">
      <motion.h1
        style={{ fontFamily: "anton" }}
        className="text-3xl sm:text-4xl md:text-6xl lg:text-[140px]  text-[#302218] leading-snug md:leading-none"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {text.map((line, lineIndex) => (
          <div key={lineIndex} className="flex justify-center flex-wrap">
            {line.split("").map((char, i) => (
              <motion.span key={i} variants={letter}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.h1>

      {/* Microphone image positioned on the right (hidden on mobile) */}
      <motion.div
        className="absolute top-0 mt-28 right-0 hidden md:block -mr-10"
        initial={{ opacity: 1 }}
        animate={{ x: [0, -20, 0], opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <img
          src="/assets/images/mictwo.webp"
          alt="Professional studio microphone at ROV Studios"
          className="w-28 h-28 md:w-64 md:h-56  object-cover "
        />
      </motion.div>
    </div>

    {/* Content section with arrow */}
    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-16">
      {/* Left arrow image (hidden on mobile) */}
      <div className="flex-shrink-0 mb-6 md:mb-16 hidden md:block  -ml-20 ">
        <motion.div
          className="w-20 h-20 md:w-96 md:h-80 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ x: [0, -20, 0], opacity: 1 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <img src="/assets/images/arrowright2.webp" className="transform rotate-6"  alt="" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-1 text-center md:text-right md:mt-28">
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl tracking-tight md:tracking-tighter font-bold text-[#382a21] leading-snug md:leading-tight mb-6 md:mb-8 md:mr-24"
        style={{fontFamily: "futura"}}>
          YOUR MIX IS JUST THE BEGINNING OF
          <br />
          YOUR STORY.
        </h2>

        {/* Description */}
        <div style={{fontFamily:"futura"}} className=" italic text-base sm:text-lg md:text-xl lg:text-2xl md:mr-20 ">
          <p>
            That <span className="font-semibold">perfect</span> track{" "}
            <span className="font-semibold">needs</span>
          </p>
          <p>Cover art that stops the scroll</p>
          <p>A release strategy that builds momentum</p>
          <p>
            Content that turns <span className="font-semibold">listeners</span>{" "}
            into <span className="font-semibold">fans</span>
          </p>
          <p>
            A <span className="font-semibold">brand</span> that looks as good as
            you sound
          </p>
        </div>

        {/* Bottom statement */}
        <div className="mt-6 md:mt-8 md:mr-20">
          <p className="text-[#382a21] italic font-normal text-base sm:text-lg md:text-xl lg:text-2xl">
            We handle it ALL. Because scattered vendors kill creative momentum
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}