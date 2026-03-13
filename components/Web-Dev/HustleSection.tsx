"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

export default function HustleSection() {
  return (
    <section className="bg-[#110808] rounded-t-[50px]  -mt-[35px] relative z-50 text-white pt-8">
      <div className="mx-auto grid grid-cols-12 items-center  gap-4">

        {/* Left Side - Hand + Mic */}
        <div className="col-span-12 md:col-span-6 flex flex-col md:items-start items-center gap-6">
          {/* Hand */}
          <div className="relative    w-60 sm:w-80 lg:w-[500px] h-32 sm:h-44 md:h-[230px] overflow-hidden animate-[float-x_3s_ease-in-out_infinite]">
            <motion.div
              initial={{ x: "-100%" }}
              whileInView={{ x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: false }}
              className="relative w-full h-full"
            >
              <Image
                src="/assets/images/hand.png"
                alt="Creative hand illustration for web development"
                fill
                className="object-cover h-full w-full"
                priority
              />
            </motion.div>
          </div>

          <div className=" relative w-48 lg:w-[300px] h-32 md:h-[255px] ml-0 md:ml-10 lg:ml-62 animate-[float_3s_ease-in-out_infinite]">
            <Image
              src={"/assets/images/micnew.webp"}
              alt="Microphone illustration representing creative production"
              fill
              className="object-contain h-[120px] w-[200px] "
              priority
            />
          </div>
        </div>

        {/* Right Side - Text */}
        <div className="col-span-12 md:col-span-6 text-center md:text-left">
          <motion.h2
            style={{ fontFamily: "sink" }}
            className="text-5xl md:text-6xl  lg:text-[120px] leading-snug"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            We’re Built for <br /> the
            <motion.span
              style={{ textShadow: "2px 2px 4px rgba(255,255,255,0.9)" }}
              className="text-[#f9e2b6] ml-2 md:ml-3 inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: false }}
            >
              <TypeAnimation
                sequence={["HUSTLE ! ", 2000, "", 500]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ display: "inline-block" }}
              />
            </motion.span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}