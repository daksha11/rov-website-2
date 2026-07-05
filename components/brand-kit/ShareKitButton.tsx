"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/brand-kit/ui/button";
import { useToast } from "@/hooks/brand-kit/useToast";
import { buildShareUrl } from "@/lib/brand-kit/share";
import { currentVolume } from "@/app/ctrla/_volumes";
import type { BrandKitData } from "@/lib/brand-kit/types";

interface ShareKitButtonProps {
  data: BrandKitData;
  className?: string;
}

/**
 * Copies a shareable, remixable kit URL to the clipboard. The link carries the
 * palette, type, gradients, voice, and structure — but not uploaded logos or
 * embedded fonts, which are too heavy for a URL. Opening the link loads the kit
 * into the builder ready to edit. No points are spent to share.
 */
export default function ShareKitButton({ data, className }: ShareKitButtonProps) {
  const [copied, setCopied] = useState(false);
  const pushToast = useToast((s) => s.push);

  const handleShare = async () => {
    try {
      const url = buildShareUrl(data, currentVolume.issueMeta.volume);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        window.prompt("Copy this kit link:", url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      pushToast("Kit link copied to clipboard", "success");
    } catch {
      pushToast("Could not copy the kit link", "error");
    }
  };

  return (
    <div className={className}>
      <Button variant="outline" onClick={handleShare} className="w-full" size="lg">
        {copied ? (
          <>
            <Check className="size-4" />
            Link Copied
          </>
        ) : (
          <>
            <Link2 className="size-4" />
            Share Kit (copy link)
          </>
        )}
      </Button>
      <p className="mt-2 text-[11px] leading-relaxed text-[#F0E6E0]/45">
        Anyone with the link can remix this kit in the builder. Logos and
        uploaded fonts are not included in shared links.
      </p>
    </div>
  );
}
