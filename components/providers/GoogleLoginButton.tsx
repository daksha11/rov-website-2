"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useLeadSync } from "@/hooks/useLeadSync";

const supabase = createClient();

// ─────────────────────────────────────────────────────────────
// Two premium treatments for the sign-in / sign-out boxes.
// Everywhere on the site uses the warm "brown" identity; anything
// under /ctrla switches to the CTRL-A cosmic palette so the auth
// chrome always belongs to the room it opens in.
// ─────────────────────────────────────────────────────────────
type AuthTheme = {
  backdrop: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  glow: string;
  eyebrow: string;
  headingFont: string;
  headingStyle: "italic" | "normal";
  bodyFont: string;
  text: string;
  dim: string;
  ring: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  primaryBg: string;
  primaryText: string;
  primaryShadow: string;
  cancelBorder: string;
  cancelText: string;
};

const BROWN_THEME: AuthTheme = {
  backdrop: "rgba(18,9,4,0.72)",
  cardBg: "linear-gradient(165deg, #3B2114 0%, #2A1710 55%, #1A0D07 100%)",
  cardBorder: "1px solid rgba(234,154,97,0.22)",
  cardShadow:
    "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,244,227,0.03) inset, 0 1px 0 rgba(255,244,227,0.08) inset",
  glow: "radial-gradient(120% 80% at 50% -10%, rgba(234,154,97,0.20), transparent 62%)",
  eyebrow: "rgba(234,154,97,0.8)",
  headingFont: "Norwige, sans-serif",
  headingStyle: "normal",
  bodyFont: "'Roboto', sans-serif",
  text: "#FFF4E3",
  dim: "rgba(255,244,227,0.55)",
  ring: "rgba(255,244,227,0.12)",
  iconBg: "rgba(234,154,97,0.12)",
  iconBorder: "rgba(234,154,97,0.35)",
  iconColor: "#EA9A61",
  primaryBg: "linear-gradient(135deg, #EA9A61 0%, #C56A3C 55%, #90422C 100%)",
  primaryText: "#FFF4E3",
  primaryShadow: "0 12px 34px rgba(144,66,44,0.45)",
  cancelBorder: "rgba(255,244,227,0.14)",
  cancelText: "rgba(255,244,227,0.8)",
};

const CTRLA_THEME: AuthTheme = {
  backdrop: "rgba(10,6,20,0.74)",
  cardBg: "linear-gradient(165deg, #241539 0%, #150C29 55%, #0C0619 100%)",
  cardBorder: "1px solid rgba(227,194,74,0.22)",
  cardShadow:
    "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,230,224,0.03) inset, 0 1px 0 rgba(240,230,224,0.08) inset",
  glow: "radial-gradient(120% 80% at 50% -10%, rgba(227,194,74,0.16), transparent 62%)",
  eyebrow: "rgba(227,194,74,0.78)",
  headingFont: "'Instrument Serif', Georgia, serif",
  headingStyle: "normal",
  bodyFont: "'Neue Montreal','Helvetica Neue',Arial,sans-serif",
  text: "#F0E6E0",
  dim: "rgba(240,230,224,0.55)",
  ring: "rgba(240,230,224,0.14)",
  iconBg: "rgba(227,194,74,0.1)",
  iconBorder: "rgba(227,194,74,0.35)",
  iconColor: "#E3C24A",
  primaryBg: "linear-gradient(135deg, #ECD463 0%, #E3C24A 42%, #C79A2E 100%)",
  primaryText: "#1A1004",
  primaryShadow: "0 12px 34px rgba(227,194,74,0.3)",
  cancelBorder: "rgba(240,230,224,0.16)",
  cancelText: "rgba(240,230,224,0.8)",
};

function GoogleG() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden focusable="false" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.5 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.6 5.6C41.8 36.4 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function GoogleLoginButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isCtrlA = pathname?.startsWith("/ctrla") ?? false;
  const t = isCtrlA ? CTRLA_THEME : BROWN_THEME;
  // Global auth chrome: mount the Klaviyo lead sync here so the FIRST
  // authenticated session on ANY page reaches Klaviyo, including someone who
  // signed in with Google before ever giving us their email through a form.
  // Deduped per user inside the hook, best-effort, never blocks the UI.
  useLeadSync("account");
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ bottom?: number; top?: number; right: number }>({ bottom: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const meta = session.user.user_metadata;
      const name = meta?.full_name || meta?.name || session.user.email || "User";

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      setUser({ name, role: profile?.role || "client" });
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkSession();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inMenu = menuRef.current?.contains(target);
      const inButton = btnRef.current?.contains(target);
      if (!inMenu && !inButton) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close either box on Escape.
  useEffect(() => {
    if (!signInOpen && !confirmOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSignInOpen(false);
        setConfirmOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signInOpen, confirmOpen]);

  async function handleGoogleLogin() {
    // CTRL-A sign-ins land back on the CTRL-A page they came from; everywhere
    // else returns home.
    const redirectTo = isCtrlA
      ? `${window.location.origin}${window.location.pathname}`
      : `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) console.error("Google login error:", error.message);
  }

  async function handleSignOut() {
    setConfirmOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  const isStaff = user?.role === "admin" || user?.role === "engineer";
  // The profile IS the dashboard for everyone; staff just get Admin on top.
  const menuLinks = isStaff
    ? [
        { label: "Profile", path: "/account" },
        { label: "Admin", path: "/admin" },
      ]
    : [{ label: "Profile", path: "/account" }];

  function go(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  function toggleMenu() {
    if (!menuOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      // Anchor the portaled menu just above the initials button, unless the
      // button sits high in the viewport (the nav panel places it wherever it
      // lands) — then flip below so the menu stays on screen.
      const right = Math.round(Math.max(8, window.innerWidth - r.right));
      setMenuPos(
        r.top < 180
          ? { top: Math.round(r.bottom + 12), right }
          : { bottom: Math.round(window.innerHeight - r.top + 12), right }
      );
    }
    setMenuOpen((prev) => !prev);
  }

  // Shared premium box shell (backdrop + card + top glow), themed by context.
  function AuthBox({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    return createPortal(
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.backdrop,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          animation: "authFadeIn 0.25s ease-out forwards",
        }}
      >
        <style>{`
          @keyframes authFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes authCardIn {
            0% { opacity: 0; transform: scale(0.96) translateY(12px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            overflow: "hidden",
            background: t.cardBg,
            border: t.cardBorder,
            borderRadius: 22,
            padding: "42px 40px 34px",
            maxWidth: 396,
            width: "90%",
            textAlign: "center",
            boxShadow: t.cardShadow,
            animation: "authCardIn 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Top glow wash */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: t.glow, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </div>
      </div>,
      document.body
    );
  }

  const eyebrowStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontFamily: t.bodyFont,
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    color: t.eyebrow,
    marginBottom: 16,
  };

  if (user) {
    return (
      <>
        <div style={{ position: "relative" }}>
          <button
            ref={btnRef}
            onClick={toggleMenu}
            type="button"
            className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            {user.name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </button>

          {menuOpen && createPortal(
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                ...(menuPos.top !== undefined ? { top: menuPos.top } : { bottom: menuPos.bottom }),
                right: menuPos.right,
                zIndex: 100000,
                minWidth: "180px",
                background: "rgba(10,10,10,0.9)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,244,227,0.1)",
                borderRadius: "12px",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {menuLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  type="button"
                  style={{
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "#FFF4E3",
                    fontSize: "13px",
                    fontFamily: "'Roboto', sans-serif",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "background 0.2s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {item.label}
                </button>
              ))}
              <div style={{ height: "1px", background: "rgba(255,244,227,0.08)", margin: "2px 8px" }} />
              <button
                onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                type="button"
                style={{
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,244,227,0.5)",
                  fontSize: "13px",
                  fontFamily: "'Roboto', sans-serif",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#FFF4E3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,244,227,0.5)";
                }}
              >
                Sign Out
              </button>
            </div>,
            document.body
          )}
        </div>

        {/* Sign out confirmation — premium box, themed by context */}
        {confirmOpen && (
          <AuthBox onClose={() => setConfirmOpen(false)}>
            <span style={eyebrowStyle}>Confirm</span>
            <h2 style={{
              fontSize: 30,
              fontFamily: t.headingFont,
              fontWeight: 700,
              fontStyle: t.headingStyle,
              color: t.text,
              margin: "0 0 10px",
              lineHeight: 1.05,
            }}>
              Sign out?
            </h2>
            <p style={{
              fontSize: 14.5,
              lineHeight: 1.5,
              color: t.dim,
              margin: "0 0 30px",
              fontFamily: t.bodyFont,
            }}>
              You will need to sign in again to access your account.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setConfirmOpen(false)}
                type="button"
                style={{
                  flex: 1,
                  padding: "13px 20px",
                  borderRadius: 9999,
                  border: `1px solid ${t.cancelBorder}`,
                  background: "rgba(255,255,255,0.04)",
                  color: t.cancelText,
                  fontSize: 13,
                  fontFamily: t.bodyFont,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                type="button"
                style={{
                  flex: 1,
                  padding: "13px 20px",
                  borderRadius: 9999,
                  border: "none",
                  background: t.primaryBg,
                  color: t.primaryText,
                  fontSize: 13,
                  fontFamily: t.bodyFont,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  boxShadow: t.primaryShadow,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Sign Out
              </button>
            </div>
          </AuthBox>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setSignInOpen(true)}
        type="button"
        className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
      >
        Login
      </button>

      {/* Sign in — premium box, themed by context */}
      {signInOpen && (
        <AuthBox onClose={() => setSignInOpen(false)}>
          {/* Mark */}
          <div style={{
            width: 58,
            height: 58,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: t.iconBg,
            border: `1px solid ${t.iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={t.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>

          <span style={eyebrowStyle}>{isCtrlA ? "CTRL-A Access" : "Range of View"}</span>
          <h2 style={{
            fontSize: 30,
            fontFamily: t.headingFont,
            fontWeight: 700,
            fontStyle: t.headingStyle,
            color: t.text,
            margin: "0 0 10px",
            lineHeight: 1.05,
          }}>
            {isCtrlA ? "Welcome in" : "Welcome back"}
          </h2>
          <p style={{
            fontSize: 14.5,
            lineHeight: 1.55,
            color: t.dim,
            margin: "0 auto 28px",
            maxWidth: 300,
            fontFamily: t.bodyFont,
          }}>
            {isCtrlA
              ? "Sign in to earn credits, save your brand kits, and pick up your streak where you left off."
              : "Sign in with Google to reach your profile, projects, and account."}
          </p>

          <button
            onClick={handleGoogleLogin}
            type="button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 20px",
              borderRadius: 9999,
              border: "none",
              background: t.primaryBg,
              color: t.primaryText,
              fontSize: 14,
              fontFamily: t.bodyFont,
              fontWeight: 700,
              letterSpacing: "0.02em",
              cursor: "pointer",
              boxShadow: t.primaryShadow,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ background: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GoogleG />
            </span>
            Continue with Google
          </button>

          <button
            onClick={() => setSignInOpen(false)}
            type="button"
            style={{
              marginTop: 16,
              background: "transparent",
              border: "none",
              color: t.dim,
              fontSize: 12.5,
              fontFamily: t.bodyFont,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = t.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.dim; }}
          >
            Not now
          </button>
        </AuthBox>
      )}
    </>
  );
}
