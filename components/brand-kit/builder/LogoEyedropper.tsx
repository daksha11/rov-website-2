"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { pickPixelFromLogo } from "@/lib/brand-kit/utils/logoColors";

export default function LogoEyedropper({
  src,
  open,
  onClose,
  onPick,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
  onPick: (hex: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [bg, setBg] = useState<"checker" | "light" | "dark">("checker");
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    hex: string | null;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sample = async (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return null;
    return pickPixelFromLogo(src, nx, ny);
  };

  const handleMove = async (e: React.MouseEvent<HTMLDivElement>) => {
    const hex = await sample(e);
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      hex,
    });
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const hex = await sample(e);
    if (hex) {
      onPick(hex);
      onClose();
    }
  };

  const bgStyle =
    bg === "checker"
      ? {
          background:
            "repeating-conic-gradient(rgba(240,230,224,0.06) 0% 25%, transparent 0% 50%) 50% / 16px 16px",
        }
      : bg === "light"
      ? { background: "#FFFFFF" }
      : { background: "#1a1a1a" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,8,32,0.78)] backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-[rgba(240,230,224,0.18)] bg-[#1B0E2E] shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(240,230,224,0.1)]">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 font-semibold">
                  Eyedropper
                </p>
                <p className="text-sm text-[#F0E6E0] mt-0.5">
                  Click any pixel to sample
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 rounded-full p-1 bg-[rgba(240,230,224,0.06)] border border-[rgba(240,230,224,0.12)]">
                  {(["checker", "light", "dark"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBg(opt)}
                      className={`px-2.5 py-1 text-[9px] tracking-[0.18em] uppercase rounded-full transition-all ${
                        bg === opt
                          ? "bg-[#F0E6E0] text-[#24123A] font-semibold"
                          : "text-[#F0E6E0]/55 hover:text-[#F0E6E0]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close eyedropper"
                  className="size-8 rounded-full flex items-center justify-center text-[#F0E6E0]/60 hover:text-[#F0E6E0] hover:bg-[rgba(240,230,224,0.08)] transition-all"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              className="relative flex items-center justify-center p-8 min-h-[360px] cursor-crosshair"
              style={bgStyle}
              onMouseMove={handleMove}
              onMouseLeave={() => setHover(null)}
              onClick={handleClick}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt="Logo"
                draggable={false}
                className="max-w-full max-h-[400px] object-contain pointer-events-none select-none"
              />
              {hover && hover.hex && (
                <div
                  className="absolute pointer-events-none flex items-center gap-2 rounded-full px-2.5 py-1.5 bg-[rgba(15,8,32,0.92)] border border-[rgba(240,230,224,0.25)] shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                  style={{
                    left: hover.x + 16,
                    top: hover.y + 16,
                  }}
                >
                  <span
                    className="size-4 rounded-full border border-[rgba(240,230,224,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    style={{ background: hover.hex }}
                  />
                  <code className="text-[11px] font-mono text-[#F0E6E0] tracking-wide">
                    {hover.hex}
                  </code>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[rgba(240,230,224,0.1)] text-[10px] text-[#F0E6E0]/50 tracking-wide">
              Esc to cancel · Transparent pixels are skipped
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
