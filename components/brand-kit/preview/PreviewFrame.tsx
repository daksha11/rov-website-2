"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Maximize2, Minimize2 } from "lucide-react";

type PreviewMode = "guidelines" | "product";

export default function PreviewFrame() {
  const data = useBrandKitStore(useShallow((s) => s.data));
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<PreviewMode>("guidelines");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isFull, setIsFull] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updatePreview = useCallback(async () => {
    setIsUpdating(true);
    try {
      if (mode === "product") {
        const { generateLiveProduct } = await import(
          "@/lib/brand-kit/generator/live-product"
        );
        setHtml(generateLiveProduct(data));
      } else {
        const { generateBrandKit } = await import("@/lib/brand-kit/generator");
        setHtml(generateBrandKit(data));
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview generation failed");
    }
    setTimeout(() => setIsUpdating(false), 150);
  }, [data, mode]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(updatePreview, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [updatePreview]);

  // Keep the fullscreen button label honest across Esc / native exits.
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div ref={rootRef} className="flex flex-col h-full bg-[#24123A]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[rgba(240,230,224,0.12)] backdrop-blur-md bg-[rgba(36,18,58,0.6)]">
        <div className="flex items-center gap-0.5 rounded-full p-1 bg-[rgba(240,230,224,0.04)] border border-[rgba(240,230,224,0.12)]">
          {(
            [
              ["guidelines", "Guidelines"],
              ["product", "Live product"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`px-3 py-1 text-[10px] tracking-wider uppercase rounded-full transition-all ${
                mode === value
                  ? "bg-[#E3C24A] text-[#24123A] font-semibold"
                  : "text-[#F0E6E0]/50 hover:text-[#F0E6E0]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full p-1 bg-[rgba(240,230,224,0.04)] border border-[rgba(240,230,224,0.12)]">
            {(["desktop", "tablet", "mobile"] as const).map((vp) => (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={`px-3 py-1 text-[10px] tracking-wider uppercase rounded-full transition-all ${
                  viewport === vp
                    ? "bg-[#F0E6E0] text-[#24123A] font-semibold"
                    : "text-[#F0E6E0]/50 hover:text-[#F0E6E0]"
                }`}
              >
                {vp}
              </button>
            ))}
          </div>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center size-7 rounded-full text-[#F0E6E0]/60 hover:text-[#F0E6E0] hover:bg-[rgba(240,230,224,0.08)] transition-all"
            aria-label={isFull ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFull ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFull ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 px-4 py-2 border-b border-[rgba(220,120,100,0.35)] bg-[rgba(220,120,100,0.1)] text-[12px] text-[#E89178]"
        >
          <span className="font-semibold">Preview error:</span>
          <span className="flex-1 min-w-0 break-words">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[#E89178]/70 hover:text-[#E89178] ml-2"
            aria-label="Dismiss preview error"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex-1 flex items-start justify-center overflow-auto p-4">
        <div
          className="transition-all duration-300 h-full"
          style={{
            width: viewportWidths[viewport],
            maxWidth: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={html}
            className="w-full h-full border border-[rgba(240,230,224,0.15)] rounded-xl transition-opacity duration-200 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            style={{ opacity: isUpdating ? 0.85 : 1, backgroundColor: "#24123A" }}
            sandbox="allow-scripts allow-same-origin"
            title="Brand Kit Preview"
          />
        </div>
      </div>
    </div>
  );
}
