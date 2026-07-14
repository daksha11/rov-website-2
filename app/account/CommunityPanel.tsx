"use client";

/**
 * CTRL-A Community panel for /account.
 * The private half of the profile hub: toggle your public page on,
 * edit your bio, and track every submission (pending / approved /
 * featured / rejected, with the review note). Public page lives at
 * /ctrla/u/[handle]; handles auto-generate in SQL on first profile.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { STATUS_META, TOOLKITS, TYPE_META, type MySubmissionRow } from "@/lib/ctrla/community";

const supabase = createClient();

const C = {
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  plum: "#8E76B8",
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

const TONE_COLOR: Record<string, string> = {
  wait: C.plum,
  good: C.rose,
  great: C.gold,
  bad: "rgba(240,230,224,0.35)",
};

export default function CommunityPanel({ userId }: { userId: string }) {
  const [handle, setHandle] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [subs, setSubs] = useState<MySubmissionRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("handle, bio, is_public").eq("id", userId).single(),
        supabase
          .from("ctrla_submissions")
          .select("id, toolkit_slug, type, status, payload, review_note, created_at")
          .eq("author_id", userId)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      if (p) {
        setHandle(p.handle ?? null);
        setBio(p.bio ?? "");
        setIsPublic(!!p.is_public);
      }
      setSubs((s ?? []) as MySubmissionRow[]);
      setLoaded(true);
    };
    load();
  }, [userId]);

  async function save(nextPublic?: boolean) {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ bio: bio.trim() || null, is_public: nextPublic ?? isPublic })
      .eq("id", userId);
    setSaving(false);
    if (!error) {
      if (nextPublic !== undefined) setIsPublic(nextPublic);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  if (!loaded) return null;

  return (
    <div style={{ ...card, marginTop: 20, padding: "clamp(22px,4vw,30px)", fontFamily: NEUE }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 19, color: C.cream }}>
          CTRL-A Community
        </h2>
        <Link href="/ctrla/contribute" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#160C28", background: C.gold, borderRadius: 999, padding: "9px 18px", textDecoration: "none" }}>
          Contribute
        </Link>
      </div>

      {/* Public profile controls */}
      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        <button
          type="button"
          onClick={() => save(!isPublic)}
          disabled={saving}
          style={{ font: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: `1px solid ${isPublic ? "rgba(227,194,74,0.4)" : C.hair}`, borderRadius: 14, padding: "14px 18px", color: C.cream }}
        >
          <span>
            <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>Public profile</span>
            <span style={{ display: "block", marginTop: 3, fontSize: 12.5, color: C.faint }}>
              {isPublic && handle ? `Live at /ctrla/u/${handle}` : "Off. Turn on to show your contributions."}
            </span>
          </span>
          <span aria-hidden style={{ width: 42, height: 24, borderRadius: 999, flexShrink: 0, background: isPublic ? C.gold : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s ease" }}>
            <span style={{ position: "absolute", top: 3, left: isPublic ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: isPublic ? "#160C28" : C.faint, transition: "left 0.2s ease" }} />
          </span>
        </button>

        {isPublic && handle && (
          <Link href={`/ctrla/u/${handle}`} style={{ fontSize: 12.5, fontWeight: 600, color: C.gold, textDecoration: "none" }}>
            View your public page →
          </Link>
        )}

        <div>
          <label htmlFor="acct-bio" style={{ display: "block", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 600, marginBottom: 8 }}>
            Bio (shows on your public page)
          </label>
          <textarea
            id="acct-bio"
            value={bio}
            maxLength={280}
            onChange={(e) => setBio(e.target.value)}
            onBlur={() => save()}
            placeholder="One or two lines about what you make."
            style={{ width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 14, color: C.cream, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.hair}`, borderRadius: 12, padding: "12px 14px", minHeight: 70, resize: "vertical", outline: "none", lineHeight: 1.55 }}
          />
          {savedFlash && <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Saved</span>}
        </div>
      </div>

      {/* My submissions */}
      <h3 style={{ margin: "24px 0 12px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 15, color: C.cream }}>
        My submissions
      </h3>
      {subs.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
          Nothing yet. Suggest a tool, pitch an idea, or report a signal, and track it here.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {subs.map((s) => {
            const status = STATUS_META[s.status];
            return (
              <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.hair}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: TONE_COLOR[status.tone], borderRadius: 999, padding: "3px 10px" }}>
                    {status.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {TYPE_META[s.type]?.label ?? s.type} · {TOOLKITS.find((t) => t.slug === s.toolkit_slug)?.title ?? "General"}
                  </span>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 600, color: C.cream }}>{s.payload.title}</p>
                {s.status === "rejected" && s.review_note && (
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>
                    Note from review: {s.review_note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
