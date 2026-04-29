"use client";

import { useState } from "react";
import { FileText, Check } from "lucide-react";
import { Button } from "@/components/brand-kit/ui/button";
import { formatBrandSpec } from "@/lib/brand-kit/utils/formatBrandSpec";
import { downloadFile } from "@/lib/brand-kit/utils/downloadFile";
import { useToast } from "@/hooks/brand-kit/useToast";
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
  const pushToast = useToast((s) => s.push);

  const handleClick = () => {
    try {
      const slug =
        filename ||
        `${data.brandInfo.name || "brand"}-spec`
          .toLowerCase()
          .replace(/\s+/g, "-");
      const markdown = formatBrandSpec(data);
      downloadFile(markdown, `${slug}.md`, "text/markdown;charset=utf-8");
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
      pushToast(`${slug}.md downloaded`, "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? `Spec export failed: ${err.message}` : "Spec export failed",
        "error"
      );
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={className}
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
  );
}
