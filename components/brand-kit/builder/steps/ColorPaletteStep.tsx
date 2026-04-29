"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex, hexToHsva, type HsvaColor } from "@uiw/color-convert";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowDown, Wand2, Pipette, Sparkles } from "lucide-react";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { cn } from "@/lib/utils";
import {
  hexToOklch,
  oklchToHex,
  getContrastRatio,
  wcagGrade,
  type OklchColor,
} from "@/lib/brand-kit/utils/colorUtils";
import { extractDominantColors } from "@/lib/brand-kit/utils/logoColors";
import LogoEyedropper from "@/components/brand-kit/builder/LogoEyedropper";
import { useToast } from "@/hooks/brand-kit/useToast";

type Mode = "assisted" | "manual";
type Harmony =
  | "complementary"
  | "monochromatic"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "split-complementary";

type PaletteSwatch = { hex: string; gamutClipped: boolean };

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
const mod360 = (h: number) => ((h % 360) + 360) % 360;

function buildRoles(baseOk: OklchColor): {
  primary: OklchColor;
  secondary: OklchColor;
  tertiary: OklchColor;
  neutral: OklchColor;
} {
  const primary: OklchColor = {
    l: clamp(baseOk.l, 0.42, 0.58),
    c: clamp(baseOk.c, 0.12, 0.2),
    h: baseOk.h,
  };
  const secondary: OklchColor = {
    l: Math.min(primary.l + 0.18, 0.85),
    c: primary.c * 0.55,
    h: baseOk.h,
  };
  const tertiary: OklchColor = {
    l: primary.l + 0.08,
    c: primary.c * 0.45,
    h: mod360(baseOk.h + 30),
  };
  const neutral: OklchColor = {
    l: 0.93,
    c: 0.018,
    h: baseOk.h,
  };
  return { primary, secondary, tertiary, neutral };
}

function generatePalette(baseHex: string, harmony: Harmony): PaletteSwatch[] {
  try {
    const baseOk = hexToOklch(baseHex);
    const { primary, secondary, tertiary, neutral } = buildRoles(baseOk);

    const accentAt = (hueOffset: number, chromaBoost = 1.15): OklchColor => ({
      l: primary.l + 0.05,
      c: primary.c * chromaBoost,
      h: mod360(baseOk.h + hueOffset),
    });

    let roles: OklchColor[];
    switch (harmony) {
      case "complementary":
        roles = [primary, secondary, tertiary, accentAt(180), neutral];
        break;
      case "monochromatic":
        roles = [0.3, 0.45, 0.6, 0.75, 0.9].map((l) => ({
          l,
          c: clamp(baseOk.c, 0.04, 0.18) * (l > 0.85 ? 0.25 : 1),
          h: baseOk.h,
        }));
        break;
      case "analogous":
        roles = [-60, -30, 0, 30, 60].map((offset) => ({
          l: clamp(baseOk.l, 0.45, 0.7),
          c: clamp(baseOk.c, 0.08, 0.18),
          h: mod360(baseOk.h + offset),
        }));
        break;
      case "triadic":
        roles = [primary, secondary, accentAt(120, 1.0), accentAt(240, 1.0), neutral];
        break;
      case "tetradic":
        roles = [primary, accentAt(90, 1.0), neutral, accentAt(180, 1.1), accentAt(270, 1.0)];
        break;
      case "split-complementary":
        roles = [primary, secondary, tertiary, accentAt(150), accentAt(210), neutral];
        break;
    }

    return roles.map((ok) => oklchToHex(ok));
  } catch {
    const count = harmony === "split-complementary" ? 6 : 5;
    return Array.from({ length: count }, () => ({ hex: "#000000", gamutClipped: false }));
  }
}

const HarmonyIcon = ({ type }: { type: Harmony }) => {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
  };

  switch (type) {
    case "complementary":
      return (
        <svg {...props}>
          <circle cx="7" cy="12" r="3.5" />
          <circle cx="17" cy="12" r="3.5" />
          <line x1="10.5" y1="12" x2="13.5" y2="12" />
        </svg>
      );
    case "monochromatic":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" opacity="0.3" />
          <circle cx="12" cy="12" r="5.5" opacity="0.6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "analogous":
      return (
        <svg {...props}>
          <circle cx="5" cy="13" r="2.5" />
          <circle cx="12" cy="9" r="2.5" />
          <circle cx="19" cy="13" r="2.5" />
        </svg>
      );
    case "triadic":
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="5.5" cy="17" r="2.5" />
          <circle cx="18.5" cy="17" r="2.5" />
        </svg>
      );
    case "tetradic":
      return (
        <svg {...props}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
        </svg>
      );
    case "split-complementary":
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <line x1="12" y1="7.5" x2="8" y2="15.5" />
          <line x1="12" y1="7.5" x2="16" y2="15.5" />
        </svg>
      );
  }
};

const ROLE_LABELS_5 = ["Primary", "Secondary", "Tertiary", "Accent", "Neutral"];
const ROLE_LABELS_SPLIT = ["Primary", "Secondary", "Tertiary", "Accent", "Accent 2", "Neutral"];
const getRoleLabels = (harmony: Harmony) =>
  harmony === "split-complementary" ? ROLE_LABELS_SPLIT : ROLE_LABELS_5;

const HARMONIES: { id: Harmony; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "split-complementary", label: "Split-Comp." },
  { id: "monochromatic", label: "Monochromatic" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "tetradic", label: "Tetradic" },
];

export default function ColorPaletteStep() {
  const storeSwatches = useBrandKitStore((s) => s.data.colors.swatches);
  const reorderColors = useBrandKitStore((s) => s.reorderColors);
  const firstLogo = useBrandKitStore((s) => s.data.logos.variants[0]);
  const pushToast = useToast((s) => s.push);

  const [mode, setMode] = useState<Mode>("assisted");
  const [baseColor, setBaseColor] = useState<string>("#EA9A61");
  const [hsva, setHsva] = useState<HsvaColor>(hexToHsva("#EA9A61"));
  const [harmony, setHarmony] = useState<Harmony>("complementary");
  const [eyedropperOpen, setEyedropperOpen] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [manualColors, setManualColors] = useState<string[]>(["", "", "", "", ""]);

  const [paletteSlots, setPaletteSlots] = useState<string[]>(() =>
    Array(ROLE_LABELS_5.length).fill("")
  );
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  const generated = useMemo(() => generatePalette(baseColor, harmony), [baseColor, harmony]);

  useEffect(() => {
    const target = getRoleLabels(harmony).length;
    setPaletteSlots((prev) => {
      if (prev.length === target) return prev;
      if (prev.length < target)
        return [...prev, ...Array(target - prev.length).fill("")];
      return prev.slice(0, target);
    });
    setPickedIdx(null);
  }, [harmony]);

  const syncToStore = useCallback(
    (colors: string[]) => {
      const labels = getRoleLabels(harmony);
      const validColors = colors.filter((c) => /^#[0-9a-fA-F]{6}$/.test(c));
      const swatches = validColors.map((hex, i) => ({
        id: storeSwatches[i]?.id || uuid(),
        name: labels[i] || `Color ${i + 1}`,
        hex,
        role: labels[i] || "Accent",
        cssVariable: `--color-${(labels[i] || `c${i + 1}`)
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      }));
      reorderColors(swatches);
    },
    [storeSwatches, reorderColors, harmony]
  );

  useEffect(() => {
    if (mode === "assisted") syncToStore(paletteSlots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteSlots, mode]);

  useEffect(() => {
    if (mode === "manual") syncToStore(manualColors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualColors, mode]);

  useEffect(() => {
    if (pickedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickedIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickedIdx]);

  const handlePickSuggestion = (i: number) => {
    setPickedIdx((prev) => (prev === i ? null : i));
  };

  const handleFillSlot = (slotIdx: number) => {
    if (pickedIdx === null) return;
    const hex = generated[pickedIdx]?.hex;
    if (!hex) return;
    setPaletteSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = hex;
      return next;
    });
    setPickedIdx(null);
  };

  const handleClearSlot = (slotIdx: number) => {
    setPaletteSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = "";
      return next;
    });
  };

  const handleAutoFill = () => {
    const hexes = generated.map((g) => g.hex);
    setPaletteSlots((prev) => prev.map((_, i) => hexes[i] ?? prev[i] ?? ""));
    setPickedIdx(null);
  };

  const handleClearAll = () => {
    setPaletteSlots((prev) => prev.map(() => ""));
    setPickedIdx(null);
  };

  const handleWheelChange = (color: { hsva: HsvaColor }) => {
    setHsva(color.hsva);
    setBaseColor(hsvaToHex(color.hsva).toUpperCase());
  };

  const normalizeHex = (raw: string): string | null => {
    const s = raw.trim().replace(/^["']|["']$/g, "");
    const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      const [r, g, b] = [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((n) =>
        Math.max(0, Math.min(255, parseInt(n, 10)))
      );
      const h = (n: number) => n.toString(16).padStart(2, "0");
      return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
    }
    const hex = s.replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      return `#${hex.split("").map((c) => c + c).join("")}`.toUpperCase();
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex}`.toUpperCase();
    return null;
  };

  const applyHex = (hex: string) => {
    setBaseColor(hex);
    setHsva(hexToHsva(hex));
  };

  const handleHexChange = (val: string) => {
    setBaseColor(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setHsva(hexToHsva(val));
    }
  };

  const handleHexPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const normalized = normalizeHex(text);
    if (normalized) {
      e.preventDefault();
      applyHex(normalized);
    }
  };

  const handleExtractFromLogo = async () => {
    if (!firstLogo) return;
    setExtracting(true);
    try {
      const colors = await extractDominantColors(firstLogo.file, paletteSlots.length);
      if (colors.length === 0) {
        pushToast("No distinct colors found in logo", "info");
        return;
      }
      applyHex(colors[0]);
      setPaletteSlots((prev) => prev.map((existing, i) => colors[i] ?? existing));
      setPickedIdx(null);
      pushToast(`Extracted ${colors.length} color${colors.length > 1 ? "s" : ""} from logo`, "success");
    } finally {
      setExtracting(false);
    }
  };

  const handleManualChange = (index: number, val: string) => {
    const updated = [...manualColors];
    updated[index] = val;
    setManualColors(updated);
  };

  const currentLabels = getRoleLabels(harmony);

  const badgeFor = (hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
    const vsWhite = getContrastRatio(hex, "#FFFFFF");
    const vsBlack = getContrastRatio(hex, "#000000");
    const ratio = Math.max(vsWhite, vsBlack);
    const grade = wcagGrade(ratio);
    return { ratio, grade, onWhite: vsWhite >= vsBlack };
  };

  const hasAnySlotFilled = paletteSlots.some((c) => c.length > 0);

  return (
    <div className="max-w-md space-y-7">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#D0BEA5]/60 mb-2 font-medium">
          Step 03
        </p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#FFF4E3]">
          Color <span className="font-semibold">Palette</span>
        </h2>
        <p className="text-sm text-[#FFF4E3]/65">
          Build a harmonious palette or define your own.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="inline-flex p-1 rounded-full bg-[rgba(59,33,20,0.6)] backdrop-blur-md border border-[rgba(208,190,165,0.15)] shadow-[inset_0_1px_0_rgba(0,0,0,0.2)]">
        {(
          [
            { id: "assisted", label: "Help me build a palette" },
            { id: "manual", label: "I have my own colors" },
          ] as const
        ).map((opt) => {
          const isActive = mode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={cn(
                "relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-150 whitespace-nowrap",
                isActive
                  ? "text-[#3B2114]"
                  : "text-[#D0BEA5]/50 hover:text-[#D0BEA5]"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="palette-toggle-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[#D0BEA5] shadow-[0_2px_10px_rgba(208,190,165,0.35)]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Assisted Mode */}
      {mode === "assisted" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[rgba(255,244,227,0.03)] backdrop-blur-md border border-[rgba(208,190,165,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,244,227,0.04)]">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60 mb-4">
              Pick a base color
            </p>
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                <Wheel color={hsva} onChange={handleWheelChange} width={140} height={140} />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <label className="block text-[9px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60 mb-1.5">
                    HEX
                  </label>
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    onPaste={handleHexPaste}
                    className="w-full h-10 px-3 rounded-lg bg-[rgba(255,244,227,0.03)] border border-[rgba(208,190,165,0.12)] text-sm font-mono uppercase text-[#FFF4E3] shadow-[inset_0_1px_0_rgba(255,244,227,0.04)] transition-all focus:outline-none focus:border-[rgba(208,190,165,0.55)] focus:bg-[rgba(255,244,227,0.05)] focus:ring-2 focus:ring-[rgba(208,190,165,0.18)]"
                    placeholder="#000000 · paste hex/rgb"
                    maxLength={20}
                  />
                </div>
                <div
                  className="h-16 rounded-lg border border-[rgba(208,190,165,0.15)] shadow-[inset_0_1px_0_rgba(255,244,227,0.1)] transition-all"
                  style={{ background: baseColor }}
                />
              </div>
            </div>

            {firstLogo && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[rgba(208,190,165,0.08)]">
                <button
                  type="button"
                  onClick={() => setEyedropperOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-[10px] tracking-[0.15em] uppercase font-semibold text-[#D0BEA5] bg-[rgba(208,190,165,0.06)] hover:bg-[rgba(208,190,165,0.12)] border border-[rgba(208,190,165,0.18)] transition-colors"
                >
                  <Pipette className="size-3.5" />
                  Pick from logo
                </button>
                <button
                  type="button"
                  onClick={handleExtractFromLogo}
                  disabled={extracting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-[10px] tracking-[0.15em] uppercase font-semibold text-[#C9A961] bg-[rgba(201,169,97,0.08)] hover:bg-[rgba(201,169,97,0.18)] border border-[rgba(201,169,97,0.3)] transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  <Sparkles className="size-3.5" />
                  {extracting ? "Extracting…" : "Extract palette"}
                </button>
              </div>
            )}
          </div>

          {/* Harmony Selector */}
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60 mb-3">
              Choose a harmony
            </p>
            <div className="grid grid-cols-3 gap-2">
              {HARMONIES.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHarmony(h.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 backdrop-blur-sm",
                    harmony === h.id
                      ? "border-[rgba(208,190,165,0.45)] bg-[rgba(208,190,165,0.1)] text-[#D0BEA5] shadow-[0_4px_16px_rgba(208,190,165,0.18)]"
                      : "border-[rgba(208,190,165,0.1)] bg-[rgba(255,244,227,0.02)] text-[#FFF4E3]/50 hover:text-[#FFF4E3]/80 hover:border-[rgba(208,190,165,0.2)] hover:bg-[rgba(255,244,227,0.04)]"
                  )}
                >
                  <HarmonyIcon type={h.id} />
                  <span className="text-[9px] font-medium text-center leading-tight tracking-wide">
                    {h.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions + Palette assignment */}
      {mode === "assisted" && (
        <>
          <div className="space-y-3">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60">
              Suggested colors
            </p>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${generated.length}, minmax(0, 1fr))` }}
            >
              {generated.map((sugg, i) => {
                const isPicked = pickedIdx === i;
                const dimmed = pickedIdx !== null && !isPicked;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePickSuggestion(i)}
                    aria-pressed={isPicked}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-lg p-1 transition-all duration-200",
                      isPicked && "ring-2 ring-[#C9A961] ring-offset-2 ring-offset-[#1F0F08] -translate-y-0.5",
                      dimmed && "opacity-45 hover:opacity-80",
                      !isPicked && "hover:-translate-y-0.5"
                    )}
                  >
                    <div
                      className="relative w-full h-14 rounded-md border border-[rgba(208,190,165,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,244,227,0.1)]"
                      style={{ background: sugg.hex }}
                    />
                    <code className="text-[9px] font-mono text-[#FFF4E3]/70 tracking-wide">
                      {sugg.gamutClipped && <span className="text-[#D0BEA5]/45">≈ </span>}
                      {sugg.hex.toUpperCase()}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {pickedIdx !== null && generated[pickedIdx] && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(201,169,97,0.12)] border border-[rgba(201,169,97,0.45)] shadow-[0_4px_20px_rgba(201,169,97,0.18)]"
              >
                <span
                  className="size-9 rounded-lg border border-[rgba(255,244,227,0.25)] shadow-[inset_0_1px_0_rgba(255,244,227,0.15)] flex-shrink-0"
                  style={{ background: generated[pickedIdx].hex }}
                />
                <div className="flex-1 min-w-0 leading-tight">
                  <p className="text-[11px] text-[#FFF4E3]/85">
                    <span className="font-semibold text-[#FFF4E3]">
                      {generated[pickedIdx].hex.toUpperCase()}
                    </span>{" "}
                    <span className="text-[#D0BEA5]/70">is ready —</span>
                  </p>
                  <p className="text-[11px] text-[#C9A961] font-semibold flex items-center gap-1">
                    <ArrowDown className="size-3 animate-bounce" />
                    tap a slot below to assign
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickedIdx(null)}
                  aria-label="Cancel pick (Esc)"
                  className="size-7 rounded-full flex items-center justify-center text-[#D0BEA5]/60 hover:text-[#FFF4E3] hover:bg-[rgba(208,190,165,0.12)] transition-all flex-shrink-0"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60">
                Your palette
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-semibold text-[#C9A961] bg-[rgba(201,169,97,0.08)] hover:bg-[rgba(201,169,97,0.18)] border border-[rgba(201,169,97,0.3)] transition-colors"
                >
                  <Wand2 className="size-3" />
                  Auto-fill
                </button>
                {hasAnySlotFilled && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-2 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-semibold text-[#FFF4E3]/55 hover:text-[#E89178] hover:bg-[rgba(220,120,100,0.08)] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div
              className="grid gap-2.5"
              style={{ gridTemplateColumns: `repeat(${paletteSlots.length}, minmax(0, 1fr))` }}
            >
              {paletteSlots.map((hex, i) => {
                const isValid = /^#[0-9a-fA-F]{6}$/.test(hex);
                const badge = isValid ? badgeFor(hex) : null;
                const canFill = pickedIdx !== null && !isValid;
                const pickedHex = pickedIdx !== null ? generated[pickedIdx]?.hex : undefined;
                return (
                  <div key={i} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isValid) handleClearSlot(i);
                        else if (pickedIdx !== null) handleFillSlot(i);
                      }}
                      aria-label={
                        isValid
                          ? `Clear ${currentLabels[i]} (${hex})`
                          : canFill
                          ? `Drop ${pickedHex} into ${currentLabels[i]}`
                          : `${currentLabels[i]} slot — pick a color first`
                      }
                      className={cn(
                        "relative w-full h-20 rounded-xl transition-all duration-200 group overflow-hidden",
                        isValid
                          ? "border border-[rgba(208,190,165,0.2)] shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,244,227,0.1)] cursor-pointer"
                          : canFill
                          ? "border-2 border-dashed border-[#C9A961] bg-[rgba(201,169,97,0.1)] cursor-pointer shadow-[0_0_0_3px_rgba(201,169,97,0.08),0_6px_20px_rgba(201,169,97,0.25)] animate-pulse"
                          : "border-2 border-dashed border-[rgba(208,190,165,0.18)] bg-[rgba(255,244,227,0.02)] hover:border-[rgba(208,190,165,0.28)]"
                      )}
                      style={isValid ? { background: hex } : {}}
                      disabled={!isValid && pickedIdx === null}
                    >
                      {!isValid && !canFill && (
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center text-[#D0BEA5]/25 group-hover:text-[#D0BEA5]/50 transition-colors"
                        >
                          <Plus className="size-5" strokeWidth={1.5} />
                        </span>
                      )}
                      {canFill && pickedHex && (
                        <>
                          <span
                            aria-hidden
                            className="absolute inset-2 rounded-lg opacity-45"
                            style={{ background: pickedHex }}
                          />
                          <span
                            aria-hidden
                            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
                          >
                            <Plus
                              className="size-4 text-[#FFF4E3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                              strokeWidth={2.5}
                            />
                            <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#FFF4E3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              Drop
                            </span>
                          </span>
                        </>
                      )}
                      {isValid && (
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors"
                        >
                          <span className="text-[9px] tracking-[0.18em] uppercase font-semibold text-[#FFF4E3] opacity-0 group-hover:opacity-100 transition-opacity">
                            Clear
                          </span>
                        </span>
                      )}
                    </button>
                    <div className="text-center space-y-1">
                      <p
                        className={cn(
                          "text-[8px] font-medium tracking-[0.18em] uppercase transition-colors",
                          canFill ? "text-[#C9A961]" : "text-[#D0BEA5]/55"
                        )}
                      >
                        {canFill ? `Drop as ${currentLabels[i]}` : currentLabels[i]}
                      </p>
                      <code className="block text-[10px] font-mono text-[#FFF4E3]/70 tracking-wide min-h-[14px]">
                        {isValid ? hex.toUpperCase() : "—"}
                      </code>
                      {badge && (
                        <span
                          title={`Best text contrast ${badge.ratio}:1 vs ${badge.onWhite ? "white" : "black"}`}
                          className={cn(
                            "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold leading-none tracking-wide",
                            badge.grade !== "FAIL"
                              ? "bg-[rgba(168,200,150,0.18)] text-[#A8C896] border border-[rgba(168,200,150,0.35)]"
                              : "bg-[rgba(220,120,100,0.15)] text-[#E89178] border border-[rgba(220,120,100,0.3)]"
                          )}
                        >
                          {badge.ratio}:1 {badge.grade}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Manual mode */}
      {mode === "manual" && (
        <div className="space-y-3">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#D0BEA5]/60">
            Your colors
          </p>
          <div
            className="grid gap-2.5"
            style={{ gridTemplateColumns: `repeat(${currentLabels.length}, minmax(0, 1fr))` }}
          >
            {currentLabels.map((label, i) => {
              const raw = manualColors[i] ?? "";
              const isValid = /^#[0-9a-fA-F]{6}$/.test(raw);
              const hasValue = raw.length > 0;
              const invalid = hasValue && !isValid;
              const badge = isValid ? badgeFor(raw) : null;
              return (
                <div key={i} className="space-y-2 animate-in fade-in duration-300">
                  <div
                    className={cn(
                      "relative w-full h-20 rounded-xl transition-all duration-300",
                      isValid
                        ? "border border-[rgba(208,190,165,0.15)] shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,244,227,0.1)]"
                        : "border-2 border-dashed border-[rgba(208,190,165,0.18)] bg-[rgba(255,244,227,0.02)]"
                    )}
                    style={isValid ? { background: raw } : {}}
                  />
                  <div className="text-center space-y-1">
                    <p className="text-[8px] font-medium tracking-[0.18em] uppercase text-[#D0BEA5]/50">
                      {label}
                    </p>
                    <input
                      type="text"
                      value={raw}
                      onChange={(e) => handleManualChange(i, e.target.value)}
                      aria-invalid={invalid}
                      className={cn(
                        "w-full h-7 px-1.5 rounded-md bg-[rgba(255,244,227,0.03)] border text-[10px] font-mono uppercase text-[#FFF4E3] text-center transition-all focus:outline-none",
                        invalid
                          ? "border-[rgba(220,120,100,0.5)] focus:border-[rgba(220,120,100,0.7)] focus:ring-1 focus:ring-[rgba(220,120,100,0.3)]"
                          : "border-[rgba(208,190,165,0.12)] focus:border-[rgba(208,190,165,0.55)] focus:ring-1 focus:ring-[rgba(208,190,165,0.18)]"
                      )}
                      placeholder="#______"
                      maxLength={7}
                    />
                    {invalid && (
                      <span className="block text-[9px] text-[#E89178]/85 leading-tight">
                        Invalid hex
                      </span>
                    )}
                    {badge && (
                      <span
                        title={`Best text contrast ${badge.ratio}:1 vs ${badge.onWhite ? "white" : "black"}`}
                        className={cn(
                          "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold leading-none tracking-wide",
                          badge.grade !== "FAIL"
                            ? "bg-[rgba(168,200,150,0.18)] text-[#A8C896] border border-[rgba(168,200,150,0.35)]"
                            : "bg-[rgba(220,120,100,0.15)] text-[#E89178] border border-[rgba(220,120,100,0.3)]"
                        )}
                      >
                        {badge.ratio}:1 {badge.grade}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {firstLogo && (
        <LogoEyedropper
          src={firstLogo.file}
          open={eyedropperOpen}
          onClose={() => setEyedropperOpen(false)}
          onPick={(hex) => {
            applyHex(hex);
            pushToast(`${hex} sampled from logo`, "success");
          }}
        />
      )}
    </div>
  );
}
