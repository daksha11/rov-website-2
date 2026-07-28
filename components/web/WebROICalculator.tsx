"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function pct(val: number, min: number, max: number): number {
  return ((val - min) / (max - min)) * 100;
}

export default function WebROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [monthlyRevenue, setMonthlyRevenue] = useState(10000);
  const [marketingSpend, setMarketingSpend] = useState(2000);
  const [conversionLift, setConversionLift] = useState(1.5);

  const calc = useMemo(() => {
    const currentAnnual = monthlyRevenue * 12;
    const projectedAnnual = monthlyRevenue * conversionLift * 12;
    const additionalRevenue = projectedAnnual - currentAnnual;

    // Recommend tier based on marketing spend and revenue
    let tierName: string, tierPrice: number;
    if (monthlyRevenue <= 5000) {
      tierName = "Digital Storefront";
      tierPrice = 2000;
    } else if (monthlyRevenue <= 20000) {
      tierName = "Conversion Engine";
      tierPrice = 5000;
    } else {
      tierName = "Revenue Platform";
      tierPrice = 10000;
    }

    const paybackMonths =
      additionalRevenue > 0
        ? Math.max(1, Math.ceil(tierPrice / (additionalRevenue / 12)))
        : 0;

    return {
      tierName,
      tierPrice,
      currentAnnual,
      projectedAnnual,
      additionalRevenue,
      paybackMonths,
    };
  }, [monthlyRevenue, conversionLift]);

  return (
    <div
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(40px, 6vw, 60px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="max-w-5xl mx-auto rounded-2xl border border-white/[0.06] p-5 md:p-8"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {/* Header row */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              ROI Calculator
            </span>
            <h3
              className="text-xl md:text-2xl font-bold italic text-white mt-1"
              style={{ fontFamily: HEADING }}
            >
              See the Payback
            </h3>
          </div>
          {calc.paybackMonths > 0 && (
            <motion.div
              key={calc.paybackMonths}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="text-right hidden sm:block"
            >
              <span
                className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic block"
                style={{ fontFamily: HEADING }}
              >
                {calc.paybackMonths} mo
              </span>
              <span
                className="text-white/30 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.15em]"
                style={{ fontFamily: BODY }}
              >
                payback period
              </span>
            </motion.div>
          )}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Monthly revenue */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Current monthly website revenue</span>
              <span className="text-[#EA9A61] font-bold">
                {fmt(monthlyRevenue)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(monthlyRevenue, 0, 50000)}%, rgba(255,255,255,0.08) ${pct(monthlyRevenue, 0, 50000)}%)`,
              }}
            />
          </div>

          {/* Marketing spend */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Monthly marketing spend</span>
              <span className="text-[#EA9A61] font-bold">
                {fmt(marketingSpend)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={250}
              value={marketingSpend}
              onChange={(e) => setMarketingSpend(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(marketingSpend, 0, 10000)}%, rgba(255,255,255,0.08) ${pct(marketingSpend, 0, 10000)}%)`,
              }}
            />
          </div>

          {/* Conversion lift */}
          <div className="md:col-span-2">
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Expected conversion improvement</span>
              <span className="text-[#EA9A61] font-bold">
                {conversionLift.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={conversionLift}
              onChange={(e) => setConversionLift(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(conversionLift, 1, 3)}%, rgba(255,255,255,0.08) ${pct(conversionLift, 1, 3)}%)`,
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/25 block mb-1"
              style={{ fontFamily: BODY }}
            >
              Current annual revenue
            </span>
            <span
              className="text-white/40 text-xl md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.currentAnnual)}
              <span className="text-white/20 text-xs font-normal">/yr</span>
            </span>
          </div>
          <div>
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61] block mb-1"
              style={{ fontFamily: BODY }}
            >
              Projected with ROV site
            </span>
            <span
              className="text-white text-xl md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.projectedAnnual)}
              <span className="text-white/40 text-xs font-normal">/yr</span>
            </span>
          </div>
        </div>

        {/* Bottom row: payback + CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {calc.additionalRevenue > 0 ? (
              <>
                <motion.span
                  key={calc.paybackMonths}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic sm:hidden"
                  style={{ fontFamily: HEADING }}
                >
                  {calc.paybackMonths} mo
                </motion.span>
                <span
                  className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-2.5 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.12em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  +{fmt(calc.additionalRevenue)}/yr
                </span>
                <span
                  className="text-white/30 text-xs"
                  style={{ fontFamily: BODY }}
                >
                  Recommended:{" "}
                  <span className="text-white/60">
                    {calc.tierName} ({fmt(calc.tierPrice)})
                  </span>
                </span>
              </>
            ) : (
              <span
                className="text-white/40 text-xs"
                style={{ fontFamily: BODY }}
              >
                Adjust sliders to see your projected ROI.
              </span>
            )}
          </div>

          <a
            href="https://cal.com/rov-studios-imhphw/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine shrink-0 inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background:
                "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow:
                "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "12px 24px",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            Book a call &rarr;
          </a>
        </div>
      </motion.div>
    </div>
  );
}
