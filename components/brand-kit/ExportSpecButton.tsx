"use client";

import { useState } from "react";
import { FileText, Check } from "lucide-react";
import { Button } from "@/components/brand-kit/ui/button";
import { formatBrandSpec } from "@/lib/brand-kit/utils/formatBrandSpec";
import { downloadFile } from "@/lib/brand-kit/utils/downloadFile";
import { useToast } from "@/hooks/brand-kit/useToast";
import { usePoints } from "@/hooks/brand-kit/usePoints";
import ContactUsModal from "@/components/brand-kit/ContactUsModal";
import AuthModal from "@/components/brand-kit/AuthModal";
import type { BrandKitData } from "@/lib/brand-kit/types";

interface ExportSpecButtonProps {
  data: BrandKitData;
  filename?: string;
  className?: string;
}

export default function ExportSpecButton({
  data,
  filename,
  className,
}: ExportSpecButtonProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pushToast = useToast((s) => s.push);
  const { points, deductPoints, userId } = usePoints();

  const handleClick = async () => {
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    if (points !== null && points < 50) {
      setIsContactModalOpen(true);
      return;
    }

    setIsExporting(true);
    try {
      const deduction = await deductPoints(50);
      if (!deduction.success) {
        setIsContactModalOpen(true);
        return;
      }

      const slug =
        filename ||
        `${data.brandInfo.name || "brand"}-spec`
          .toLowerCase()
          .replace(/\s+/g, "-");
      const markdown = formatBrandSpec(data);
      downloadFile(markdown, `${slug}.md`, "text/markdown;charset=utf-8");
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
      
      pushToast("50 points have been deducted", "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? `Spec export failed: ${err.message}` : "Spec export failed",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        className={className}
        disabled={isExporting}
        size="lg"
      >
        {downloaded ? (
          <>
            <Check className="size-4" />
            Spec Downloaded
          </>
        ) : (
          <>
            <FileText className="size-4" />
            Download Dev Spec (.md)
          </>
        )}
      </Button>

      <ContactUsModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
