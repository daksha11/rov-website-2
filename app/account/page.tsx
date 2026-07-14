"use client";

/**
 * /account · the personal profile view for every signed-in user.
 * Gated to any authenticated session (redirects home otherwise).
 * Role-aware: staff get quick links to the admin view and the customer view;
 * customers get a direct link to their portal. Everyone can sign out here.
 *
 * CTRL-A themed: the cosmic sunset ground (dash-ground / dash-hero / grain),
 * cream text, gold + rose + plum accents, Norwige / Neue Montreal type. No
 * italics, matching the command center.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import CommunityPanel from "./CommunityPanel";

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

interface Profile {
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  engineer: "Engineer",
  client: "Client",
};

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUserId(session.user.id);

      const meta = session.user.user_metadata || {};
      const name = meta.full_name || meta.name || session.user.email || "You";

      const { data: row } = await supabase
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", session.user.id)
        .single();

      setProfile({
        name: row?.full_name || name,
        email: row?.email || session.user.email || "",
        role: row?.role || "client",
        avatar: meta.avatar_url || meta.picture || null,
      });
      setStatus("ok");
    };
    load();
  }, [router]);

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

  const links = isStaff
    ? [
        { label: "Admin view", sub: "The command center", href: "/admin", primary: true },
        { label: "Normal view", sub: "See what customers see", href: "/portal", primary: false },
      ]
    : [
        { label: "My projects", sub: "Your portal, tracks and deliverables", href: "/portal", primary: true },
      ];

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      {/* Signature accent bar */}
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      {/* Masthead */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: NEUE, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> Range of View
        </Link>
        <span style={{ fontFamily: NEUE, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          Profile
        </span>
      </div>

      {/* Hero band — the signature CTRL-A sunset */}
      <section className="dash-hero" style={{ height: "clamp(130px, 20vw, 200px)", display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${C.hair}`, marginTop: 14 }}>
        <div className="ctrla-grain" style={{ zIndex: 1 }} />
        <span style={{ position: "absolute", top: 16, right: "clamp(18px,5vw,40px)", zIndex: 2, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          A ROV Creative Platform
        </span>
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 560, margin: "0 auto", padding: "0 clamp(18px,5vw,40px) clamp(18px,4vw,28px)" }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.soft, textShadow: "0 1px 10px rgba(15,8,32,0.55)" }}>
            Range of View Studios
          </p>
          <h1 style={{ margin: "6px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(30px, 6vw, 52px)", lineHeight: 1, color: C.cream, textShadow: "0 2px 20px rgba(15,8,32,0.65)" }}>
            Your Profile
          </h1>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(18px,5vw,40px) 80px" }}>

        {/* Identity card */}
        <div style={{ ...card, padding: "clamp(24px,5vw,38px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="" width={84} height={84} style={{ borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.hair}` }} />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold} 0%, ${C.rose} 55%, ${C.plum} 100%)`, color: "#160C28", display: "grid", placeItems: "center", fontFamily: NORWIGE, fontWeight: 700, fontSize: 30 }}>
              {initials(profile.name)}
            </div>
          )}
          <h2 style={{ margin: "10px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(24px,4vw,32px)", lineHeight: 1.1, color: C.cream }}>
            {profile.name}
          </h2>
          {profile.email && (
            <p style={{ margin: 0, fontFamily: NEUE, fontSize: 14, color: C.faint }}>{profile.email}</p>
          )}
          <span style={{ marginTop: 6, fontFamily: NEUE, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, background: "rgba(227,194,74,0.1)", border: "1px solid rgba(227,194,74,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 600 }}>
            {ROLE_LABEL[profile.role] || profile.role}
          </span>
        </div>

        {/* Navigation */}
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                textDecoration: "none",
                background: l.primary ? "linear-gradient(135deg, #24123A 0%, #4E3D73 100%)" : "rgba(255,255,255,0.03)",
                color: C.cream,
                border: `1px solid ${l.primary ? "rgba(227,194,74,0.3)" : C.hair}`,
                borderRadius: 16, padding: "18px 22px",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(227,194,74,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = l.primary ? "rgba(227,194,74,0.3)" : C.hair; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: 17, color: C.cream }}>{l.label}</span>
                <span style={{ fontFamily: NEUE, fontSize: 13, color: C.faint }}>{l.sub}</span>
              </span>
              <span style={{ fontSize: 18, color: C.gold }}>→</span>
            </Link>
          ))}
        </div>

        {/* CTRL-A community hub: public profile toggle + my submissions */}
        {userId && <CommunityPanel userId={userId} />}

        {/* Sign out */}
        <button
          onClick={() => setConfirmOpen(true)}
          type="button"
          style={{ marginTop: 20, width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.faint, background: "transparent", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "13px", cursor: "pointer", transition: "color 0.2s ease, border-color 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.cream; e.currentTarget.style.borderColor = "rgba(240,230,224,0.28)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.faint; e.currentTarget.style.borderColor = C.hair; }}
        >
          Sign out
        </button>
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
