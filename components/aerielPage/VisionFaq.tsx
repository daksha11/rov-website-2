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
  { 
    question: "Is it legal?", 
    answer: "Yes, everything we do follows industry standards and complies with local and international regulations." 
  },
  { 
    question: "How will this help me?", 
    answer: "It saves you time, reduces risks, and gives you professional results that directly support your goals." 
  },
  { 
    question: "Can I do this myself?", 
    answer: "Some parts you can, but working with us ensures expert guidance, faster execution, and higher-quality outcomes." 
  },
  { 
    question: "What is our thing?", 
    answer: "Our thing is creating tailored solutions with a team that understands your needs and delivers measurable results." 
  },
]
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpen(open === id ? null : id);
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-6 flex flex-col items-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-bottom -z-10">
        <source src="/assets/images/5th.mp4" type="video/mp4" />
      </video>
     
      <div className="max-w-6xl w-full space-y-20">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className=" md:h-[60vh]  ">
            {/* Section Title */}
            <h2 style={{fontFamily:'anton'}} className="text-[38px] md:text-[68px]  tracking-wide uppercase mb-8 text-[#2f2621]">
              {step.title}
            </h2>

            {/* FAQ Items */}
            <div>
              {step.items.map((item, itemIndex) => {
                const id = `${stepIndex}-${itemIndex}`;
                const isOpen = open === id;

                return (
                  <motion.div
                    key={id}
                    initial={false}
                    animate={{
                      backgroundColor: isOpen ? "#2f2621" : "transparent",
                      color: isOpen ? "#ffffff" : "#2f2621",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-b-4 border-[#2f2621] overflow-hidden group cursor-pointer"
                  >
                    <button
                    style={{fontFamily:'futura'}}
                      onClick={() => toggle(id)}
                      className={`w-full flex justify-between items-center text-left  text-[20px] tracking-wide px-3 py-4 cursor-pointer 
                        group-hover:bg-[#2f2621] group-hover:text-white transition-colors 
                        ${isOpen ? "bg-[#2f2621] text-white" : ""}`}
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
                          <p style={{fontFamily:'futura'}} className="text-[19px]  leading-relaxed">
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