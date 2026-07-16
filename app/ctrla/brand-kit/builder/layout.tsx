"use client";

import Link from "next/link";
import { useEffect } from "react";
import WizardShell from "@/components/brand-kit/builder/WizardShell";
import AutosaveIndicator from "@/components/brand-kit/builder/AutosaveIndicator";
import PreviewFrame from "@/components/brand-kit/preview/PreviewFrame";
import Toaster from "@/components/brand-kit/Toaster";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { KIT_SHARE_PARAM, decodeKit } from "@/lib/brand-kit/share";
import { useLeadSync } from "@/hooks/useLeadSync";
import { createClient } from "@/utils/supabase/client";
import type { BrandKitData } from "@/lib/brand-kit/types";

export default function BrandKitBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Once a user signs in to build a kit, sync them into the CTRL-A email
  // list (best-effort, deduped). No added friction to the builder flow.
  useLeadSync("brand-kit");

  // The store persists to localStorage but skips automatic hydration to keep
  // the first client render matching the SSR defaults. Rehydrate after mount
  // so a mid-wizard refresh restores the user's work. Then, if the URL carries
  // a shared kit token, drop that kit in so the link opens ready to remix.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get(KIT_SHARE_PARAM);
    const kitId = params.get("kit_id");
    // Rehydrate first, then apply an incoming kit so localStorage cannot race in
    // and overwrite it. rehydrate() may return void, so normalize to a promise.
    void Promise.resolve(useBrandKitStore.persist.rehydrate()).then(async () => {
      // Resume a saved kit by id (own kits only, enforced by RLS). Full data,
      // logos included, so it opens exactly where it was saved.
      if (kitId) {
        try {
          const supabase = createClient();
          const { data } = await supabase.from("brand_kits").select("data").eq("id", kitId).maybeSingle();
          if (data?.data) {
            useBrandKitStore.getState().loadFullKit(data.data as BrandKitData);
            return;
          }
        } catch {
          /* fall through to any share token */
        }
      }
      if (!token) return;
      const kit = decodeKit(token);
      if (kit) useBrandKitStore.getState().loadKit(kit);
    });
  }, []);

  return (
    <div className="brandkit-cosmic dash-ground min-h-[100dvh] flex flex-col text-[#F0E6E0]">
      {/* Phone-sized screens are too cramped to build a kit. Block below the
          md breakpoint (768px) so iPad portrait and up still get the builder,
          and point phone visitors to a bigger screen. The scrim covers the
          builder entirely so it can't be interacted with on a phone. */}
      <div
        className="md:hidden fixed inset-0 z-[100] flex items-center justify-center"
        style={{
          padding: "24px",
          background: "rgba(9,5,18,0.9)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
      >
        {/* popup card */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="brandkit-device-title"
          className="flex flex-col items-center text-center"
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "36px 28px 30px",
            borderRadius: 22,
            background: "rgba(15,8,32,0.96)",
            border: "1px solid rgba(240,230,224,0.12)",
            boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 18 }}>💻✨</div>
          <h1
            id="brandkit-device-title"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: 29,
              lineHeight: 1.15,
              color: "#F0E6E0",
              marginBottom: 12,
            }}
          >
            Best built on a bigger screen
          </h1>
          <p
            style={{
              fontFamily: "'Neue Montreal', 'Roboto', sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(240,230,224,0.75)",
              maxWidth: 300,
              marginBottom: 24,
            }}
          >
            The Brand Kit builder isn&apos;t available on phones. Switch to an
            iPad or desktop to design your kit with room to breathe.
          </p>
          <Link
            href="/ctrla"
            style={{
              fontFamily: "'Neue Montreal', 'Roboto', sans-serif",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#E3C24A",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(227,194,74,0.4)",
              borderRadius: 999,
              padding: "11px 20px",
            }}
          >
            Back to CTRL-A
          </Link>
          {/* sunset horizon accent to match the masthead */}
          <div
            aria-hidden
            style={{
              marginTop: 28,
              width: 160,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #4E3D73 18%, #A56A67 40%, #E3C24A 54%, #A56A67 68%, #4E3D73 86%, transparent 100%)",
            }}
          />
        </div>
      </div>

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
            <Link
              href="/ctrla/credits"
              style={{ fontFamily: "'Neue Montreal', 'Roboto', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E3C24A", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(227,194,74,0.4)", borderRadius: 999, padding: "6px 12px" }}
            >
              Earn credits
            </Link>
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
