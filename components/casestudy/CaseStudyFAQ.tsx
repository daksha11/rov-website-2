"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";

// Case-study FAQ — a full-width editorial band matching the testimonial style.
// Emits FAQPage structured data (AEO / featured snippets) AND keeps every answer
// in the DOM at all times (height-collapsed via a CSS grid-rows transition), so
// the accordion is purely visual and crawlers / AI answer engines still read
// every answer. Pure CSS collapse = no client-measured inline styles, so no
// hydration mismatch. Optionally shows a named project-lead credit (E-E-A-T).

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
                <div key={f.question} className="border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
                    >
                      <span
                        className="text-lg leading-snug transition-colors md:text-2xl"
                        style={{ fontFamily: "Norwige, sans-serif", color: isOpen ? accentColor : "#FFF4E3" }}
                      >
                        {f.question}
                      </span>
                      <ChevronDown
                        className="h-5 w-5 flex-shrink-0 transition-transform duration-200 md:h-6 md:w-6"
                        style={{ color: accentColor, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                  </dt>

                  {/* Answer stays in the DOM; collapsed with a CSS grid-rows transition. */}
                  <dd
                    className="m-0 grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pb-6 pr-8 text-base leading-relaxed md:text-lg"
                        style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
                      >
                        {f.answer}
                      </p>
                    </div>
                  </dd>
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
