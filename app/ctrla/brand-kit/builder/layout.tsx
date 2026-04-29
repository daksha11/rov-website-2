"use client";

import WizardShell from "@/components/brand-kit/builder/WizardShell";
import PreviewFrame from "@/components/brand-kit/preview/PreviewFrame";
import Toaster from "@/components/brand-kit/Toaster";

export default function BrandKitBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col text-[#FFF4E3]"
      style={{ background: "linear-gradient(160deg, #1F0F08 0%, #110808 60%, #0D0505 100%)" }}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Wizard panel */}
        <div className="w-full lg:w-[480px] lg:flex-shrink-0 flex flex-col overflow-y-auto">
          <WizardShell>{children}</WizardShell>
        </div>

        {/* Live preview — hidden on small screens */}
        <div className="hidden lg:flex flex-1 flex-col border-l border-[rgba(208,190,165,0.08)] bg-[rgba(0,0,0,0.25)]">
          <PreviewFrame />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
