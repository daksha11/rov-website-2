"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE DAILY (taste test)
// One judgment call per day, same for everyone. Pick the sharper
// of two options, then the reveal: what percent of readers sided
// with you, and the editor's note on why one is stronger. Signed
// in, plays feed a streak and pay credits; anonymous plays get the
// reveal and a nudge to start a streak. Server-authoritative: the
// browser never sees the answer until it has voted.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCredits } from "@/hooks/useCredits";

const VOID = "#0F0820";
const CREAM = "#F0E6E0";
const GOLD = "#E3C24A";
const PLUM = "#8E76B8";
const DIM = "rgba(240,230,224,0.62)";
const LINE = "rgba(240,230,224,0.14)";
const GROT = "'Neue Montreal','Helvetica Neue',Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,serif";

const SITE = "https://www.rovstudios.com/ctrla/daily";

type Option = { label?: string; text?: string; image?: string; credit?: string };

type Challenge = {
  date: string;
  number: number | null;
  prompt: string;
  optionA: Option;
  optionB: Option;
};

type Reveal = {
  choice: "a" | "b";
  matched: boolean;
  countsA: number;
  countsB: number;
  editorsPick: "a" | "b";
  editorsNote: string;
  streak?: number;
  longest?: number;
  awarded?: number;
  tastePlays?: number;
  tasteAgreements?: number;
  signedIn?: boolean;
};

const playedKey = (date: string) => `ctrla_daily_${date}`;

export default function DailyTasteTest() {
  const { referralCode, signedIn } = useCredits();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "closed" | "error">("loading");
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [submitting, setSubmitting] = useState<"a" | "b" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/daily");
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        if (!data.ok) {
          setStatus(data.code === "no_challenge" ? "closed" : "error");
          return;
        }
        const ch: Challenge = {
          date: data.date,
          number: data.number,
          prompt: data.prompt,
          optionA: data.optionA ?? {},
          optionB: data.optionB ?? {},
        };
        setChallenge(ch);
        // Already played on this device today? Restore the reveal.
        try {
          const cached = localStorage.getItem(playedKey(ch.date));
          if (cached) setReveal(JSON.parse(cached));
        } catch {
          /* ignore */
        }
        setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function play(choice: "a" | "b") {
    if (!challenge || reveal || submitting) return;
    setSubmitting(choice);
    try {
      const res = await fetch("/api/daily/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.ok) {
        setStatus("error");
        return;
      }
      const r: Reveal = data;
      setReveal(r);
      try {
        localStorage.setItem(playedKey(challenge.date), JSON.stringify(r));
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(null);
    }
  }

  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  }

  const total = (reveal?.countsA ?? 0) + (reveal?.countsB ?? 0);
  const pctA = total ? Math.round(((reveal?.countsA ?? 0) / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;
  const myPct = reveal ? (reveal.choice === "a" ? pctA : pctB) : 0;

  const shareText = useMemo(() => {
    if (!reveal || !challenge) return "";
    const no = challenge.number ? `No. ${String(challenge.number).padStart(2, "0")}` : "";
    const lines = [
      `CTRL A · Taste Test ${no}`,
      `I sided with the ${myPct}%${reveal.matched ? " · called the editors' pick" : ""}`,
    ];
    if (reveal.streak && reveal.streak > 1) lines.push(`Streak: ${reveal.streak} days`);
    lines.push(referralCode ? `${SITE}?ref=${referralCode}` : SITE);
    return lines.join("\n");
  }, [reveal, challenge, myPct, referralCode]);

  function share() {
    if (!shareText) return;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => copyShare());
    } else {
      copyShare();
    }
  }

  function copyShare() {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  if (status === "loading") {
    return <p style={{ fontFamily: SERIF, fontStyle: "italic", color: DIM, fontSize: 18 }}>Setting today&apos;s test...</p>;
  }
  if (status === "closed") {
    return (
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: 28 }}>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", color: CREAM, fontSize: 20, margin: 0 }}>
          No test today. The next one lands at midnight, Atlanta time.
        </p>
      </div>
    );
  }
  if (status === "error" || !challenge) {
    return (
      <p style={{ fontFamily: SERIF, fontStyle: "italic", color: DIM, fontSize: 18 }}>
        Something slipped. Refresh and try again.
      </p>
    );
  }

  return (
    <div style={{ maxWidth: 760, width: "100%" }}>
      {/* Masthead line */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
          Taste Test{challenge.number ? ` · No. ${String(challenge.number).padStart(2, "0")}` : ""}
        </span>
        <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM }}>
          One per day
        </span>
      </div>

      {/* The question */}
      <p style={{ fontFamily: SERIF, fontSize: "clamp(19px,2.6vw,26px)", lineHeight: 1.35, color: CREAM, margin: "0 0 22px" }}>
        {challenge.prompt}
      </p>

      {/* The two options */}
      <div className="ctrla-daily-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {(["a", "b"] as const).map((key) => {
          const opt = key === "a" ? challenge.optionA : challenge.optionB;
          const pct = key === "a" ? pctA : pctB;
          const isMine = reveal?.choice === key;
          const isEditors = reveal?.editorsPick === key;
          return (
            <button
              key={key}
              onClick={() => play(key)}
              disabled={!!reveal || !!submitting}
              style={{
                textAlign: "left",
                border: `1px solid ${isMine ? GOLD : isEditors ? PLUM : LINE}`,
                borderRadius: 14,
                padding: "18px 18px 16px",
                background: "rgba(240,230,224,0.02)",
                cursor: reveal ? "default" : "pointer",
                position: "relative",
                overflow: "hidden",
                opacity: submitting && submitting !== key ? 0.55 : 1,
                transition: "border-color 200ms ease, opacity 200ms ease",
              }}
            >
              {/* Reveal fill bar behind the content */}
              {reveal && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    height: 4,
                    width: `${pct}%`,
                    background: isEditors ? GOLD : PLUM,
                    transition: "width 900ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              )}
              <span style={{ fontFamily: GROT, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}>
                {opt.label || (key === "a" ? "Option A" : "Option B")}
              </span>
              {opt.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={opt.image}
                  alt={opt.label || ""}
                  style={{ width: "100%", borderRadius: 8, margin: "10px 0 4px", display: "block" }}
                />
              ) : null}
              {opt.text ? (
                <span style={{ display: "block", fontFamily: SERIF, fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.4, color: CREAM, marginTop: 10 }}>
                  {opt.text}
                </span>
              ) : null}
              {reveal && (
                <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
                  <span style={{ fontFamily: GROT, fontWeight: 800, fontSize: 22, color: isEditors ? GOLD : CREAM }}>{pct}%</span>
                  {isEditors && (
                    <span style={{ fontFamily: GROT, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>
                      Editors&apos; pick
                    </span>
                  )}
                  {isMine && (
                    <span style={{ fontFamily: GROT, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
                      Your call
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* The reveal */}
      {reveal && (
        <div style={{ marginTop: 22 }}>
          <div style={{ border: `1px solid ${LINE}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 12, padding: "18px 20px" }}>
            <span style={{ fontFamily: GROT, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
              Why
            </span>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.5, color: CREAM, margin: "8px 0 0" }}>
              {reveal.editorsNote}
            </p>
          </div>

          {/* Streak + credits, or the sign-in nudge */}
          {reveal.signedIn ?? signedIn ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              {typeof reveal.streak === "number" && reveal.streak > 0 && (
                <span style={statPill}>Streak · {reveal.streak} {reveal.streak === 1 ? "day" : "days"}</span>
              )}
              {typeof reveal.awarded === "number" && reveal.awarded > 0 && (
                <span style={{ ...statPill, color: VOID, background: GOLD, borderColor: GOLD }}>+{reveal.awarded} credits</span>
              )}
              {typeof reveal.tastePlays === "number" && reveal.tastePlays > 2 && (
                <span style={statPill}>
                  Sides with the editors {Math.round(((reveal.tasteAgreements ?? 0) / reveal.tastePlays) * 100)}% of the time
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: 14, border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px" }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: DIM }}>
                Your pick counted. Sign in and tomorrow starts a streak.
              </span>
              <button onClick={signIn} style={{ fontFamily: GROT, fontWeight: 700, fontSize: 13, color: VOID, background: CREAM, border: "none", borderRadius: 999, padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap" }}>
                Sign in with Google
              </button>
            </div>
          )}

          {/* Share */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={share} style={{ fontFamily: GROT, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, background: "transparent", border: `1px solid ${GOLD}`, borderRadius: 999, padding: "10px 18px", cursor: "pointer" }}>
              {copied ? "Copied" : "Share your result"}
            </button>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: DIM, alignSelf: "center" }}>
              Next test at midnight ET.
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 560px) {
          .ctrla-daily-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const statPill: React.CSSProperties = {
  fontFamily: GROT,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: CREAM,
  padding: "9px 14px",
  border: `1px solid ${LINE}`,
  borderRadius: 999,
  background: "rgba(240,230,224,0.02)",
};
