"use client";

/**
 * /ctrla/contribute · the community submission form.
 * One form, four shapes: suggest a tool, pitch an idea, report a
 * signal, share a resource. Google-gated (submissions need an
 * author). Posts to /api/ctrla/submissions; everything lands as
 * "pending" until Andi reviews it in /admin/ctrla.
 *
 * CTRL-A themed: cosmic sunset ground, cream text, gold accents,
 * Norwige / Neue Montreal. No italics.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  TOOLKITS,
  TYPE_META,
  type SubmissionType,
  type ToolkitSlug,
} from "@/lib/ctrla/community";

const supabase = createClient();

const C = {
  ground: "#0F0820",
  panel: "#24123A",
  plum: "#4E3D73",
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  hair: "rgba(240,230,224,0.1)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};
const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
const NORWIGE = "Norwige, sans-serif";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  font: "inherit",
  fontFamily: NEUE,
  fontSize: 15,
  color: C.cream,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${C.hair}`,
  borderRadius: 12,
  padding: "13px 16px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: NEUE,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: C.faint,
  fontWeight: 600,
  marginBottom: 8,
};

const TYPES = Object.keys(TYPE_META) as SubmissionType[];
const LEVELS = ["Beginner", "Intermediate", "Pro"] as const;
const KINDS = ["Release", "Shift", "Trend", "Sunset"] as const;

export default function ContributePage() {
  const [auth, setAuth] = useState<"checking" | "out" | "in">("checking");
  const [type, setType] = useState<SubmissionType>("tool");
  const [toolkit, setToolkit] = useState<ToolkitSlug>("web-dev");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [level, setLevel] = useState<string>("");
  const [kind, setKind] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session ? "in" : "out");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuth(session ? "in" : "out");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/ctrla/contribute` },
    });
  }

  const meta = TYPE_META[type];
  const needsUrl = type === "tool" || type === "resource";
  const bodyLabel =
    type === "tool" ? "Why it earns a slot" :
    type === "idea" ? "The pitch" :
    type === "signal" ? "What changed" : "Why it helped (optional)";

  const canSubmit =
    title.trim().length >= 2 &&
    (!needsUrl || url.trim().length > 4) &&
    (type === "resource" || body.trim().length >= 10);

  async function submit() {
    if (!canSubmit || sending) return;
    setSending(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = { type, title: title.trim() };
      if (meta.needsToolkit || (type === "idea" && toolkit)) payload.toolkitSlug = toolkit;
      if (needsUrl || (type === "signal" && url.trim())) payload.url = url.trim();
      if (body.trim()) payload.body = body.trim();
      if (type === "tool") {
        const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6);
        if (tags.length) payload.tags = tags;
        if (level) payload.level = level;
      }
      if (type === "signal" && kind) payload.kind = kind;

      const res = await fetch("/api/ctrla/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Something went wrong. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  }

  function resetForAnother() {
    setDone(false);
    setTitle(""); setUrl(""); setBody(""); setTagsRaw(""); setLevel(""); setKind("");
  }

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      {/* Masthead */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> CTRL-A
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          Contribute
        </span>
      </div>

      {/* Hero */}
      <section className="dash-hero" style={{ height: "clamp(130px, 20vw, 200px)", display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${C.hair}`, marginTop: 14 }}>
        <div className="ctrla-grain" style={{ zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 640, margin: "0 auto", padding: "0 clamp(18px,5vw,40px) clamp(18px,4vw,28px)" }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.soft, textShadow: "0 1px 10px rgba(15,8,32,0.55)" }}>
            Built with the community
          </p>
          <h1 style={{ margin: "6px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(30px, 6vw, 52px)", lineHeight: 1, color: C.cream, textShadow: "0 2px 20px rgba(15,8,32,0.65)" }}>
            Add to CTRL-A
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(18px,5vw,40px) 80px" }}>
        {auth === "checking" && (
          <p style={{ fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center" }}>
            Checking your session...
          </p>
        )}

        {auth === "out" && (
          <div style={{ ...card, padding: "clamp(28px,5vw,40px)", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 24 }}>Sign in to contribute</h2>
            <p style={{ margin: "10px 0 24px", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
              Every submission carries its author. Sign in with Google and your picks live on your public CTRL-A profile.
            </p>
            <button
              onClick={signIn}
              type="button"
              style={{ font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#160C28", background: C.gold, border: "none", borderRadius: 999, padding: "14px 32px", cursor: "pointer" }}
            >
              Continue with Google
            </button>
          </div>
        )}

        {auth === "in" && done && (
          <div style={{ ...card, padding: "clamp(28px,5vw,40px)", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 26, color: C.gold }}>Got it. It is in review.</h2>
            <p style={{ margin: "10px 0 26px", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
              We read everything. If it makes the wall, you will get an email and it shows up on your profile with your name on it.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={resetForAnother} type="button" style={{ font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, color: "#160C28", background: C.gold, border: "none", borderRadius: 999, padding: "13px 26px", cursor: "pointer" }}>
                Submit another
              </button>
              <Link href="/account" style={{ display: "inline-flex", alignItems: "center", fontFamily: NEUE, fontSize: 13, fontWeight: 600, color: C.cream, border: `1px solid ${C.hair}`, borderRadius: 999, padding: "13px 26px", textDecoration: "none" }}>
                My submissions
              </Link>
            </div>
          </div>
        )}

        {auth === "in" && !done && (
          <>
            {/* Type picker */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{
                    font: "inherit", fontFamily: NEUE, textAlign: "left", cursor: "pointer",
                    background: t === type ? "linear-gradient(135deg, #24123A 0%, #4E3D73 100%)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${t === type ? "rgba(227,194,74,0.45)" : C.hair}`,
                    borderRadius: 14, padding: "14px 16px", color: C.cream,
                  }}
                >
                  <span style={{ display: "block", fontFamily: NORWIGE, fontWeight: 700, fontSize: 15 }}>{TYPE_META[t].label}</span>
                  <span style={{ display: "block", marginTop: 4, fontSize: 12, color: C.faint, lineHeight: 1.45 }}>{TYPE_META[t].blurb}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ ...card, padding: "clamp(22px,4vw,32px)", marginTop: 16, display: "grid", gap: 20 }}>
              {/* Toolkit chips */}
              <div>
                <span style={labelStyle}>{meta.needsToolkit ? "Which toolkit" : "Which toolkit (optional)"}</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TOOLKITS.map((tk) => (
                    <button
                      key={tk.slug}
                      type="button"
                      onClick={() => setToolkit(tk.slug)}
                      style={{
                        font: "inherit", fontFamily: NEUE, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                        letterSpacing: "0.06em",
                        color: toolkit === tk.slug ? "#160C28" : C.soft,
                        background: toolkit === tk.slug ? C.gold : "rgba(255,255,255,0.04)",
                        border: `1px solid ${toolkit === tk.slug ? C.gold : C.hair}`,
                        borderRadius: 999, padding: "9px 18px",
                      }}
                    >
                      {tk.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="c-title">
                  {type === "tool" ? "Tool name" : type === "resource" ? "Resource name" : type === "signal" ? "Headline" : "Idea title"}
                </label>
                <input id="c-title" style={inputStyle} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "tool" ? "e.g. Figma" : type === "signal" ? "e.g. Figma ships AI layout" : "Give it a name"} />
              </div>

              {(needsUrl || type === "signal") && (
                <div>
                  <label style={labelStyle} htmlFor="c-url">{type === "signal" ? "Link (optional)" : "Link"}</label>
                  <input id="c-url" style={inputStyle} value={url} maxLength={300} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" />
                </div>
              )}

              <div>
                <label style={labelStyle} htmlFor="c-body">{bodyLabel}</label>
                <textarea id="c-body" style={{ ...inputStyle, minHeight: 110, resize: "vertical", lineHeight: 1.55 }} value={body}
                  maxLength={type === "idea" ? 1200 : 600} onChange={(e) => setBody(e.target.value)}
                  placeholder={type === "tool" ? "The moment you reach for it, and what it replaced for you." : type === "idea" ? "What it is, who it is for, why CTRL-A is the place for it." : "Keep it real. One or two sentences is plenty."} />
              </div>

              {type === "tool" && (
                <>
                  <div>
                    <label style={labelStyle} htmlFor="c-tags">Tags (comma separated, optional)</label>
                    <input id="c-tags" style={inputStyle} value={tagsRaw} maxLength={160} onChange={(e) => setTagsRaw(e.target.value)} placeholder="e.g. free, browser, ai" />
                  </div>
                  <div>
                    <span style={labelStyle}>Level (optional)</span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {LEVELS.map((l) => (
                        <button key={l} type="button" onClick={() => setLevel(level === l ? "" : l)}
                          style={{ font: "inherit", fontFamily: NEUE, fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: level === l ? "#160C28" : C.soft, background: level === l ? C.rose : "rgba(255,255,255,0.04)", border: `1px solid ${level === l ? C.rose : C.hair}`, borderRadius: 999, padding: "9px 18px" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {type === "signal" && (
                <div>
                  <span style={labelStyle}>Kind (optional)</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {KINDS.map((k) => (
                      <button key={k} type="button" onClick={() => setKind(kind === k ? "" : k)}
                        style={{ font: "inherit", fontFamily: NEUE, fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: kind === k ? "#160C28" : C.soft, background: kind === k ? C.rose : "rgba(255,255,255,0.04)", border: `1px solid ${kind === k ? C.rose : C.hair}`, borderRadius: 999, padding: "9px 18px" }}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p style={{ margin: 0, fontSize: 13, color: C.rose, fontWeight: 600 }}>{error}</p>
              )}

              <button
                onClick={submit}
                disabled={!canSubmit || sending}
                type="button"
                style={{
                  font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#160C28", background: canSubmit && !sending ? C.gold : "rgba(227,194,74,0.35)",
                  border: "none", borderRadius: 999, padding: "15px", cursor: canSubmit && !sending ? "pointer" : "default",
                  transition: "background 0.2s ease",
                }}
              >
                {sending ? "Sending..." : "Submit for review"}
              </button>
              <p style={{ margin: "-6px 0 0", fontSize: 12, color: C.faint, textAlign: "center", lineHeight: 1.5 }}>
                Everything is reviewed by a human before it goes live. You will get an email either way.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
