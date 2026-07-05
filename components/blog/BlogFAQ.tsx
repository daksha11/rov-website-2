"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface BlogFAQProps {
  faqs: { question: string; answer: string }[];
}

export function BlogFAQ({ faqs }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" style={{ background: "#FFF4E3", padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ paddingTop: 48, borderTop: "1px solid rgba(59,33,20,0.12)" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#B16937",
              marginBottom: 32,
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 700,
            }}
          >
            Frequently asked
          </p>
          <dl style={{ margin: 0 }}>
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} style={{ borderBottom: "1px solid rgba(59,33,20,0.1)" }}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        padding: "20px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Norwige, sans-serif",
                          fontSize: "clamp(17px, 2.5vw, 22px)",
                          lineHeight: 1.3,
                          color: isOpen ? "#90422C" : "#3B2114",
                          transition: "color 0.15s",
                          fontWeight: 700,
                        }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        style={{
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          color: "#EA9A61",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s ease-out",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          paddingBottom: 20,
                          paddingRight: 32,
                          fontSize: 16,
                          lineHeight: 1.75,
                          color: "rgba(59,33,20,0.7)",
                          fontFamily: "Inter, -apple-system, sans-serif",
                          margin: 0,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
