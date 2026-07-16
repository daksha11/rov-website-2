"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — CREDITS PANEL
// The engagement economy in one surface. Signed out, it invites a
// Google sign-in. Signed in, it shows the live balance, the ways to
// earn (follow on Instagram, refer a friend), and what credits unlock.
// Server-authoritative: earning goes through /api/credits, the browser
// only asks. Dark CTRL-A theme.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import { REWARDS, COSTS, INSTAGRAM_URL } from "@/lib/credits/config";

const VOID = "#0F0820";
const CREAM = "#F0E6E0";
const GOLD = "#E3C24A";
const PLUM = "#8E76B8";
const DIM = "rgba(240,230,224,0.62)";
const FAINT = "rgba(240,230,224,0.4)";
const LINE = "rgba(240,230,224,0.14)";
const GROT = "'Neue Montreal','Helvetica Neue',Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,serif";

const SITE = "https://www.rovstudios.com/ctrla";

type StreakRow = {
  current_streak: number;
  longest_streak: number;
  taste_plays: number;
  taste_agreements: number;
};

export default function CreditsPanel() {
  const { points, referralCode, userId, loading, signedIn, earn } = useCredits();
  const [igOpened, setIgOpened] = useState(false);
  const [igClaimed, setIgClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [streak, setStreak] = useState<StreakRow | null>(null);
  const [shareOpened, setShareOpened] = useState(false);
  const [shareClaimed, setShareClaimed] = useState(false);
  const [sharing, setSharing] = useState(false);

  // The Daily: streak + taste stats, live (user_streaks is in realtime).
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("user_streaks")
      .select("current_streak, longest_streak, taste_plays, taste_agreements")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setStreak(data as StreakRow);
      });
    const channel = supabase
      .channel(`streak_${userId}_${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_streaks", filter: `user_id=eq.${userId}` },
        (payload: { new: StreakRow }) => setStreak(payload.new)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_streaks", filter: `user_id=eq.${userId}` },
        (payload: { new: StreakRow }) => setStreak(payload.new)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Reflect an already-claimed Instagram follow on load.
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("credit_events")
      .select("action")
      .eq("user_id", userId)
      .eq("action", "follow-instagram")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setIgClaimed(true);
      });
  }, [userId]);

  // The share reward is weekly. Reflect a claim already made in the last 7
  // days so the button shows its claimed state (the server is the real gate).
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    supabase
      .from("credit_events")
      .select("created_at")
      .eq("user_id", userId)
      .eq("action", "social-engagement")
      .gte("created_at", weekAgo)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setShareClaimed(true);
      });
  }, [userId]);

  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  }

  async function claimInstagram() {
    setClaiming(true);
    const res = await earn("follow-instagram");
    setClaiming(false);
    if (res.ok) {
      setIgClaimed(true);
      setFlash(res.alreadyClaimed ? "Already claimed." : `+${REWARDS["follow-instagram"].points} credits`);
    } else {
      setFlash(res.error || "Could not claim. Try again.");
    }
    setTimeout(() => setFlash(null), 2600);
  }

  // Honor-system share: open a share sheet (or an X intent as fallback), then
  // reveal the claim. Weekly-capped server-side.
  async function shareCtrla() {
    const url = SITE;
    const text = "CTRL-A by Range of View: toolkits, a free brand kit generator, and a creative magazine.";
    try {
      const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string; url?: string }) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share({ title: "CTRL-A", text, url });
      } else {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
      }
    } catch {
      /* user dismissed the share sheet; still let them claim honor-system */
    }
    setShareOpened(true);
  }

  async function claimShare() {
    setSharing(true);
    const res = await earn("social-engagement");
    setSharing(false);
    if (res.ok) {
      setShareClaimed(true);
      setFlash(res.alreadyClaimed ? "Already claimed this week." : `+${REWARDS["social-engagement"].points} credits`);
    } else {
      setFlash(res.error || "Could not claim. Try again.");
    }
    setTimeout(() => setFlash(null), 2600);
  }

  const referralLink = referralCode ? `${SITE}?ref=${referralCode}` : "";

  function copyLink() {
    if (!referralLink) return;
    navigator.clipboard?.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div style={{ maxWidth: 560, width: "100%" }}>
      {/* Balance */}
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "clamp(20px,3vw,30px)", background: "rgba(240,230,224,0.02)" }}>
        <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Your credits</span>
        {signedIn ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 10 }}>
            <span style={{ fontFamily: GROT, fontWeight: 800, fontSize: "clamp(44px,8vw,72px)", lineHeight: 0.85, letterSpacing: "-0.03em", color: CREAM }}>
              {loading || points === null ? "···" : points.toLocaleString()}
            </span>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: DIM, marginBottom: 6 }}>credits</span>
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(17px,2.2vw,22px)", lineHeight: 1.4, color: CREAM, margin: "0 0 16px" }}>
              Sign in to start earning credits, then spend them on more tools.
            </p>
            <button onClick={signIn} style={btnPrimary}>Sign in with Google</button>
          </div>
        )}
      </div>

      {signedIn && (
        <>
          {/* The Daily: streak + taste stat */}
          <div style={{ marginTop: 24 }}>
            <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PLUM }}>The Daily</span>
            <div style={{ ...rowStyle, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={rowTitle}>
                  {streak && streak.current_streak > 0
                    ? `${streak.current_streak}-day streak`
                    : "Start a streak"}
                </div>
                <div style={rowSub}>
                  {streak && streak.taste_plays > 2
                    ? `You side with the editors ${Math.round((streak.taste_agreements / streak.taste_plays) * 100)}% of the time. Longest streak: ${streak.longest_streak}.`
                    : "One taste test a day. Play it, keep the streak, stack credits."}
                </div>
              </div>
              <a href="/ctrla/daily" style={{ ...pill, color: GOLD, borderColor: GOLD, textDecoration: "none" }}>
                Play today&apos;s →
              </a>
            </div>
          </div>

          {/* Earn */}
          <div style={{ marginTop: 24 }}>
            <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PLUM }}>Earn more</span>

            {/* Instagram */}
            <div style={rowStyle}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={rowTitle}>{REWARDS["follow-instagram"].label}</div>
                <div style={rowSub}>Follow, then claim. One time.</div>
              </div>
              {igClaimed ? (
                <span style={{ ...pill, color: VOID, background: GOLD, borderColor: GOLD }}>Claimed</span>
              ) : !igOpened ? (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIgOpened(true)}
                  style={{ ...pill, color: GOLD, borderColor: GOLD, textDecoration: "none" }}
                >
                  Follow →
                </a>
              ) : (
                <button onClick={claimInstagram} disabled={claiming} style={{ ...pill, color: VOID, background: GOLD, borderColor: GOLD, cursor: claiming ? "default" : "pointer" }}>
                  {claiming ? "..." : `Claim +${REWARDS["follow-instagram"].points}`}
                </button>
              )}
            </div>

            {/* Share CTRL-A (weekly) */}
            <div style={rowStyle}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={rowTitle}>{REWARDS["social-engagement"].label}</div>
                <div style={rowSub}>Share or tag CTRL-A, then claim. Once a week.</div>
              </div>
              {shareClaimed ? (
                <span style={{ ...pill, color: VOID, background: GOLD, borderColor: GOLD }}>Claimed</span>
              ) : !shareOpened ? (
                <button onClick={shareCtrla} style={{ ...pill, color: GOLD, borderColor: GOLD, cursor: "pointer" }}>
                  Share →
                </button>
              ) : (
                <button onClick={claimShare} disabled={sharing} style={{ ...pill, color: VOID, background: GOLD, borderColor: GOLD, cursor: sharing ? "default" : "pointer" }}>
                  {sharing ? "..." : `Claim +${REWARDS["social-engagement"].points}`}
                </button>
              )}
            </div>

            {/* Referral */}
            <div style={{ ...rowStyle, flexDirection: "column", alignItems: "stretch", gap: 12 }}>
              <div>
                <div style={rowTitle}>{REWARDS.referral.label}</div>
                <div style={rowSub}>Share your link. Earn {REWARDS.referral.points} credits for every friend who signs up.</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  readOnly
                  value={referralLink || "Generating your link..."}
                  onFocus={(e) => e.currentTarget.select()}
                  style={{ flex: 1, minWidth: 0, background: "rgba(0,0,0,0.25)", border: `1px solid ${LINE}`, borderRadius: 8, color: DIM, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12.5, padding: "10px 12px" }}
                />
                <button onClick={copyLink} disabled={!referralLink} style={{ ...pill, color: copied ? VOID : CREAM, background: copied ? GOLD : "transparent", borderColor: copied ? GOLD : "rgba(240,230,224,0.3)", cursor: referralLink ? "pointer" : "default" }}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Spend */}
          <div style={{ marginTop: 24 }}>
            <span style={{ fontFamily: GROT, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PLUM }}>Spend on</span>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {[
                ["Brand kit export", COSTS["brand-kit-export"]],
                ["Premium download", COSTS["premium-download"]],
                ["Premium course chapter", COSTS["premium-course"]],
              ].map(([label, cost]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", border: `1px solid ${LINE}`, borderRadius: 10 }}>
                  <span style={{ fontFamily: GROT, fontSize: 14, color: CREAM }}>{label}</span>
                  <span style={{ fontFamily: GROT, fontSize: 12, letterSpacing: "0.06em", color: GOLD }}>{cost} credits</span>
                </div>
              ))}
            </div>
          </div>

          {flash && (
            <div aria-live="polite" style={{ marginTop: 16, fontFamily: GROT, fontSize: 13, letterSpacing: "0.04em", color: GOLD }}>{flash}</div>
          )}
        </>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  fontFamily: GROT,
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: "0.02em",
  color: VOID,
  background: CREAM,
  border: "none",
  borderRadius: 999,
  padding: "13px 24px",
  cursor: "pointer",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  marginTop: 12,
  padding: "16px 18px",
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  background: "rgba(240,230,224,0.02)",
};

const rowTitle: React.CSSProperties = {
  fontFamily: GROT,
  fontWeight: 700,
  fontSize: "clamp(15px,1.8vw,18px)",
  letterSpacing: "-0.01em",
  color: CREAM,
};

const rowSub: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: 15,
  lineHeight: 1.4,
  color: DIM,
  marginTop: 4,
};

const pill: React.CSSProperties = {
  flexShrink: 0,
  fontFamily: GROT,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "10px 16px",
  border: "1px solid",
  borderRadius: 999,
  background: "transparent",
  whiteSpace: "nowrap",
};
