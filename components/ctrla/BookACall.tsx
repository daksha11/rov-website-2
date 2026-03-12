"use client";
import { motion, Variants } from "framer-motion";
import { Earth, MoveUpRight } from "lucide-react";
import { useState } from "react";
import BookingModal from "../Web-Dev/BookingModal";

const BookACall = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            className="relative bg-[#872e2a] text-center py-16 md:pt-24 pb-10  px-4 md:px-6 "
            style={{
                backgroundImage: "url('/assets/background/new9.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Top small text */}
            <motion.p
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false }}
                style={{ fontFamily: "serif" }}
                className="italic font-semibold tracking-wider text-xl md:text-3xl text-[#e5cebb] mb-4"
            >
                ( NEED AN UNFAIR ADVANTAGE? )
            </motion.p>

            {/* Letter by letter animation */}
            <motion.h2
                style={{ fontFamily: "sink" }}
                className="text-4xl  md:text-[120px] tracking-wider text-[#e5cebb] mb-12 leading-none text-center"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
            >
                {text.map((line, lineIndex) => (
                    <div key={lineIndex} className="flex justify-center flex-wrap">
                        {line?.split("").map((char, i) => (
                            <motion.span key={i} variants={letter}>
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </div>
                ))}
            </motion.h2>

            <div className="flex justify-center">
                <button style={{ fontFamily: "futura" }} onMouseOver={() => setIsModalOpen(true)} className="relative overflow-hidden bg-[#3d2e2e] flex items-center justify-center cursor-pointer text-white rounded-full py-8 px-12 text-3xl font-semibold tracking-widest group">
                    <span className="relative overflow-hidden flex items-center leading-none h-[1.2em]">
                        <span className="block group-hover:-translate-y-full transition-transform duration-700 ease-in-out">
                            Book a call
                        </span>
                    </span>
                    <span className="relative ml-2">
                        <MoveUpRight size={25} />
                    </span>
                </button>
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[#e5cebb] font-semibold gap-4">

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                    <div className="text-2xl flex items-center justify-center rounded-full border border-[#e5cebb]">
                        <Earth size={30} />
                    </div>
                    <div className="flex flex-col md:text-2xl text-lg">
                        <span>Working Globally</span>
                        <span className="h-1  bg-[#e5cebb]"></span>
                        <span>Available July 25</span>
                    </div>
                </div>

                <div className="mt-4 md:mt-0">
                    <div className="flex flex-col md:text-2xl text-lg">
                        <span>FOR FURTHER INQUIRIES </span>
                        <span>
                            <a href="mailto:@rangeofviewstudios"
                                className="hover:text-[#e5cebb]/40 transition-colors duration-300"
                            >↳ @rangeofviewstudios </a>
                        </span>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};

export default BookACall;