"use client";

import { useEffect, useState } from "react";
import { BODY, DEEP, EMBER, CREAM } from "./shared";
import { readUtm, trackLeadSubmit, trackLeadSuccess } from "./analytics";

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(59,33,20,0.25)",
  background: "#FFFFFF",
  color: DEEP,
  fontFamily: BODY,
  fontWeight: 300,
  fontSize: 15.5,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: BODY,
  fontWeight: 500,
  fontSize: 13,
  letterSpacing: "0.02em",
  color: DEEP,
  marginBottom: 6,
};

export function IndustryLeadForm({ icpSlug }: { icpSlug: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [utm, setUtm] = useState<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }>({});

  useEffect(() => {
    setUtm(readUtm());
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    trackLeadSubmit(icpSlug);
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      name: String(data.get("name") || ""),
      business: String(data.get("business") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      company: String(data.get("company") || ""), // honeypot
      icpSlug,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
    };

    try {
      const res = await fetch("/api/industries/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({ ok: false }));

      if (res.ok && json.ok) {
        trackLeadSuccess(icpSlug);
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("error");
      setErrorMsg(
        json.error || "Something went wrong. Please try again, or email us directly."
      );
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again, or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(59,33,20,0.15)",
          borderRadius: 14,
          padding: "28px 24px",
          fontFamily: BODY,
          fontWeight: 300,
          fontSize: 16,
          lineHeight: 1.6,
          color: DEEP,
        }}
      >
        <strong style={{ fontWeight: 500 }}>Thanks, that&apos;s in.</strong> We&apos;ll get
        back to you within one business day.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }} className="icp-form-grid">
        <div>
          <label htmlFor="lf-name" style={labelStyle}>
            Your name
          </label>
          <input id="lf-name" name="name" type="text" required autoComplete="name" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="lf-business" style={labelStyle}>
            Business name
          </label>
          <input id="lf-business" name="business" type="text" required autoComplete="organization" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }} className="icp-form-grid">
        <div>
          <label htmlFor="lf-email" style={labelStyle}>
            Email
          </label>
          <input id="lf-email" name="email" type="email" required autoComplete="email" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="lf-phone" style={labelStyle}>
            Phone <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
          </label>
          <input id="lf-phone" name="phone" type="tel" autoComplete="tel" style={inputStyle} />
        </div>
      </div>

      <div>
        <label htmlFor="lf-message" style={labelStyle}>
          What do you need? <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={4}
          maxLength={500}
          style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
        />
      </div>

      {/* Honeypot — visually hidden, off-tab, not autofilled */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="lf-company">Company</label>
        <input id="lf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p
          role="alert"
          style={{
            fontFamily: BODY,
            fontWeight: 300,
            fontSize: 14,
            color: "#8a2b1a",
            margin: 0,
          }}
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="icp-lead-submit"
        style={{
          minHeight: 48,
          padding: "13px 28px",
          borderRadius: 999,
          border: "1px solid #90422C",
          background: EMBER,
          color: CREAM,
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 15.5,
          cursor: status === "submitting" ? "default" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
          justifySelf: "start",
        }}
      >
        {status === "submitting" ? "Sending…" : "Send it over"}
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-lead-submit:focus-visible,
        .icp-form-grid input:focus-visible,
        input:focus, textarea:focus { }
        .icp-form-grid input:focus, form textarea:focus {
          border-color: #90422C;
          box-shadow: 0 0 0 3px rgba(144,66,44,0.18);
        }
        .icp-lead-submit:focus-visible {
          outline: 2px solid #3B2114;
          outline-offset: 2px;
        }
        @media (min-width: 560px) {
          .icp-form-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `,
        }}
      />
    </form>
  );
}
