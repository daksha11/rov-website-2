"use client";

/**
 * /account · the profile that IS the dashboard.
 * One scrolling surface for every signed-in user: identity up top
 * (avatar, handle, bio, public-page toggle), then the wallet (live
 * points + recent ledger activity), contributions, and the Studio
 * section, which is locked behind booking a session and comes alive
 * once the user has a client project.
 *
 * There is no "admin view / normal view" choice anymore: this page
 * is the normal view for everyone, staff included. Staff get one
 * quiet Admin link in the identity card, and that is the only
 * role-specific chrome.
 *
 * CTRL-A themed: cosmic sunset ground, cream text, gold + rose +
 * plum accents, Norwige / Neue Montreal. No italics.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import CommunityPanel from "./CommunityPanel";
import WalletCard from "./WalletCard";
import SavedKits from "./SavedKits";
import DashboardHUD, { type StreakStats } from "./DashboardHUD";

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
const BOOKING_URL = "https://cal.com/rov-studios-imhphw/15min";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

interface Profile {
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  handle: string | null;
  bio: string;
  isPublic: boolean;
}

interface ActivityRow {
  id: number;
  action: string;
  points: number;
  created_at: string;
}

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

/** 'spend:brand-kit-export' → "Brand kit export", 'daily-play' → "Daily play" */
function actionLabel(action: string) {
  const raw = action.replace(/^spend:/, "").split(":")[0].replace(/-/g, " ").trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function AccountPage() {
  const router = useRouter();
  const { points } = useCredits();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [hasProject, setHasProject] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [contribCount, setContribCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [streak, setStreak] = useState<StreakStats | null>(null);
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const uid = session.user.id;
      setUserId(uid);

      const meta = session.user.user_metadata || {};
      const fallbackName = meta.full_name || meta.name || session.user.email || "You";

      const [{ data: row }, { count: projCount }, { data: events }, { data: streakRow }] = await Promise.all([
        supabase
          .from("profiles")
          .select("role, full_name, email, handle, bio, is_public")
          .eq("id", uid)
          .single(),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("client_id", uid),
        supabase
          .from("credit_events")
          .select("id, action, points, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("user_streaks")
          .select("current_streak, longest_streak, taste_plays, taste_agreements")
          .eq("user_id", uid)
          .maybeSingle(),
      ]);

      setProfile({
        name: row?.full_name || fallbackName,
        email: row?.email || session.user.email || "",
        role: row?.role || "client",
        avatar: meta.avatar_url || meta.picture || null,
        handle: row?.handle ?? null,
        bio: row?.bio ?? "",
        isPublic: !!row?.is_public,
      });
      setBio(row?.bio ?? "");
      setIsPublic(!!row?.is_public);
      setHasProject((projCount ?? 0) > 0);
      setProjectCount(projCount ?? 0);
      setActivity((events ?? []) as ActivityRow[]);
      setStreak((streakRow as StreakStats) ?? null);
      setStatus("ok");
    };
    load();
  }, [router]);

  async function saveProfile(nextPublic?: boolean) {
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .update({ bio: bio.trim() || null, is_public: nextPublic ?? isPublic })
      .eq("id", userId);
    if (!error) {
      if (nextPublic !== undefined) setIsPublic(nextPublic);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  async function signOut() {
    setConfirmOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  }

  if (status === "checking" || !profile) {
    return (
      <main className="dash-ground" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: NEUE, fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Loading your profile...
        </p>
      </main>
    );
  }

  const isStaff = profile.role === "admin" || profile.role === "engineer";

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      {/* Signature accent bar */}
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      {/* Masthead */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: NEUE, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> Range of View
        </Link>
        <span style={{ fontFamily: NEUE, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          Profile
        </span>
      </div>

      {/* Hero band — the signature CTRL-A sunset */}
      <section className="dash-hero" style={{ height: "clamp(120px, 18vw, 180px)", display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${C.hair}`, marginTop: 14 }}>
        <div className="ctrla-grain" style={{ zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 640, margin: "0 auto", padding: "0 clamp(18px,5vw,40px) clamp(16px,4vw,24px)" }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.soft, textShadow: "0 1px 10px rgba(15,8,32,0.55)" }}>
            Range of View Studios
          </p>
          <h1 style={{ margin: "6px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1, color: C.cream, textShadow: "0 2px 20px rgba(15,8,32,0.65)" }}>
            {profile.name}
          </h1>
        </div>
      </section>

      {/* ── Studio doorway — only for clients (people with paid work). A
          compact, dignified strip; the full portal lives at /portal. Members
          without a paid project never see this, so it never crowds. ── */}
      {hasProject && (
        <div style={{ maxWidth: 940, margin: "18px auto 0", padding: "0 clamp(18px,5vw,40px)" }}>
          <Link
            href="/portal"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textDecoration: "none", background: "linear-gradient(135deg, #24123A 0%, #4E3D73 100%)", color: C.cream, border: "1px solid rgba(227,194,74,0.35)", borderRadius: 14, padding: "16px 22px", transition: "border-color 0.2s ease, transform 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(227,194,74,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(227,194,74,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: C.gold, borderRadius: 999, padding: "5px 12px", flexShrink: 0 }}>
                Studio
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: NORWIGE, fontWeight: 700, fontSize: 16 }}>Your client work</span>
                <span style={{ display: "block", fontSize: 12.5, color: C.soft }}>
                  {projectCount} active {projectCount === 1 ? "project" : "projects"} · mixes, revisions, deliverables
                </span>
              </span>
            </span>
            <span style={{ fontSize: 18, color: C.gold, flexShrink: 0 }}>→</span>
          </Link>
        </div>
      )}

      {/* ── Command center HUD — a wider band above the focused detail column ── */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "0 clamp(18px,5vw,40px)" }}>
        <DashboardHUD
          name={profile.name}
          points={points}
          streak={streak}
          contribCount={contribCount}
          featuredCount={featuredCount}
          handle={profile.handle}
          isPublic={isPublic}
        />
      </div>

      {/* Content — a two-column masonry dashboard, matched to the HUD width */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "clamp(28px,5vw,44px) clamp(18px,5vw,40px) 80px" }}>

        <div className="account-masonry">

          {/* ── Contributions (primary) ── */}
          {userId && (
            <CommunityPanel
              userId={userId}
              onCounts={(total, featured) => { setContribCount(total); setFeaturedCount(featured); }}
            />
          )}

          {/* ── Saved brand kits ── */}
          {userId && <SavedKits userId={userId} />}

          {/* ── Credits — earn & spend detail (balance lives in the HUD) ── */}
          <WalletCard points={points} hideBalance />

          {/* ── Recent activity (the wallet ledger) ── */}
          <section style={{ ...card, padding: "clamp(22px,4vw,30px)" }}>
            <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 19 }}>Recent activity</h2>
            {activity.length === 0 ? (
              <p style={{ margin: "14px 0 0", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
                Your points story starts here: earn by playing the CTRL-A daily, referring friends, and contributing. Spend on the brand kit generator and premium unlocks.
              </p>
            ) : (
              <div style={{ marginTop: 14, display: "grid", gap: 2 }}>
                {activity.map((a) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 2px", borderBottom: `1px solid ${C.hair}` }}>
                    <span style={{ fontSize: 13.5, color: C.soft }}>{actionLabel(a.action)}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: a.points >= 0 ? C.gold : C.faint }}>
                      {a.points >= 0 ? `+${a.points}` : a.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Work with ROV — a small, clear box for non-clients. Not a
              pitch baked into their stuff; its own little card, easy to skip. ── */}
          {!hasProject && (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...card, display: "block", padding: "clamp(18px,3.5vw,22px)", textDecoration: "none", transition: "border-color 0.2s ease, transform 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(227,194,74,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.hair; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>The studio behind CTRL-A</p>
              <p style={{ margin: "8px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 18, color: C.cream }}>Work with ROV</p>
              <p style={{ margin: "6px 0 12px", fontSize: 13, color: C.faint, lineHeight: 1.55 }}>
                Web, sound, video, and AI, built by the team behind CTRL-A.
              </p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>
                Book a call <span aria-hidden>→</span>
              </span>
            </a>
          )}

          {/* ── Profile & settings (demoted to the bottom) ── */}
          <section style={{ ...card, padding: "clamp(24px,5vw,30px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt="" width={56} height={56} style={{ borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.hair}` }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold} 0%, ${C.rose} 55%, ${C.plum} 100%)`, color: "#160C28", display: "grid", placeItems: "center", fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>
                  {initials(profile.name)}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 150 }}>
                <p style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 16, color: C.cream }}>Profile &amp; settings</p>
                {profile.handle && (
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: C.gold, fontWeight: 600 }}>@{profile.handle}</p>
                )}
                {profile.email && (
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.faint }}>{profile.email}</p>
                )}
              </div>
              {isStaff && (
                <Link href="/admin" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, background: "rgba(227,194,74,0.1)", border: "1px solid rgba(227,194,74,0.3)", borderRadius: 999, padding: "8px 18px", textDecoration: "none" }}>
                  Admin
                </Link>
              )}
            </div>

            {/* Public toggle */}
            <button
              type="button"
              onClick={() => saveProfile(!isPublic)}
              style={{ font: "inherit", marginTop: 18, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: `1px solid ${isPublic ? "rgba(227,194,74,0.4)" : C.hair}`, borderRadius: 14, padding: "14px 18px", color: C.cream }}
            >
              <span>
                <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>Public profile</span>
                <span style={{ display: "block", marginTop: 3, fontSize: 12.5, color: C.faint }}>
                  {isPublic && profile.handle ? `Live at /ctrla/u/${profile.handle}` : "Off. Turn on to show your contributions to the world."}
                </span>
              </span>
              <span aria-hidden style={{ width: 42, height: 24, borderRadius: 999, flexShrink: 0, background: isPublic ? C.gold : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s ease" }}>
                <span style={{ position: "absolute", top: 3, left: isPublic ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: isPublic ? "#160C28" : C.faint, transition: "left 0.2s ease" }} />
              </span>
            </button>

            {/* Bio */}
            <div style={{ marginTop: 14 }}>
              <label htmlFor="acct-bio" style={{ display: "block", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 600, marginBottom: 8 }}>
                Bio (shows on your public page)
              </label>
              <textarea
                id="acct-bio"
                value={bio}
                maxLength={280}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => saveProfile()}
                placeholder="One or two lines about what you make."
                style={{ width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 14, color: C.cream, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.hair}`, borderRadius: 12, padding: "12px 14px", minHeight: 64, resize: "vertical", outline: "none", lineHeight: 1.55 }}
              />
              {savedFlash && <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Saved</span>}
            </div>

            {/* Sign out */}
            <button
              onClick={() => setConfirmOpen(true)}
              type="button"
              style={{ marginTop: 18, width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.faint, background: "transparent", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "13px", cursor: "pointer", transition: "color 0.2s ease, border-color 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cream; e.currentTarget.style.borderColor = "rgba(240,230,224,0.28)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.faint; e.currentTarget.style.borderColor = C.hair; }}
            >
              Sign out
            </button>
          </section>

        </div>

        <style>{`
          .account-masonry { column-count: 2; column-gap: 16px; }
          .account-masonry > * {
            break-inside: avoid;
            -webkit-column-break-inside: avoid;
            margin: 0 0 16px;
            display: block;
          }
          @media (max-width: 720px) { .account-masonry { column-count: 1; } }
        `}</style>
      </div>

      {/* Confirm sign out */}
      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,8,32,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: C.panel, border: `1px solid ${C.hair}`, borderRadius: 20, padding: "34px 32px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 24px 60px rgba(15,8,32,0.55)" }}
          >
            <h2 style={{ margin: "0 0 8px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 22, color: C.cream }}>Sign out?</h2>
            <p style={{ margin: "0 0 26px", fontFamily: NEUE, fontSize: 14, color: C.faint }}>You will need to sign in again to access your account.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setConfirmOpen(false)}
                type="button"
                style={{ flex: 1, font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, color: C.cream, background: "transparent", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "12px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={signOut}
                type="button"
                style={{ flex: 1, font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, color: "#160C28", background: C.rose, border: `1px solid ${C.rose}`, borderRadius: 999, padding: "12px", cursor: "pointer" }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
