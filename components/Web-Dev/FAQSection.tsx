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
    title: "DISCOVER / I",
    items: [
      {
        question: "Discovery Deep-Dive",
        answer: "We run a deep analysis of your needs and project goals.",
      },
      {
        question: "Strategic Alignment",
        answer: "We align our strategies with your business objectives.",
      },
      {
        question: "Creative Briefing",
        answer: "We define the creative direction together.",
      },
      {
        question: "Team Calibration",
        answer: "We bring the right team members to collaborate with you.",
      },
    ],
  },
  {
    title: "DESIGN / II",
    items: [
      { question: "Concept Development", answer: "We sketch and propose creative concepts." },
      { question: "Design Iteration", answer: "We refine the designs based on your feedback." },
      { question: "Technical Build", answer: "We prepare designs for smooth development handoff." },
      { question: "Quality Assurance", answer: "We test everything visually and technically." },
    ],
  },
  {
    title: "DEVELOP / III",
    items: [
      { question: "Frontend Architecture", answer: "We set up scalable frontend structures." },
      { question: "Backend API", answer: "We build APIs and integrate with services." },
      { question: "Testing", answer: "We ensure everything is working with automated/manual tests." },
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
      className="relative z-[100] rounded-t-[50px] w-full min-h-screen h-auto py-10 px-6 flex flex-col items-center overflow-hidden"
    >
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-center -z-10 rounded-t-[50px]">
        <source src="/assets/images/5th.mp4" type="video/mp4" />
      </video>
      <div className="max-w-6xl w-full space-y-20">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="md:h-[60vh]">
            {/* Section Title */}
            <h2
              className="text-[38px] md:text-[68px] tracking-wide uppercase mb-8 text-[#2f2621]"
              style={{fontFamily: "anton"}}
            >
              {step.title}
            </h2>

            {/* FAQ Items */}
            <div style={{fontFamily: "futura"}}>
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
                      onClick={() => toggle(id)}
                      className={`w-full flex justify-between items-center text-left text-2xl tracking-wide px-3 py-4 cursor-pointer 
                        group-hover:bg-[#2f2621] group-hover:text-white transition-colors 
                        ${isOpen ? "bg-[#2f2621] text-white" : ""}`}
                      style={{fontFamily: "futura"}}
                    >
                      {item.question}
                      <span className="ml-4 text-2xl">
                        {isOpen ? <ArrowUpRight size={26} /> : <ArrowDownLeft size={26} />}
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
                          <p
                            className="text-2xl leading-relaxed futura"
                          >
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