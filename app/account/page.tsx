"use client";

/**
 * /account · the personal profile view for every signed-in user.
 * Gated to any authenticated session (redirects home otherwise).
 * Role-aware: staff get quick links to the admin view and the customer view;
 * customers get a direct link to their portal. Everyone can sign out here.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const C = {
  cream: "#FFF4E3",
  espresso: "#3B2114",
  rust: "#90422C",
  orange: "#EA9A61",
  hair: "rgba(59,33,20,0.14)",
  faint: "rgba(59,33,20,0.60)",
  shadow: "0 1px 3px rgba(59,33,20,0.05), 0 10px 30px rgba(59,33,20,0.07)",
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
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }

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
      <main style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
    <main style={{ minHeight: "100vh", background: C.cream, color: C.espresso, padding: "clamp(28px,5vw,64px) clamp(18px,5vw,40px) 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Back link */}
        <Link href="/" style={{ fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.rust, textDecoration: "none", fontWeight: 600 }}>
          ← Range of View
        </Link>

        {/* Identity card */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${C.hair}`, borderRadius: 22, boxShadow: C.shadow, padding: "clamp(24px,5vw,38px)", marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="" width={84} height={84} style={{ borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.hair}` }} />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: C.rust, color: C.cream, display: "grid", placeItems: "center", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 30 }}>
              {initials(profile.name)}
            </div>
          )}
          <h1 style={{ margin: "10px 0 0", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: "clamp(24px,4vw,32px)", lineHeight: 1.1 }}>
            {profile.name}
          </h1>
          {profile.email && (
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, color: C.faint }}>{profile.email}</p>
          )}
          <span style={{ marginTop: 6, fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.rust, background: "rgba(144,66,44,0.08)", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "5px 14px", fontWeight: 600 }}>
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
                background: l.primary ? C.rust : "#FFFFFF",
                color: l.primary ? C.cream : C.espresso,
                border: `1px solid ${l.primary ? C.rust : C.hair}`,
                borderRadius: 16, padding: "18px 22px",
                boxShadow: C.shadow,
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 17 }}>{l.label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: l.primary ? "rgba(255,244,227,0.75)" : C.faint }}>{l.sub}</span>
              </span>
              <span style={{ fontSize: 18, opacity: 0.8 }}>→</span>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => setConfirmOpen(true)}
          type="button"
          style={{ marginTop: 20, width: "100%", font: "inherit", fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.faint, background: "transparent", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "13px", cursor: "pointer" }}
        >
          Sign out
        </button>
      </div>

      {/* Confirm sign out */}
      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(59,33,20,0.35)", backdropFilter: "blur(6px)", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#FFFFFF", border: `1px solid ${C.hair}`, borderRadius: 20, padding: "34px 32px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: C.shadow }}
          >
            <h2 style={{ margin: "0 0 8px", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 22 }}>Sign out?</h2>
            <p style={{ margin: "0 0 26px", fontFamily: "Inter, sans-serif", fontSize: 14, color: C.faint }}>You will need to sign in again to access your account.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setConfirmOpen(false)}
                type="button"
                style={{ flex: 1, font: "inherit", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: C.espresso, background: "transparent", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "12px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={signOut}
                type="button"
                style={{ flex: 1, font: "inherit", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: C.cream, background: C.rust, border: `1px solid ${C.rust}`, borderRadius: 999, padding: "12px", cursor: "pointer" }}
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
