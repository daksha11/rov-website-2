"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Label } from "@/components/brand-kit/ui/label";
import { Button } from "@/components/brand-kit/ui/button";
import { Download, Check, Loader2 } from "lucide-react";
import ExportSpecButton from "@/components/brand-kit/ExportSpecButton";
import ExportTokensButton from "@/components/brand-kit/ExportTokensButton";
import ExportTailwindButton from "@/components/brand-kit/ExportTailwindButton";
import { useToast } from "@/hooks/brand-kit/useToast";

export default function ExportStep() {
  const data = useBrandKitStore(useShallow((s) => s.data));
  const brandName = data.brandInfo.name;
  const [fileName, setFileName] = useState(
    `${brandName || "brand"}-kit`.toLowerCase().replace(/\s+/g, "-")
  );
  const [exported, setExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const pushToast = useToast((s) => s.push);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { generateBrandKit } = await import("@/lib/brand-kit/generator");
      const data = useBrandKitStore.getState().data;
      const html = generateBrandKit(data);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
      pushToast(`${fileName}.html exported`, "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? `Export failed: ${err.message}` : "Export failed",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-md space-y-7">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#D0BEA5]/60 mb-2 font-medium">
          Step 08
        </p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#FFF4E3]">
          <span className="font-semibold">Export</span>
        </h2>
        <p className="text-sm text-[#FFF4E3]/65">
          Pick a layout format and download your brand kit.
        </p>
      </div>

      <div className="space-y-2">
        <Label>File Name</Label>
        <div className="flex items-center gap-2">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <span className="text-sm text-[#D0BEA5]/60 font-mono">.html</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          aria-busy={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Exporting…
            </>
          ) : exported ? (
            <>
              <Check className="size-4" />
              Exported
            </>
          ) : (
            <>
              <Download className="size-4" />
              Download HTML
            </>
          )}
        </Button>

        <ExportSpecButton data={data} filename={fileName} className="w-full" />

        <div className="pt-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#D0BEA5]/50 mb-2 font-medium">
            For developers
          </p>
          <div className="space-y-2">
            <ExportTokensButton
              data={data}
              filename={fileName}
              className="w-full"
            />
            <ExportTailwindButton
              data={data}
              filename={fileName}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
