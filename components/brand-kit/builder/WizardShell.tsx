"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/brand-kit/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrandKitStore } from "@/lib/brand-kit/store";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6.2 L5.2 8.4 L9 4.6" />
    </svg>
  );
}

export const WIZARD_STEPS = [
  { id: "brand-info", label: "Brand Info", num: "01" },
  { id: "logo", label: "Logos", num: "02" },
  { id: "colors", label: "Colors", num: "03" },
  { id: "typography", label: "Typography", num: "04" },
  { id: "gradients", label: "Gradients", num: "05" },
  { id: "voice", label: "Brand Voice", num: "06" },
  { id: "sections", label: "Sections", num: "07" },
  { id: "export", label: "Export", num: "08" },
] as const;

const BASE = "/ctrla/brand-kit/builder";

export default function WizardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const brandName = useBrandKitStore((s) => s.data.brandInfo.name);
  const currentStep = WIZARD_STEPS.findIndex((s) =>
    pathname.endsWith(s.id)
  );
  const currentIdx = currentStep === -1 ? 0 : currentStep;
  const prevStep = currentIdx > 0 ? WIZARD_STEPS[currentIdx - 1] : null;
  const nextStep =
    currentIdx < WIZARD_STEPS.length - 1
      ? WIZARD_STEPS[currentIdx + 1]
      : null;

  const navRef = useRef<HTMLElement>(null);
  const activeStepRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        const activeEl = activeStepRef.current;
        if (!activeEl) return;
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [currentIdx]);

  return (
    <div className="flex flex-col h-full">
      <div className="relative border-b border-[rgba(208,190,165,0.1)]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(31,15,8,0.95) 0%, rgba(31,15,8,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-10"
          style={{
            background:
              "linear-gradient(to left, rgba(31,15,8,0.95) 0%, rgba(31,15,8,0) 100%)",
          }}
        />
      <nav
        ref={navRef}
        className="flex items-center gap-1 px-3 py-3 overflow-x-auto backdrop-blur-md bg-[rgba(31,15,8,0.72)] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {WIZARD_STEPS.map((step, i) => {
          const isActive = i === currentIdx;
          const isCompleted = i < currentIdx;
          return (
            <Link
              key={step.id}
              ref={isActive ? activeStepRef : null}
              href={`${BASE}/${step.id}`}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-full text-xs transition-all whitespace-nowrap",
                isActive
                  ? "text-[#3B2114]"
                  : isCompleted
                  ? "text-[#D0BEA5] hover:text-[#FFF4E3] hover:bg-[rgba(208,190,165,0.06)]"
                  : "text-[rgba(208,190,165,0.5)] hover:text-[#D0BEA5]"
              )}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[#D0BEA5] shadow-[0_2px_12px_rgba(201,169,97,0.35),inset_0_1px_0_rgba(229,194,106,0.5)]"
                />
              )}
              <span
                className={cn(
                  "relative w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0",
                  isActive
                    ? "bg-[#3B2114] text-[#FFF4E3]"
                    : isCompleted
                    ? "bg-[rgba(168,200,150,0.12)] text-[#A8C896] border border-[rgba(168,200,150,0.3)]"
                    : "bg-[rgba(208,190,165,0.06)] text-[rgba(208,190,165,0.5)]"
                )}
              >
                {isCompleted ? <CheckIcon /> : step.num}
              </span>
              <span className="relative hidden sm:inline font-medium">
                {step.label}
              </span>
            </Link>
          );
        })}
      </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">{children}</div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(208,190,165,0.08)] backdrop-blur-md bg-[rgba(20,10,5,0.82)] gap-3 overflow-hidden">
        <div className="flex-1 flex justify-start min-w-0">
          {prevStep ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`${BASE}/${prevStep.id}`}>
                <ArrowLeft className="size-3.5" />
                {prevStep.label}
              </Link>
            </Button>
          ) : null}
        </div>

        <div
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] select-none"
          aria-label={`Step ${currentIdx + 1} of ${WIZARD_STEPS.length}`}
        >
          <span className="text-[#D0BEA5]">
            {String(currentIdx + 1).padStart(2, "0")}
          </span>
          <span className="text-[#D0BEA5]/30">/</span>
          <span className="text-[#D0BEA5]/40">
            {String(WIZARD_STEPS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex-1 flex justify-end min-w-0">
          {nextStep ? (
            currentIdx === 0 && brandName.trim().length === 0 ? (
              <Button
                size="default"
                disabled
                title="Enter a brand name to continue"
              >
                {nextStep.label}
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button size="default" asChild>
                <Link href={`${BASE}/${nextStep.id}`}>
                  {nextStep.label}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
