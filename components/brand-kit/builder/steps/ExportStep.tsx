"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Label } from "@/components/brand-kit/ui/label";
import { Button } from "@/components/brand-kit/ui/button";
import { Download, Check, Loader2 } from "lucide-react";
import ExportSpecButton from "@/components/brand-kit/ExportSpecButton";
import SaveKitButton from "@/components/brand-kit/SaveKitButton";
import ShareKitButton from "@/components/brand-kit/ShareKitButton";
import ExportTokensButton from "@/components/brand-kit/ExportTokensButton";
import ExportTailwindButton from "@/components/brand-kit/ExportTailwindButton";
import { useToast } from "@/hooks/brand-kit/useToast";
import { usePoints } from "@/hooks/brand-kit/usePoints";
import { COSTS } from "@/lib/credits/config";
import ContactUsModal from "@/components/brand-kit/ContactUsModal";
import AuthModal from "@/components/brand-kit/AuthModal";

const EXPORT_COST = COSTS["brand-kit-export"];

export default function ExportStep() {
  const data = useBrandKitStore(useShallow((s) => s.data));
  const brandName = data.brandInfo.name;
  const [fileName, setFileName] = useState(
    `${brandName || "brand"}-kit`.toLowerCase().replace(/\s+/g, "-")
  );
  const [exported, setExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const pushToast = useToast((s) => s.push);
  // usePoints stays for the live balance/userId display; the spend itself now
  // runs server-side through /api/credits/spend so it lands in the ledger.
  const { points, loading: loadingPoints, userId } = usePoints();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleExport = async () => {
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    if (points !== null && points < EXPORT_COST) {
      setIsContactModalOpen(true);
      return;
    }

    setIsExporting(true);
    try {
      // 1. Spend server-side (checks balance, writes the ledger row atomically).
      const res = await fetch("/api/credits/spend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ item: "brand-kit-export" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        // 402 = not enough credits; anything else is a transient failure.
        if (res.status === 402) setIsContactModalOpen(true);
        else pushToast("Export could not start. Please try again.", "error");
        setIsExporting(false);
        return;
      }

      // 2. Generate and download (usePoints' realtime subscription reflects the
      // new balance automatically since the RPC updated brand_kit_credits).
      const { generateBrandKit } = await import("@/lib/brand-kit/generator");
      const kitData = useBrandKitStore.getState().data;
      const html = generateBrandKit(kitData);
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

      // Fire the reliable server-side export event (best-effort, non-blocking).
      fetch("/api/ctrla/brand-kit/exported", { method: "POST" }).catch(() => {});

      pushToast(`${EXPORT_COST} points have been deducted`, "success");
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
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 mb-2 font-medium">
          Step 08
        </p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#F0E6E0]">
          <span className="font-semibold">Export</span>
        </h2>
        <p className="text-sm text-[#F0E6E0]/65">
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
          <span className="text-sm text-[#F0E6E0]/60 font-mono">.html</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] tracking-[0.18em] uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#F0E6E0]/60 font-medium">
            Credits
          </label>
          <span className="text-[10px] font-mono tracking-wider text-[#F0E6E0]">
            {loadingPoints ? "..." : `${points ?? 0} / 1000`}
          </span>
        </div>
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
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#F0E6E0]/50 mb-2 font-medium">
            Save
          </p>
          <SaveKitButton className="w-full" />
          <p className="text-[11px] text-[#F0E6E0]/50 mt-2 leading-relaxed">
            Keeps your latest 3 kits on your account, on any device. Free, no credits.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#F0E6E0]/50 mb-2 font-medium">
            Share
          </p>
          <ShareKitButton data={data} />
        </div>

        <div className="pt-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#F0E6E0]/50 mb-2 font-medium">
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

      <ContactUsModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
