"use client";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion,Variants} from "framer-motion";

export default function MixingSection() {
  const text: string[] = ["WHAT YOU’RE", "MISSING IS"];

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
    <section
      className="relative md:rounded-t-[50px] md:-mt-[28px] w-full xl:h-screen lg:h-[70vh] md:h-[75vh] h-[45vh] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/assets/background/visionmixbg.webp')" }}
    >
      {/* Left small text */}
      <div
        className="absolute top-16 left-4 sm:left-8 md:left-20 text-[#d3d3d3] text-xl sm:text-2xl md:text-4xl leading-snug uppercase font-semibold tracking-wider"
        style={{fontFamily: "futura"}}
      >
        You’re <br /> Seeing Half <br /> the Picture.
      </div>

      {/* Main white heading */}
     <motion.div
      className="absolute top-5 md:top-[40px] left-1/2 -translate-x-[40%] text-center px-2"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {text.map((line, lineIndex) => (
        <div key={lineIndex} className="flex justify-center flex-wrap">
          {line.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              className="text-[#d3d3d3] text-2xl  md:text-[60px] lg:text-[90px] xl:text-[110px] tracking-wider uppercase leading-snug"
              style={{fontFamily: "anton"}}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>

      {/* Brown heading */}
      <div className="absolute bottom-10 sm:bottom-16 md:bottom-[90px] left-1/2 -translate-x-[40%]">
        <h3
          className="text-[#302218] text-3xl sm:text-5xl md:text-7xl lg:text-[100px] tracking-wider uppercase text-center"
          style={{fontFamily: "anton"}}
        >
          <TypeAnimation
            sequence={["ABOVE YOU", 2000, "", 500]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{ display: "inline-block" }}
          />

        </h3>
      </div>

      {/* Hand Image (bottom left) */}
      <motion.div
        className="hidden md:block absolute bottom-0 -left-28 md:-left-28 w-40 sm:w-60 md:w-[300px] lg:w-[620px] opacity-90"
        initial={{ opacity: 1 }}
        animate={{ x: [0, -20, 0], opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/assets/images/Adf.webp"
          alt="Hand pointing"
          width={520}
          height={300}
          className="object-contain w-full h-auto"
        />
      </motion.div>

      {/* Mic Image (bottom right) */}
      <motion.div
        className="hidden md:block absolute bottom-[160px] right-0 w-20 sm:w-28 md:w-[150px] lg:w-[200px]"
        initial={{ opacity: 1 }}
        animate={{ x: [0, -20, 0], opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/assets/images/mictwo.webp"
          alt="Professional studio microphone"
          width={200}
          height={300}
          className="object-contain w-full h-auto"
        />
      </motion.div>
    </section>
  );
}