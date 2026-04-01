"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const packages = [
  {
    name: "Property Showcase",
    price: 3000,
    tagline: "Sell the feeling before they walk through the door.",
    features: [
      "Cinematic walkthrough video",
      "Drone aerial footage",
      "15 professionally edited photos",
      "Agent intro clip",
      "5 social media assets",
      "MLS-ready photo package",
      "Fast turnaround",
    ],
  },
  {
    name: "Event Coverage",
    price: 4000,
    tagline: "Full-day capture. Same-day social previews. 7-day delivery.",
    features: [
      "Full event coverage (8 hours)",
      "Highlight reel (2-3 min)",
      "3 short clips for social",
      "30 edited photos",
      "Behind-the-scenes content",
      "Same-day social media preview",
      "7-day delivery",
    ],
  },
];

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export default function SpecialtyPackages() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="relative bg-black"
      style={{ padding: "0 clamp(16px, 5vw, 60px) clamp(60px, 8vw, 80px)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
          style={{ fontFamily: BODY }}
        >
          Specialty Packages
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-2xl md:text-3xl font-bold italic mb-8"
          style={{ fontFamily: HEADING }}
        >
          Industry-Specific
        </motion.h3>

        {/* Package cards — horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.15 + i * 0.1 }}
              className="rounded-2xl border border-[#EA9A61]/15 p-6 md:p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(234,154,97,0.04) 0%, transparent 60%)",
              }}
            >
              {/* Top: name + price */}
              <div className="flex items-baseline justify-between mb-2">
                <span
                  className="text-white text-lg font-bold italic"
                  style={{ fontFamily: HEADING }}
                >
                  {pkg.name}
                </span>
                <span
                  className="text-white text-2xl md:text-3xl font-bold italic"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(pkg.price)}
                </span>
              </div>

              <p
                className="text-white/30 text-xs italic mb-5"
                style={{ fontFamily: BODY }}
              >
                {pkg.tagline}
              </p>

              <div className="h-px w-full bg-white/[0.06] mb-5" />

              {/* Features in two columns on wider screens */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {pkg.features.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-white/50 text-sm"
                    style={{ fontFamily: BODY }}
                  >
                    <span className="text-[#EA9A61] mt-0.5 shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="https://calendly.com/rangeofviewmusic/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shine mt-6 block text-center text-white font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.03]"
                style={{
                  fontFamily: HEADING,
                  padding: "12px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Book a call &rarr;
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
