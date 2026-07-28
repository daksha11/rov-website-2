"use client";

// Homepage conversion section: the only place on the homepage a visitor can
// actually start a conversation (the rest is case-study links + footer mailto).
// Dark espresso-gradient theme on the black homepage. The intake itself is a
// short guided questionnaire (StartProjectForm) that pre-qualifies the lead
// before we ever get on a call.

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import StartProjectForm from "@/components/sections/StartProjectForm";

export default function StartProjectSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="start-project"
      style={{
        background: "#000",
        padding: "clamp(56px, 9vw, 110px) clamp(16px, 5vw, 60px)",
      }}
    >
      <div ref={ref} style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 44px)" }}
        >
          <h2
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
              fontWeight: 400,
              color: "#FFF4E3",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Have something in mind?
            <br />
            <span style={{ fontStyle: "italic", color: "#EA9A61" }}>Let&apos;s build it.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
              color: "rgba(255,244,227,0.6)",
              lineHeight: 1.6,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Answer two quick questions and get an instant ballpark on cost and timeline. Your exact quote is always free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
        >
          <StartProjectForm />
        </motion.div>
      </div>
    </section>
  );
}
