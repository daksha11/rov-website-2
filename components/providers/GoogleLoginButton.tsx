"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function GoogleLoginButton() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
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

  function handleDashboard() {
    setMenuOpen(false);
    if (user?.role === "admin" || user?.role === "engineer") {
      router.push("/admin");
    } else {
      router.push("/portal");
    }
  }

  if (user) {
    return (
      <>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            {user.name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 12px)",
                right: 0,
                minWidth: "180px",
                background: "rgba(10,10,10,0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,244,227,0.1)",
                borderRadius: "12px",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <button
                onClick={handleDashboard}
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
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Dashboard
              </button>
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
            </div>
          )}
        </div>

        {/* Sign out confirmation modal — portaled to body so it centers on screen */}
        {confirmOpen && createPortal(
          <div
            onClick={() => setConfirmOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              animation: "navConfirmFadeIn 0.25s ease-out forwards",
            }}
          >
            <style>{`
              @keyframes navConfirmFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
              @keyframes navConfirmCardIn {
                0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(18,18,18,0.95)",
                border: "1px solid rgba(255,244,227,0.1)",
                borderRadius: "20px",
                padding: "40px",
                maxWidth: "380px",
                width: "90%",
                textAlign: "center",
                animation: "navConfirmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <p style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "rgba(255,244,227,0.35)",
                marginBottom: "12px",
              }}>
                Confirm
              </p>
              <h2 style={{
                fontSize: "22px",
                fontFamily: "Norwige, sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#FFF4E3",
                margin: "0 0 8px 0",
              }}>
                Sign out?
              </h2>
              <p style={{
                fontSize: "14px",
                color: "rgba(255,244,227,0.4)",
                marginBottom: "32px",
                fontFamily: "'Roboto', sans-serif",
              }}>
                You will need to sign in again to access your account.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button
                  onClick={() => setConfirmOpen(false)}
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,244,227,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#FFF4E3",
                    fontSize: "13px",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,244,227,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,244,227,0.12)";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(234,154,97,0.3)",
                    background: "rgba(234,154,97,0.12)",
                    color: "#EA9A61",
                    fontSize: "13px",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(234,154,97,0.2)";
                    e.currentTarget.style.borderColor = "rgba(234,154,97,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(234,154,97,0.12)";
                    e.currentTarget.style.borderColor = "rgba(234,154,97,0.3)";
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>,
        document.body)}
      </>
    );
  }

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
    >
      Login
    </button>
  );
}
