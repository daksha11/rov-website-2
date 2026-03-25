"use client"
import { motion } from "framer-motion";

export default function Transformation() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-14 text-[#ffffff] overflow-hidden font-['Poppins'] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background/servicebg.webp')" }} 
    >
      {/* Overlay (optional) */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative space-y-20 lg:space-y-36 w-full">
        {/* Top Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            The architects of your transformation.
          </h1>
        </div>

        {/* Divider */}
         <motion.div
          className="w-full h-[4px] bg-[#ffffff]  origin-center"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false }}
        />

        {/* Banner Text */}
        <div className="text-center leading-tight">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium">
            Meet the dreamers, builders, and sound-shapers <br className="hidden sm:block" />
            who make every detail dance together.
          </h1>
        </div>
      </div>
    </section>
  );
}