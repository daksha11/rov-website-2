"use client";

import { Check, AlertTriangle, Info, X } from "lucide-react";
import { useToast, type ToastTone } from "@/hooks/brand-kit/useToast";
import { cn } from "@/lib/utils";

const ICONS: Record<ToastTone, React.ReactNode> = {
  success: <Check className="size-4" />,
  error: <AlertTriangle className="size-4" />,
  info: <Info className="size-4" />,
};

const TONE_CLASSES: Record<ToastTone, string> = {
  success:
    "border-[rgba(168,200,150,0.35)] text-[#A8C896] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(168,200,150,0.1)]",
  error:
    "border-[rgba(220,120,100,0.45)] text-[#E89178] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(220,120,100,0.12)]",
  info:
    "border-[rgba(208,190,165,0.35)] text-[#D0BEA5] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(208,190,165,0.1)]",
};

export default function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-full bg-[rgba(42,24,16,0.92)] backdrop-blur-xl border text-[12px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-200",
            TONE_CLASSES[t.tone]
          )}
        >
          <span className="flex items-center justify-center size-6 rounded-full bg-black/25">
            {ICONS[t.tone]}
          </span>
          <span className="text-[#FFF4E3] font-medium whitespace-nowrap">
            {t.message}
          </span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="ml-1 flex items-center justify-center size-6 rounded-full text-[#FFF4E3]/50 hover:text-[#FFF4E3] hover:bg-white/5 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
