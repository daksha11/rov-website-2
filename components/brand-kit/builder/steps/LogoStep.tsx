"use client";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Button } from "@/components/brand-kit/ui/button";
import { Card, CardContent } from "@/components/brand-kit/ui/card";
import { Plus, X, Upload } from "lucide-react";
import type { LogoVariant } from "@/lib/brand-kit/types";

export default function LogoStep() {
  const logos = useBrandKitStore((s) => s.data.logos.variants);
  const addLogo = useBrandKitStore((s) => s.addLogo);
  const removeLogo = useBrandKitStore((s) => s.removeLogo);
  const updateLogo = useBrandKitStore((s) => s.updateLogo);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        const isSvg = file.type === "image/svg+xml";
        const format = isSvg ? "svg" : "png";

        let processedFile = file;
        if (!isSvg && file.size > 200 * 1024) {
          try {
            const imageCompression = (await import("browser-image-compression"))
              .default;
            processedFile = await imageCompression(file, {
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            });
          } catch {
            // Fall back to original
          }
        }

        const reader = new FileReader();
        reader.onload = () => {
          const logo: LogoVariant = {
            id: uuid(),
            label: file.name.replace(/\.[^.]+$/, ""),
            file: reader.result as string,
            format,
            backgroundPresets: [
              { label: "Light", color: "#f4f4f4" },
              { label: "Dark", color: "#1a1a1a" },
              { label: "Black", color: "#000000" },
            ],
            defaultBackground: "#1a1a1a",
            blendMode: "normal",
          };
          addLogo(logo);
        };
        reader.readAsDataURL(processedFile);
      }

      e.target.value = "";
    },
    [addLogo]
  );

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 mb-2 font-medium">Step 02</p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#F0E6E0]">Logo <span className="font-semibold">& Mark</span></h2>
        <p className="text-sm text-[#F0E6E0]/65">
          Upload your logo variants. Images over 200KB are auto-compressed.
        </p>
      </div>

      <label className="flex flex-col items-center justify-center gap-2 p-10 border-2 border-dashed border-[rgba(240,230,224,0.18)] rounded-xl cursor-pointer hover:border-[rgba(240,230,224,0.55)] hover:bg-[rgba(240,230,224,0.05)] transition-all bg-[rgba(240,230,224,0.02)]">
        <Upload className="size-5 text-[#F0E6E0]/70" />
        <span className="text-sm text-[#F0E6E0]/70">
          Drop logos here or click to upload
        </span>
        <span className="text-[10px] text-[#F0E6E0]/50 tracking-[0.2em] uppercase font-medium">
          PNG, SVG
        </span>
        <input
          type="file"
          accept="image/png,image/svg+xml"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {logos.length > 0 && (
        <div className="space-y-3">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-[rgba(240,230,224,0.03)] backdrop-blur-md border border-[rgba(240,230,224,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(240,230,224,0.04)] hover:border-[rgba(240,230,224,0.2)] transition-all"
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 border border-[rgba(240,230,224,0.1)]"
                style={{ background: logo.defaultBackground }}
              >
                <img
                  src={logo.file}
                  alt={logo.label}
                  className="max-w-[40px] max-h-[40px] object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <input
                  value={logo.label}
                  onChange={(e) =>
                    updateLogo(logo.id, { label: e.target.value })
                  }
                  className="w-full bg-transparent border-0 p-0 text-sm text-[#F0E6E0] outline-none focus:text-[#F0E6E0] transition-colors"
                  placeholder="Logo label"
                />
                <span className="text-[9px] text-[#F0E6E0]/50 uppercase tracking-[0.2em] font-medium">
                  {logo.format}
                </span>
              </div>
              <button
                onClick={() => removeLogo(logo.id)}
                className="size-7 rounded-full flex items-center justify-center text-[#F0E6E0]/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
