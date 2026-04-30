"use client";

import { useState } from "react";
import { Braces, Check } from "lucide-react";
import { Button } from "@/components/brand-kit/ui/button";
import { formatTokens } from "@/lib/brand-kit/utils/formatTokens";
import { downloadFile } from "@/lib/brand-kit/utils/downloadFile";
import { useToast } from "@/hooks/brand-kit/useToast";
import type { BrandKitData } from "@/lib/brand-kit/types";

interface Props {
  data: BrandKitData;
  filename?: string;
  className?: string;
}

export default function ExportTokensButton({
  data,
  filename,
  className,
}: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const pushToast = useToast((s) => s.push);

  const handleClick = () => {
    try {
      const slug =
        filename ||
        `${data.brandInfo.name || "brand"}-tokens`
          .toLowerCase()
          .replace(/\s+/g, "-");
      const json = formatTokens(data);
      downloadFile(json, `${slug}.json`, "application/json;charset=utf-8");
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
      pushToast(`${slug}.json downloaded`, "success");
    } catch (err) {
      pushToast(
        err instanceof Error
          ? `Tokens export failed: ${err.message}`
          : "Tokens export failed",
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
          Tokens Downloaded
        </>
      ) : (
        <>
          <Braces className="size-4" />
          Download Tokens (.json)
        </>
      )}
    </Button>
  );
}
