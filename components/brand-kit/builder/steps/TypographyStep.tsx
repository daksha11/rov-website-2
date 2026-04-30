"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Upload, X, ChevronDown, Check, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FontDefinition } from "@/lib/brand-kit/types";
import { resolveSampleText } from "@/lib/brand-kit/utils/sampleText";
import React from "react";

const DISPLAY_SUGGESTIONS = [
  "Playfair Display",
  "Fraunces",
  "Instrument Serif",
  "Cormorant Garamond",
  "Space Grotesk",
  "Sora",
  "Geist",
  "DM Serif Display",
];
const BODY_SUGGESTIONS = [
  "Inter",
  "Roboto",
  "DM Sans",
  "Work Sans",
  "Lato",
  "Source Sans 3",
  "IBM Plex Sans",
  "Geist",
];

function capFontSize(fontSize: string): string {
  const num = parseFloat(fontSize);
  if (isNaN(num)) return fontSize;
  return `${Math.min(num, 40)}px`;
}

function buildGoogleFontsUrl(name: string): string {
  if (!name.trim()) return "";
  const family = name.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700&display=swap`;
}

function loadGoogleFontInBuilder(url: string) {
  if (!url || typeof document === "undefined") return;
  const id = `gf-${btoa(url).slice(0, 12)}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

function loadCustomFontInBuilder(name: string, dataUrl: string, format: string) {
  if (typeof document === "undefined") return;
  const id = `cf-${btoa(name).slice(0, 12)}`;
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@font-face { font-family: '${name}'; src: url('${dataUrl}') format('${format}'); font-display: swap; }`;
  document.head.appendChild(style);
}

function detectFontFormat(filename: string): "woff2" | "woff" | "ttf" | "otf" {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "woff2") return "woff2";
  if (ext === "woff") return "woff";
  if (ext === "otf") return "otf";
  return "ttf";
}

export default function TypographyStep() {
  const typography = useBrandKitStore((s) => s.data.typography);
  const brandInfo = useBrandKitStore((s) => s.data.brandInfo);
  const setTypography = useBrandKitStore((s) => s.setTypography);
  const updateScaleEntry = useBrandKitStore((s) => s.updateScaleEntry);

  const previewHeadline = brandInfo.name.trim() || "Brand Headline";
  const previewBody = brandInfo.tagline.trim()
    ? `${brandInfo.tagline}. Body text flows here, readable and expressive — how your brand speaks at paragraph level.`
    : "Body text flows here, readable and expressive. This is how your brand speaks at paragraph level across all materials and touchpoints.";

  const [scaleOpen, setScaleOpen] = useState(false);

  useEffect(() => {
    [...DISPLAY_SUGGESTIONS, ...BODY_SUGGESTIONS].forEach((name) => {
      loadGoogleFontInBuilder(buildGoogleFontsUrl(name));
    });
  }, []);

  useEffect(() => {
    if (typography.displayFont.customFontData) {
      loadCustomFontInBuilder(
        typography.displayFont.name,
        typography.displayFont.customFontData,
        typography.displayFont.customFontFormat || "woff2"
      );
    } else if (typography.displayFont.googleFontsUrl) {
      loadGoogleFontInBuilder(typography.displayFont.googleFontsUrl);
    }
    if (typography.bodyFont.customFontData) {
      loadCustomFontInBuilder(
        typography.bodyFont.name,
        typography.bodyFont.customFontData,
        typography.bodyFont.customFontFormat || "woff2"
      );
    } else if (typography.bodyFont.googleFontsUrl) {
      loadGoogleFontInBuilder(typography.bodyFont.googleFontsUrl);
    }
  }, [typography.displayFont, typography.bodyFont]);

  const handleDisplayChange = (font: FontDefinition) => setTypography({ displayFont: font });
  const handleBodyChange = (font: FontDefinition) => setTypography({ bodyFont: font });

  return (
    <div className="max-w-md space-y-7">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#D0BEA5]/60 mb-2 font-medium">
          Step 04
        </p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#FFF4E3]">
          <span className="font-semibold">Typography</span>
        </h2>
        <p className="text-sm text-[#FFF4E3]/65">
          Pick any Google Font or upload your own — preview updates live.
        </p>
      </div>

      {/* Live Combined Preview */}
      <div className="p-4 rounded-2xl bg-[rgba(255,244,227,0.03)] border border-[rgba(208,190,165,0.12)] backdrop-blur-md overflow-hidden">
        <p className="text-[9px] tracking-[0.25em] uppercase text-[#D0BEA5]/40 mb-3 font-medium">
          Live Preview
        </p>
        <p
          className="text-[28px] leading-tight text-[#FFF4E3] mb-2"
          style={{
            fontFamily: `'${typography.displayFont.name}', ${typography.displayFont.fallback}`,
            fontWeight: 600,
          }}
        >
          {previewHeadline}
        </p>
        <p
          className="text-sm text-[#FFF4E3]/65 leading-relaxed"
          style={{
            fontFamily: `'${typography.bodyFont.name}', ${typography.bodyFont.fallback}`,
            fontWeight: 300,
          }}
        >
          {previewBody}
        </p>
        <div className="mt-3 pt-3 border-t border-[rgba(208,190,165,0.08)] flex items-center justify-between">
          <span
            className="text-[10px] text-[#D0BEA5]/50"
            style={{ fontFamily: `'${typography.displayFont.name}', ${typography.displayFont.fallback}` }}
          >
            {typography.displayFont.name}
          </span>
          <span className="text-[10px] text-[#D0BEA5]/25">+</span>
          <span
            className="text-[10px] text-[#D0BEA5]/50"
            style={{ fontFamily: `'${typography.bodyFont.name}', ${typography.bodyFont.fallback}` }}
          >
            {typography.bodyFont.name}
          </span>
        </div>
      </div>

      {/* Font slots */}
      <div className="space-y-4">
        <FontSlot
          label="Display Font"
          role="display"
          description="Headings and brand titles"
          suggestions={DISPLAY_SUGGESTIONS}
          font={typography.displayFont}
          onChange={handleDisplayChange}
        />
        <FontSlot
          label="Body Font"
          role="body"
          description="Paragraphs and general text"
          suggestions={BODY_SUGGESTIONS}
          font={typography.bodyFont}
          onChange={handleBodyChange}
        />
      </div>

      {/* Upload custom fonts */}
      <UploadSection
        displayFont={typography.displayFont}
        bodyFont={typography.bodyFont}
        onDisplayChange={handleDisplayChange}
        onBodyChange={handleBodyChange}
      />

      {/* Type Scale — collapsed */}
      <div className="rounded-xl border border-[rgba(208,190,165,0.1)] bg-[rgba(255,244,227,0.02)] overflow-hidden">
        <button
          type="button"
          onClick={() => setScaleOpen((v) => !v)}
          aria-expanded={scaleOpen}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(255,244,227,0.03)] transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Sliders className="size-3.5 text-[#D0BEA5]/60 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D0BEA5]/80">
                Advanced · Type Scale
              </p>
              <p className="text-[10px] text-[#FFF4E3]/45 truncate">
                Fine-tune size, weight, and line height for each level
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "size-4 text-[#D0BEA5]/60 flex-shrink-0 ml-2 transition-transform",
              scaleOpen && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {scaleOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-[rgba(208,190,165,0.08)]">
                {typography.scale.map((entry, i) => {
                  const fontDef =
                    entry.fontFamily === "display"
                      ? typography.displayFont
                      : typography.bodyFont;
                  return (
                    <div
                      key={entry.label}
                      className="rounded-xl bg-[rgba(255,244,227,0.03)] backdrop-blur-md border border-[rgba(208,190,165,0.1)] overflow-hidden"
                    >
                      <div className="px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] tracking-[0.2em] uppercase text-[#D0BEA5]/50 font-semibold">
                            {entry.label}
                          </span>
                          <span
                            className={cn(
                              "text-[8px] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full font-medium",
                              entry.fontFamily === "display"
                                ? "bg-[rgba(201,169,97,0.12)] text-[#C9A961]/70"
                                : "bg-[rgba(208,190,165,0.08)] text-[#D0BEA5]/45"
                            )}
                          >
                            {entry.fontFamily}
                          </span>
                        </div>
                        <div
                          className="text-[#FFF4E3] leading-tight truncate"
                          style={{
                            fontFamily: `'${fontDef.name}', ${fontDef.fallback}`,
                            fontSize: capFontSize(entry.fontSize),
                            fontWeight: entry.fontWeight,
                            lineHeight: entry.lineHeight,
                            letterSpacing: entry.letterSpacing,
                            textTransform: entry.textTransform as React.CSSProperties["textTransform"],
                          }}
                        >
                          {resolveSampleText(entry, brandInfo) || entry.label}
                        </div>
                      </div>
                      <div className="px-3 pb-3 pt-2 border-t border-[rgba(208,190,165,0.06)] space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <p className="text-[8px] tracking-[0.12em] uppercase text-[#D0BEA5]/30 font-medium">
                              Size
                            </p>
                            <input
                              value={entry.fontSize}
                              onChange={(e) => updateScaleEntry(i, { fontSize: e.target.value })}
                              placeholder="16px"
                              className="w-full h-7 px-2 rounded-lg bg-[rgba(208,190,165,0.06)] border border-[rgba(208,190,165,0.12)] text-[11px] text-[#FFF4E3]/80 font-mono outline-none focus:border-[rgba(208,190,165,0.4)] transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] tracking-[0.12em] uppercase text-[#D0BEA5]/30 font-medium">
                              Weight
                            </p>
                            <input
                              type="number"
                              value={entry.fontWeight}
                              onChange={(e) =>
                                updateScaleEntry(i, { fontWeight: parseInt(e.target.value) || 400 })
                              }
                              step={100}
                              min={100}
                              max={900}
                              className="w-full h-7 px-2 rounded-lg bg-[rgba(208,190,165,0.06)] border border-[rgba(208,190,165,0.12)] text-[11px] text-[#FFF4E3]/80 font-mono outline-none focus:border-[rgba(208,190,165,0.4)] transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] tracking-[0.12em] uppercase text-[#D0BEA5]/30 font-medium">
                              Line H.
                            </p>
                            <input
                              value={entry.lineHeight}
                              onChange={(e) => updateScaleEntry(i, { lineHeight: e.target.value })}
                              placeholder="1.5"
                              className="w-full h-7 px-2 rounded-lg bg-[rgba(208,190,165,0.06)] border border-[rgba(208,190,165,0.12)] text-[11px] text-[#FFF4E3]/80 font-mono outline-none focus:border-[rgba(208,190,165,0.4)] transition-colors"
                            />
                          </div>
                        </div>
                        <input
                          value={entry.sampleText}
                          onChange={(e) => updateScaleEntry(i, { sampleText: e.target.value })}
                          placeholder="Edit sample text..."
                          className="w-full bg-transparent border-b border-[rgba(208,190,165,0.08)] pb-1 text-[10px] text-[#FFF4E3]/40 outline-none focus:text-[#FFF4E3]/70 focus:border-[rgba(208,190,165,0.35)] transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// FontDropdown — combobox with typeahead + curated suggestions
function FontDropdown({
  value,
  suggestions,
  onSelect,
  disabled,
}: {
  value: string;
  suggestions: string[];
  onSelect: (name: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  const trimmedQuery = query.trim();
  const canAddCustom =
    trimmedQuery.length > 0 &&
    !suggestions.some((s) => s.toLowerCase() === trimmedQuery.toLowerCase());

  const commit = (name: string) => {
    onSelect(name);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full h-10 flex items-center justify-between px-3 rounded-lg border bg-[rgba(208,190,165,0.06)] transition-all",
          disabled
            ? "opacity-60 cursor-not-allowed border-[rgba(208,190,165,0.1)]"
            : open
            ? "border-[rgba(208,190,165,0.5)] bg-[rgba(208,190,165,0.1)]"
            : "border-[rgba(208,190,165,0.15)] hover:border-[rgba(208,190,165,0.3)]"
        )}
      >
        <span
          className="text-sm text-[#FFF4E3] truncate"
          style={{ fontFamily: `'${value}', sans-serif` }}
        >
          {value || "Pick a font"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-[#D0BEA5]/60 flex-shrink-0 ml-2 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 rounded-xl border border-[rgba(208,190,165,0.35)] bg-[rgba(42,24,16,0.98)] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="p-2 border-b border-[rgba(208,190,165,0.1)]">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canAddCustom) commit(trimmedQuery);
                  if (e.key === "Enter" && filtered[0]) commit(filtered[0]);
                  if (e.key === "Escape") { setOpen(false); setQuery(""); }
                }}
                placeholder="Search or type any Google Font…"
                className="w-full h-8 px-2 rounded-md bg-transparent border border-[rgba(208,190,165,0.15)] text-[12px] text-[#FFF4E3] placeholder:text-[#D0BEA5]/35 outline-none focus:border-[rgba(208,190,165,0.45)]"
              />
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1 [scrollbar-width:thin]">
              {filtered.map((s) => {
                const isCurrent = s === value;
                return (
                  <li key={s}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => commit(s)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-left transition-colors",
                        isCurrent
                          ? "bg-[rgba(201,169,97,0.14)] text-[#FFF4E3]"
                          : "text-[#FFF4E3]/85 hover:bg-[rgba(208,190,165,0.08)]"
                      )}
                    >
                      <span
                        className="text-[15px] truncate"
                        style={{ fontFamily: `'${s}', sans-serif` }}
                      >
                        {s}
                      </span>
                      {isCurrent && (
                        <Check className="size-3.5 text-[#C9A961] flex-shrink-0 ml-2" />
                      )}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && !canAddCustom && (
                <li className="px-3 py-3 text-[11px] text-[#D0BEA5]/40 text-center">
                  No matches
                </li>
              )}
              {canAddCustom && (
                <li className="border-t border-[rgba(208,190,165,0.08)] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => commit(trimmedQuery)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] text-[#C9A961] hover:bg-[rgba(201,169,97,0.1)] transition-colors"
                  >
                    <span className="text-[#D0BEA5]/50">Use custom:</span>
                    <span className="truncate" style={{ fontFamily: `'${trimmedQuery}', sans-serif` }}>
                      {trimmedQuery}
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FontSlot — dropdown + live preview
function FontSlot({
  label,
  role,
  description,
  suggestions,
  font,
  onChange,
}: {
  label: string;
  role: "display" | "body";
  description: string;
  suggestions: string[];
  font: FontDefinition;
  onChange: (font: FontDefinition) => void;
}) {
  const isCustom = !!font.customFontData;

  const applyGoogleFont = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const url = buildGoogleFontsUrl(trimmed);
      loadGoogleFontInBuilder(url);
      onChange({
        ...font,
        name: trimmed,
        googleFontsUrl: url,
        fallback: role === "display" ? "serif" : "sans-serif",
        customFontData: undefined,
        customFontFormat: undefined,
      });
    },
    [font, onChange, role]
  );

  return (
    <div className="p-4 rounded-xl bg-[rgba(255,244,227,0.03)] backdrop-blur-md border border-[rgba(208,190,165,0.1)] shadow-[inset_0_1px_0_rgba(255,244,227,0.03)] space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#D0BEA5]/70 font-semibold">{label}</p>
          <p className="text-[10px] text-[#FFF4E3]/40 mt-0.5">{description}</p>
        </div>
        {isCustom && (
          <span className="text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-[rgba(201,169,97,0.12)] text-[#C9A961]/80 font-medium">
            Custom
          </span>
        )}
      </div>

      <FontDropdown
        value={font.name}
        suggestions={suggestions}
        onSelect={applyGoogleFont}
        disabled={isCustom}
      />

      {isCustom && (
        <p className="text-[10px] text-[#D0BEA5]/45">
          Using an uploaded font. Remove it in the upload section below to switch back to Google Fonts.
        </p>
      )}

      <div className="pt-2 border-t border-[rgba(208,190,165,0.08)]">
        <p
          className="text-[22px] text-[#FFF4E3] leading-tight"
          style={{
            fontFamily: `'${font.name}', ${font.fallback}`,
            fontWeight: role === "display" ? 600 : 400,
          }}
        >
          Aa Bb Cc 0-9
        </p>
        <p
          className="text-xs text-[#FFF4E3]/50 mt-0.5 truncate"
          style={{ fontFamily: `'${font.name}', ${font.fallback}`, fontWeight: 300 }}
        >
          {font.name} — The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
}

// UploadSection — collapsed by default
function UploadSection({
  displayFont,
  bodyFont,
  onDisplayChange,
  onBodyChange,
}: {
  displayFont: FontDefinition;
  bodyFont: FontDefinition;
  onDisplayChange: (f: FontDefinition) => void;
  onBodyChange: (f: FontDefinition) => void;
}) {
  const hasAnyCustom = !!(displayFont.customFontData || bodyFont.customFontData);
  const [open, setOpen] = useState(hasAnyCustom);

  return (
    <div className="rounded-xl border border-[rgba(208,190,165,0.1)] bg-[rgba(255,244,227,0.02)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(255,244,227,0.03)] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Upload className="size-3.5 text-[#D0BEA5]/60 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D0BEA5]/80">
              Upload Custom Fonts
            </p>
            <p className="text-[10px] text-[#FFF4E3]/45 truncate">
              WOFF2 / WOFF / TTF / OTF · embeds directly in your exported kit
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-[#D0BEA5]/60 flex-shrink-0 ml-2 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-[rgba(208,190,165,0.08)]">
              <UploadZone label="Display" font={displayFont} role="display" onChange={onDisplayChange} />
              <UploadZone label="Body" font={bodyFont} role="body" onChange={onBodyChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadZone({
  label,
  font,
  role,
  onChange,
}: {
  label: string;
  font: FontDefinition;
  role: "display" | "body";
  onChange: (font: FontDefinition) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isCustom = !!font.customFontData;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const format = detectFontFormat(file.name);
      const name = file.name.replace(/\.[^.]+$/, "");
      loadCustomFontInBuilder(name, dataUrl, format);
      onChange({
        ...font,
        name,
        customFontData: dataUrl,
        customFontFormat: format,
        googleFontsUrl: "",
        fallback: role === "display" ? "serif" : "sans-serif",
      });
    };
    reader.readAsDataURL(file);
  };

  const clearCustom = () => {
    const defaultName = role === "display" ? "Playfair Display" : "Inter";
    onChange({
      ...font,
      name: defaultName,
      googleFontsUrl: buildGoogleFontsUrl(defaultName),
      customFontData: undefined,
      customFontFormat: undefined,
      fallback: role === "display" ? "serif" : "sans-serif",
    });
  };

  return (
    <div>
      <p className="text-[9px] tracking-[0.18em] uppercase text-[#D0BEA5]/55 font-semibold mb-1.5">
        {label}
      </p>
      {isCustom ? (
        <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-[rgba(201,169,97,0.08)] border border-[rgba(201,169,97,0.3)]">
          <div className="min-w-0">
            <p className="text-sm text-[#FFF4E3] truncate">{font.name}</p>
            <p className="text-[9px] text-[#D0BEA5]/55 tracking-wide uppercase mt-0.5">
              .{font.customFontFormat}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCustom}
            aria-label={`Remove uploaded ${label.toLowerCase()} font`}
            className="size-7 rounded-full flex items-center justify-center text-[#D0BEA5]/55 hover:text-[#E89178] hover:bg-[rgba(220,120,100,0.1)] transition-all flex-shrink-0"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[rgba(208,190,165,0.18)] rounded-lg cursor-pointer hover:border-[rgba(208,190,165,0.4)] hover:bg-[rgba(208,190,165,0.03)] transition-all">
          <Upload className="size-3.5 text-[#D0BEA5]/50" />
          <span className="text-xs text-[#FFF4E3]/55">
            Click to upload {label.toLowerCase()} font file
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".woff2,.woff,.ttf,.otf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
