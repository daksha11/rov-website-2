"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { IndustryFaq } from "@/lib/types";
import { HEADING, BODY, CREAM, DEEP, EMBER, EMBER_LIGHT } from "./shared";

/**
 * FAQ accordion — cream bg, Norwige-bold questions, chevron. Keyboard operable
 * (native <button>), visible Ember focus ring. Mirrors BlogFAQ's interaction
 * but Norwige/Roboto only.
 */
export function IndustryFAQ({ faqs }: { faqs: IndustryFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" style={{ background: CREAM, padding: "clamp(24px, 5vw, 48px) 24px clamp(48px, 8vw, 72px)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ paddingTop: 48, borderTop: "1px solid rgba(59,33,20,0.12)" }}>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: EMBER_LIGHT,
              marginBottom: 28,
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
                      className="icp-faq-btn"
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        padding: "20px 4px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: HEADING,
                          fontWeight: 700,
                          fontSize: "clamp(17px, 2.5vw, 21px)",
                          lineHeight: 1.3,
                          color: isOpen ? EMBER : DEEP,
                          transition: "color 0.15s",
                        }}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        style={{
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          color: EMBER_LIGHT,
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
                          fontFamily: BODY,
                          fontWeight: 300,
                          fontSize: 16,
                          lineHeight: 1.75,
                          color: "rgba(59,33,20,0.72)",
                          margin: 0,
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-faq-btn:focus-visible {
          outline: 2px solid #90422C;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `,
        }}
      />
    </section>
  );
}
