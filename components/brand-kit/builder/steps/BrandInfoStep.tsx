"use client";

import { Sparkles } from "lucide-react";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Textarea } from "@/components/brand-kit/ui/textarea";
import { Label } from "@/components/brand-kit/ui/label";
import { SAMPLE_BRAND } from "@/lib/brand-kit/utils/sampleBrand";

function FieldAccent({ error }: { error?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "3px",
        height: "13px",
        borderRadius: "2px",
        background: error ? "#E89178" : "rgba(227,194,74,0.5)",
        flexShrink: 0,
        transition: "background 0.2s ease",
      }}
    />
  );
}

export default function BrandInfoStep() {
  const brandInfo = useBrandKitStore((s) => s.data.brandInfo);
  const setBrandInfo = useBrandKitStore((s) => s.setBrandInfo);
  const loadSample = useBrandKitStore((s) => s.loadSample);

  const nameMissing = brandInfo.name.trim().length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.28em",
              color: "rgba(227,194,74,0.65)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Step 01
          </span>
          <span
            aria-hidden
            style={{
              flex: "0 0 28px",
              height: "1px",
              background: "rgba(227,194,74,0.25)",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "rgba(240,230,224,0.28)",
              textTransform: "uppercase",
            }}
          >
            Identity
          </span>
        </div>

        {/* Headline — Norwige italic, editorial scale */}
        <h2
          style={{
            fontFamily: "Norwige, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(40px, 10vw, 56px)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "#F0E6E0",
            margin: 0,
          }}
        >
          Brand
          <br />
          <span style={{ color: "#E3C24A" }}>Information</span>
        </h2>

        {/* Body */}
        <p
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            lineHeight: 1.75,
            color: "rgba(240,230,224,0.48)",
            margin: 0,
            maxWidth: "340px",
          }}
        >
          Start with the basics — your brand name and details.
        </p>
      </div>

      {/* ── Sample Brand Card ── */}
      <button
        type="button"
        onClick={() => loadSample(SAMPLE_BRAND)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "16px 20px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(227,194,74,0.09) 0%, rgba(227,194,74,0.04) 100%)",
          border: "1px solid rgba(227,194,74,0.26)",
          cursor: "pointer",
          textAlign: "left",
          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
          overflow: "hidden",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(227,194,74,0.15) 0%, rgba(227,194,74,0.07) 100%)";
          e.currentTarget.style.borderColor = "rgba(227,194,74,0.5)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(36,18,58,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(227,194,74,0.09) 0%, rgba(227,194,74,0.04) 100%)";
          e.currentTarget.style.borderColor = "rgba(227,194,74,0.26)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(227,194,74,0.55)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(227,194,74,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(227,194,74,0.26)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-40%",
            left: "-8%",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(227,194,74,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Icon + copy */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, position: "relative" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(227,194,74,0.1)",
              border: "1px solid rgba(227,194,74,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={17} color="#E3C24A" strokeWidth={1.8} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#F0E6E0",
                marginBottom: "3px",
                letterSpacing: "0.01em",
              }}
            >
              Load Sample Brand
            </div>
            <div
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "11px",
                color: "rgba(240,230,224,0.42)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Populate with CTRL-A, the Range of View creative platform
            </div>
          </div>
        </div>

        {/* CTA label */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            fontWeight: 700,
            color: "#E3C24A",
            textTransform: "uppercase",
            flexShrink: 0,
            position: "relative",
          }}
        >
          Try it
        </span>
      </button>

      {/* ── Divider ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "-8px 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "rgba(240,230,224,0.08)" }} />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "rgba(240,230,224,0.25)",
            textTransform: "uppercase",
          }}
        >
          Details
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(240,230,224,0.08)" }} />
      </div>

      {/* ── Form Fields ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

        {/* Brand Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FieldAccent error={nameMissing} />
            <Label>
              Brand Name{" "}
              <span style={{ color: nameMissing ? "#E89178" : "rgba(227,194,74,0.55)" }}>*</span>
            </Label>
          </div>
          <Input
            value={brandInfo.name}
            onChange={(e) => setBrandInfo({ name: e.target.value })}
            placeholder="Range of View Studios"
            aria-invalid={nameMissing}
            className={
              nameMissing
                ? "border-[rgba(220,120,100,0.45)] focus-visible:ring-[rgba(220,120,100,0.4)]"
                : undefined
            }
          />
          {nameMissing && (
            <p
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "11px",
                color: "rgba(232,145,120,0.85)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              A brand name is required to continue. This appears as the title of your exported kit.
            </p>
          )}
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FieldAccent />
            <Label>Tagline</Label>
          </div>
          <Input
            value={brandInfo.tagline}
            onChange={(e) => setBrandInfo({ tagline: e.target.value })}
            placeholder="Crafting visual stories"
          />
        </div>

        {/* Website */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FieldAccent />
            <Label>Website</Label>
          </div>
          <Input
            value={brandInfo.website}
            onChange={(e) => setBrandInfo({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        {/* Version + Year — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FieldAccent />
              <Label>Version</Label>
            </div>
            <Input
              value={brandInfo.version}
              onChange={(e) => setBrandInfo({ version: e.target.value })}
              placeholder="v1.0"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FieldAccent />
              <Label>Year</Label>
            </div>
            <Input
              value={brandInfo.year}
              onChange={(e) => setBrandInfo({ year: e.target.value })}
              placeholder="2025"
            />
          </div>
        </div>

        {/* Confidentiality Note */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FieldAccent />
            <Label>Confidentiality Note</Label>
          </div>
          <Textarea
            value={brandInfo.confidentialityNote}
            onChange={(e) => setBrandInfo({ confidentialityNote: e.target.value })}
            placeholder="Internal Use Only — Not for external distribution"
            rows={2}
            className="resize-none"
          />
        </div>

      </div>
    </div>
  );
}
