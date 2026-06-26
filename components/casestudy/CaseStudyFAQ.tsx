"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQPageSchema } from "@/components/FAQPageSchema";

// Case-study FAQ — a full-width editorial band matching the testimonial style.
// Emits FAQPage structured data (AEO / featured snippets) AND keeps every answer
// in the DOM at all times (height-collapsed when closed), so the accordion is
// purely visual and crawlers / AI answer engines still read every answer.
// Optionally shows a named project-lead credit (E-E-A-T).

export function CaseStudyFAQ({
  faqs,
  accentColor = "#EA9A61",
  leadName,
  leadRole,
}: {
  faqs: { question: string; answer: string }[];
  accentColor?: string;
  leadName?: string;
  leadRole?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!faqs.length) return null;

  return (
    <section className="relative bg-black px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
      <FAQPageSchema faqs={faqs} />
      <div className="max-w-4xl mx-auto">
        <div className="pt-12 md:pt-16" style={{ borderTop: `1px solid ${accentColor}33` }}>
          <p
            className="text-[0.6875rem] md:text-xs uppercase mb-8 md:mb-10"
            style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: "0.22em", color: accentColor }}
          >
            Frequently asked
          </p>

          <dl className="m-0">
            {faqs.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={f.question}
                  className="border-b"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-5 md:py-6 text-left"
                    >
                      <span
                        className="text-lg md:text-2xl leading-snug transition-colors"
                        style={{ fontFamily: "Norwige, sans-serif", color: isOpen ? accentColor : "#FFF4E3" }}
                      >
                        {f.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="h-5 w-5 md:h-6 md:w-6" style={{ color: accentColor }} />
                      </motion.span>
                    </button>
                  </dt>

                  {/* Answer is always in the DOM (height-collapsed when closed). */}
                  <motion.dd
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="m-0 overflow-hidden"
                    style={{ willChange: "height, opacity" }}
                  >
                    <p
                      className="pb-6 pr-8 text-base md:text-lg leading-relaxed"
                      style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
                    >
                      {f.answer}
                    </p>
                  </motion.dd>
                </div>
              );
            })}
          </dl>

          {leadName ? (
            <p
              className="mt-12 text-sm md:text-base"
              style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
            >
              Project led by{" "}
              <a href="/about" className="hover:underline" style={{ color: accentColor }}>
                {leadName}
              </a>
              {leadRole ? `, ${leadRole}` : ""} at Range of View Studios.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
