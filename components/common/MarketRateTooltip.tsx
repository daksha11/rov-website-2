"use client";

import { useState, useRef, useEffect } from "react";

const BODY = "'Roboto', sans-serif";

export interface MarketSource {
  name: string;
  url: string;
  detail: string;
}

interface MarketRateTooltipProps {
  children: React.ReactNode;
  sources: MarketSource[];
}

export default function MarketRateTooltip({
  children,
  sources,
}: MarketRateTooltipProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center gap-1 cursor-help"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="text-white/25 hover:text-white/50 transition-colors shrink-0"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="8"
          y="12"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontFamily={BODY}
          fontWeight="600"
        >
          i
        </text>
      </svg>

      {open && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-[320px] rounded-xl border border-white/10 bg-[#141414] shadow-2xl p-4"
          style={{ fontFamily: BODY }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Arrow */}
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#141414] border-r border-b border-white/10" />

          <span className="block text-white/60 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.15em] font-semibold mb-3">
            Sources
          </span>

          <span className="block space-y-2.5">
            {sources.map((s) => (
              <span key={s.url} className="block">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EA9A61] text-xs font-medium hover:underline"
                >
                  {s.name} ↗
                </a>
                <span className="block text-[clamp(0.7rem,1.5vw,0.75rem)] leading-snug mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.detail}
                </span>
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}
