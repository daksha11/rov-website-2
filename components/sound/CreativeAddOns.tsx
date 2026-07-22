"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { checkoutHref, CONTACT_EMAIL } from "@/data/soundPricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const ILLO_STROKE = "#EA9A61";

// Cover Art — square frame with a paint-stroke splash
const CoverArtIllo = (
  <svg viewBox="0 0 96 96" fill="none" stroke={ILLO_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="14" y="14" width="68" height="68" rx="4" />
    <path d="M26 62 Q36 36 48 50 T74 38" strokeWidth="2.75" />
    <circle cx="64" cy="28" r="4" fill={ILLO_STROKE} fillOpacity="0.2" />
    <circle cx="64" cy="28" r="4" />
  </svg>
);

// Lyric Visualizer — monitor frame with waveform
const VisualizerIllo = (
  <svg viewBox="0 0 96 96" fill="none" stroke={ILLO_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="18" width="76" height="52" rx="3" />
    <line x1="26" y1="78" x2="70" y2="78" strokeWidth="2.5" />
    <line x1="34" y1="30" x2="34" y2="58" strokeWidth="2.5" />
    <line x1="46" y1="34" x2="46" y2="54" strokeWidth="2.5" />
    <line x1="58" y1="28" x2="58" y2="60" strokeWidth="2.5" />
  </svg>
);

// Merch Design — t-shirt with a print graphic
const MerchIllo = (
  <svg viewBox="0 0 96 96" fill="none" stroke={ILLO_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 20 L38 14 Q48 22 58 14 L66 20 L78 28 L70 40 L64 36 L64 80 L32 80 L32 36 L26 40 L18 28 Z" />
    <circle cx="48" cy="52" r="8" />
    <path d="M42 52 L48 58 L54 46" strokeWidth="2.5" />
  </svg>
);

interface MenuItem {
  key: string;
  name: string;
  description: string;
  plan: number;
  standalone: number;
  turnaround: string;
  icon: React.ReactNode;
}

const MENU: MenuItem[] = [
  {
    key: "cover",
    name: "Cover Art",
    description: "Release-ready square artwork for streaming and social.",
    plan: 50,
    standalone: 75,
    turnaround: "3-5 days",
    icon: CoverArtIllo,
  },
  {
    key: "visualizer",
    name: "Lyric Visualizer",
    description: "Social-cut video with synced lyrics for Reels and TikTok.",
    plan: 40,
    standalone: 60,
    turnaround: "5-7 days",
    icon: VisualizerIllo,
  },
  {
    key: "merch",
    name: "Merch Design",
    description: "Print-ready graphic for tees, hoodies, and posters.",
    plan: 65,
    standalone: 95,
    turnaround: "3-5 days",
    icon: MerchIllo,
  },
];

export default function CreativeAddOns() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Restaurant-menu style: tap items to add them to your order.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const order = useMemo(() => {
    const items = MENU.filter((m) => selected.has(m.key));
    const standaloneTotal = items.reduce((s, m) => s + m.standalone, 0);
    const planTotal = items.reduce((s, m) => s + m.plan, 0);
    return { items, standaloneTotal, planTotal, save: standaloneTotal - planTotal };
  }, [selected]);

  // Compile the picked sides into one pre-filled email order.
  const orderHref = useMemo(() => {
    if (order.items.length === 0) return checkoutHref("addon_cover");
    const lines = order.items
      .map((m) => `- ${m.name}: $${m.standalone} (or $${m.plan} on a mix plan)`)
      .join("\n");
    const subject = encodeURIComponent("Add-on order");
    const body = encodeURIComponent(
      `I'd like to order these add-ons:\n${lines}\n\nStandalone total: $${order.standaloneTotal}\nOn a mix & master plan: $${order.planTotal}\n\nMy release: \nNotes: `
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }, [order]);

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}
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
          Creative Add-Ons
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl font-bold italic mb-3"
          style={{ fontFamily: HEADING }}
        >
          Build your release
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="text-white/50 text-sm md:text-base mb-12 max-w-xl leading-relaxed"
          style={{ fontFamily: BODY }}
        >
          Pick your sides. Menu prices are standalone. On a mix &amp; master plan, every one is cheaper.
        </motion.p>

        {/* Menu (left) + Order (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 lg:gap-14 items-start">
          {/* ── The menu ── */}
          <div>
            {MENU.map((m, i) => {
              const isSel = selected.has(m.key);
              return (
                <motion.button
                  key={m.key}
                  type="button"
                  onClick={() => toggle(m.key)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ ...spring, delay: 0.2 + i * 0.07 }}
                  aria-pressed={isSel}
                  className="group w-full flex items-center gap-4 md:gap-5 py-5 border-b border-white/[0.08] text-left transition-colors first:border-t"
                >
                  {/* Add / added indicator */}
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSel
                        ? "bg-[#EA9A61] text-black"
                        : "border border-white/20 text-white/50 group-hover:border-[#EA9A61]/60 group-hover:text-[#EA9A61]"
                    }`}
                  >
                    {isSel ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </span>

                  {/* Small icon */}
                  <span className="shrink-0 w-6 h-6 opacity-70" aria-hidden="true">
                    {m.icon}
                  </span>

                  {/* Name + desc */}
                  <span className="flex-1 min-w-0">
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className="text-white text-lg md:text-xl font-bold italic truncate"
                        style={{ fontFamily: HEADING }}
                      >
                        {m.name}
                      </span>
                      <span className="flex items-baseline gap-1.5 shrink-0">
                        <span className="text-white text-lg md:text-xl font-bold italic" style={{ fontFamily: HEADING }}>
                          ${m.standalone}
                        </span>
                        <span className="text-[#EA9A61] text-[11px]" style={{ fontFamily: BODY }}>
                          / ${m.plan} plan
                        </span>
                      </span>
                    </span>
                    <span className="flex items-baseline justify-between gap-3 mt-0.5">
                      <span className="text-white/45 text-xs truncate" style={{ fontFamily: BODY }}>
                        {m.description}
                      </span>
                      <span className="text-white/35 text-[11px] shrink-0" style={{ fontFamily: BODY }}>
                        {m.turnaround}
                      </span>
                    </span>
                  </span>
                </motion.button>
              );
            })}

            {/* Combo — the works */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.45 }}
              className="mt-6 rounded-2xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.04] p-5 flex items-center justify-between gap-4 flex-wrap"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-lg font-bold italic" style={{ fontFamily: HEADING }}>
                    The Works
                  </span>
                  <span className="rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-[#EA9A61]" style={{ fontFamily: BODY }}>
                    Combo
                  </span>
                </div>
                <p className="text-white/50 text-xs" style={{ fontFamily: BODY }}>
                  2 covers, 2 visualizers, 1 merch every month. <span className="text-[#EA9A61]">Save $120/mo.</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-2xl font-bold italic" style={{ fontFamily: HEADING }}>
                  $125<span className="text-white/40 text-sm">/mo</span>
                </span>
                <a
                  href={checkoutHref("creative_pack")}
                  className="cta-shine text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.04] cursor-pointer"
                  style={{
                    fontFamily: HEADING,
                    padding: "10px 22px",
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                    boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Add combo &rarr;
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── Your order ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-7 lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-white text-xl font-bold italic" style={{ fontFamily: HEADING }}>
                Your order
              </h4>
              {order.items.length > 0 && (
                <span className="text-white/40 text-xs" style={{ fontFamily: BODY }}>
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {order.items.length === 0 ? (
              <p className="text-white/40 text-sm py-8 text-center" style={{ fontFamily: BODY }}>
                Tap a side on the menu to start your order.
              </p>
            ) : (
              <>
                <ul className="space-y-3 mb-5">
                  {order.items.map((m) => (
                    <li key={m.key} className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggle(m.key)}
                        className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors cursor-pointer"
                        style={{ fontFamily: BODY }}
                        aria-label={`Remove ${m.name}`}
                      >
                        <span className="text-white/30 hover:text-[#EA9A61]">&times;</span>
                        {m.name}
                      </button>
                      <span className="text-white/70 text-sm tabular-nums" style={{ fontFamily: BODY }}>
                        ${m.standalone}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="h-px w-full bg-white/[0.08] mb-4" />

                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-white/50 text-sm" style={{ fontFamily: BODY }}>Subtotal</span>
                  <span className="text-white text-2xl font-bold italic tabular-nums" style={{ fontFamily: HEADING }}>
                    ${order.standaloneTotal}
                  </span>
                </div>
                <p className="text-[#EA9A61] text-xs mb-5" style={{ fontFamily: BODY }}>
                  ${order.planTotal} on a mix &amp; master plan &middot; save ${order.save}
                </p>

                <a
                  href={orderHref}
                  className="cta-shine block text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
                  style={{
                    fontFamily: HEADING,
                    padding: "14px",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                    boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Send this order &rarr;
                </a>
              </>
            )}

            <p className="text-white/30 text-[11px] mt-5 leading-relaxed" style={{ fontFamily: BODY }}>
              Menu prices are standalone. Every side is cheaper on a mix &amp; master plan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
