"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface BlogFAQProps {
  faqs: { question: string; answer: string }[];
}

export function BlogFAQ({ faqs }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-black py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[720px] mx-auto">
        <h2
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-10"
          style={{
            fontFamily: "Norwige, sans-serif",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            color: "#FFF4E3",
          }}
        >
          FAQ
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border overflow-hidden transition-all duration-300"
                style={{
                  borderRadius: "20px",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  background: "rgba(59, 33, 20, 0.35)",
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left px-6 md:px-8 py-5 md:py-6 cursor-pointer group"
                >
                  <span
                    className="text-base md:text-lg lg:text-xl font-medium pr-4"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      color: "#FFF4E3",
                    }}
                  >
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className="w-6 h-6 md:w-7 md:h-7"
                      style={{ color: isOpen ? "#957E5E" : "#FFF4E3" }}
                    />
                  </motion.div>
                </button>

                {/* Answer is always rendered (height-collapsed when closed) so it
                    sits in the server-rendered DOM for crawlers and AI answer
                    engines, not only after a click. */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden", willChange: "height, opacity" }}
                >
                  <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                    <p
                      className="text-base md:text-lg lg:text-xl leading-relaxed"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        color: "#FFF4E3",
                        opacity: 0.85,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
