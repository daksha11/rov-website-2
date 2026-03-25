"use client";
import { motion, Variants } from "framer-motion";
import { Earth, MoveUpRight } from "lucide-react";


const BookACall = () => {
  const text: string[] = ["Let’s make it", "happen"];

  // Parent container type safe
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

  // Letter animation type safe
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
      className="relative text-center py-16 md:py-24 px-4 md:px-6 rounded-t-[50px] overflow-hidden"
    >
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover -z-10 rounded-t-[50px]">
        <source src="/assets/images/Untitled-6.mp4" type="video/mp4" />
      </video>
      {/* Top small text */}
      <motion.p
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
        style={{ fontFamily: "serif" }}
        className="italic font-semibold tracking-wider text-xl md:text-3xl text-[#2c2420] mb-4"
      >
        ( NEED AN UNFAIR ADVANTAGE? )
      </motion.p>

      {/* Letter by letter animation */}
      <motion.h2
        style={{ fontFamily: "sink" }}
        className="text-4xl  md:text-[120px] tracking-wider text-[#2c2420] mb-12 leading-none text-center"
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
      </motion.h2>

      <div className="flex justify-center">
        <a
          href="https://calendly.com/rangeofviewmusic/30min"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={{ fontFamily: "futura" }} className="relative overflow-hidden bg-[#393632] flex items-center justify-center cursor-pointer text-white rounded-full py-8 px-12 text-3xl font-semibold tracking-widest group">
            <span className="absolute inset-0 bg-[#bdbdb0]/30 origin-bottom scale-y-0 md:group-hover:scale-y-100 transition-transform duration-700 ease-in-out"></span>
            <span className="relative overflow-hidden flex items-center leading-none h-[1.2em]">
              <span className="block md:group-hover:-translate-y-full transition-transform duration-700 ease-in-out">
                Book a call
              </span>
              <span className="absolute left-0 top-full block md:group-hover:top-0 transition-all duration-700 ease-in-out">
                Book a call
              </span>
            </span>


            <span className="relative ml-2">
              <MoveUpRight size={25} />
            </span>
          </button>
        </a>
      </div>


      <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[#2c2420] font-semibold gap-4">

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="text-2xl flex items-center justify-center rounded-full border border-[#cfcfcf]">
            <Earth size={30} />
          </div>
          <div className="flex flex-col md:text-2xl text-lg">
            <span>Working Globally</span>
            <span className="h-1 border bg-[#2c2420]"></span>

            <span>Available July 25</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex flex-col md:text-2xl text-lg">
            <span>FOR FURTHER INQUIRIES </span><span><a
              href="mailto:rangeofview@rovstudios.com"
              className="hover:text-[#2c2420]/40 transition-colors duration-300"
            >↳ @rangeofviewstudios </a></span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BookACall;