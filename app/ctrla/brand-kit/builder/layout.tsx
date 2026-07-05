"use client";

import Link from "next/link";
import { useEffect } from "react";
import WizardShell from "@/components/brand-kit/builder/WizardShell";
import AutosaveIndicator from "@/components/brand-kit/builder/AutosaveIndicator";
import PreviewFrame from "@/components/brand-kit/preview/PreviewFrame";
import Toaster from "@/components/brand-kit/Toaster";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { KIT_SHARE_PARAM, decodeKit } from "@/lib/brand-kit/share";

export default function BrandKitBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The store persists to localStorage but skips automatic hydration to keep
  // the first client render matching the SSR defaults. Rehydrate after mount
  // so a mid-wizard refresh restores the user's work. Then, if the URL carries
  // a shared kit token, drop that kit in so the link opens ready to remix.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      KIT_SHARE_PARAM
    );
    // Rehydrate first, then apply the shared kit so localStorage cannot race in
    // and overwrite it. rehydrate() may return void, so normalize to a promise.
    void Promise.resolve(useBrandKitStore.persist.rehydrate()).then(() => {
      if (!token) return;
      const kit = decodeKit(token);
      if (kit) useBrandKitStore.getState().loadKit(kit);
    });
  }, []);

  return (
    <div className="brandkit-cosmic dash-ground min-h-[100dvh] flex flex-col text-[#F0E6E0]">
      {/* CTRL-A masthead */}
      <header
        className="relative flex-shrink-0"
        style={{
          background: "rgba(15,8,32,0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between gap-4" style={{ padding: "12px clamp(20px, 4vw, 40px)" }}>
          <div className="flex items-center gap-3">
            <Link href="/ctrla" aria-label="Back to CTRL-A" style={{ display: "block", lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ctrla/Logos/CTRL%20A_flat%20logo_white.svg"
                alt="CTRL-A"
                style={{ height: 24, width: "auto", display: "block" }}
              />
            </Link>
            <span aria-hidden style={{ width: 1, height: 20, background: "rgba(240,230,224,0.2)" }} />
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 21, lineHeight: 1, color: "#F0E6E0" }}>
              Brand Kit
            </span>
          </div>
          <div className="flex items-center gap-3">
            <AutosaveIndicator />
            <span aria-hidden className="hidden sm:block" style={{ width: 1, height: 16, background: "rgba(240,230,224,0.2)" }} />
            <span style={{ fontFamily: "'Neue Montreal', 'Roboto', sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#E3C24A", fontWeight: 600 }}>
              A ROV Creative Platform
            </span>
          </div>
        </div>
        {/* sunset horizon accent — the magazine gradient drawn as a rule */}
        <div
          aria-hidden
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent 0%, #4E3D73 18%, #A56A67 40%, #E3C24A 54%, #A56A67 68%, #4E3D73 86%, transparent 100%)",
          }}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Wizard panel */}
        <div className="w-full lg:w-[480px] lg:flex-shrink-0 flex flex-col overflow-y-auto">
          <WizardShell>{children}</WizardShell>
        </div>

        {/* Live preview — hidden on small screens */}
        <div className="hidden lg:flex flex-1 flex-col border-l border-[rgba(240,230,224,0.08)] bg-[rgba(0,0,0,0.25)]">
          <PreviewFrame />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
