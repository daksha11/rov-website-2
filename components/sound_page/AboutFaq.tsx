"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type Step = {
  title: string;
  items: FaqItem[];
};

const steps: Step[] = [
  {
    title: "FAQ",
    items: [
      { question: "How long does music mixing and mastering take?", answer: "We run a deep analysis of your needs and project goals." },
      { question: "What file formats do you need for music mixing services?", answer: "We align our strategies with your business objectives." },
      { question: "What's included in your music mastering services?", answer: "We define the creative direction together." },
      { question: "Can you mix music recorded at home or in a bedroom studio?", answer: "We bring the right team members to collaborate with you." },
    ],
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpen(open === id ? null : id);
  };

  return (
    <section
      style={{
        backgroundImage: "url('/assets/background/faqbg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative rounded-t-[50px] -mt-[32px] w-full py-20 px-6 flex flex-col items-center"
    >
      {/* Overlay div */}
      <div className="absolute inset-0 bg-[#1a0e0b] opacity-90 rounded-t-[50px]" />

      {/* Content */}
      <div className="relative max-w-6xl w-full space-y-20">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="md:h-[60vh] mb-8">
            <h2 style={{ fontFamily: 'anton' }} className="text-[38px] md:text-[68px] tracking-wide uppercase mb-8 text-[#ccc4bd]">
              {step.title}
            </h2>

            <div>
              {step.items.map((item, itemIndex) => {
                const id = `${stepIndex}-${itemIndex}`;
                const isOpen = open === id;

                return (
                  <motion.div
                    key={id}
                    initial={false}
                    animate={{
                      backgroundColor: isOpen ? "#ccc4bd" : "transparent",
                      color: isOpen ? "#1a0e0b" : "#ccc4bd",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-b-4 border-[#ccc4bd] overflow-hidden group cursor-pointer"
                  >
                    <button
                      style={{ fontFamily: 'futura' }}
                      onClick={() => toggle(id)}
                      className={`w-full flex justify-between items-center text-left text-[23px] tracking-wide px-3 py-4 cursor-pointer 
                    group-hover:bg-[#ccc4bd] group-hover:text-[#1a0e0b] transition-colors 
                    ${isOpen ? "bg-[#ccc4bd] text-[#1a0e0b]" : ""}`}
                    >
                      {item.question}
                      <span className="ml-4 text-2xl">
                        {isOpen ? (
                          <ArrowUpRight size={26} />
                        ) : (
                          <ArrowDownLeft size={26} />
                        )}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="px-2 pb-4"
                        >
                          <p style={{ fontFamily: 'futura' }} className="text-[23px] leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}