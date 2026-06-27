"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBrandKitStore } from "@/lib/brand-kit/store";

export default function PreviewFrame() {
  const data = useBrandKitStore(useShallow((s) => s.data));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updatePreview = useCallback(async () => {
    setIsUpdating(true);
    try {
      const { generateBrandKit } = await import("@/lib/brand-kit/generator");
      const generated = generateBrandKit(data);
      setHtml(generated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview generation failed");
    }
    setTimeout(() => setIsUpdating(false), 150);
  }, [data]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(updatePreview, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [updatePreview]);

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="flex flex-col h-full bg-[#24123A]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(240,230,224,0.12)] backdrop-blur-md bg-[rgba(36,18,58,0.6)]">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#F0E6E0]/70 font-medium">
          Live Preview
        </span>
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
