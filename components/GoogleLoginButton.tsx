"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import SignOutConfirmModal from "@/components/SignOutConfirmModal";

interface User {
  name: string;
  role: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

export default function GoogleLoginButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    const open = authOpen || menuOpen;
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAuthOpen(false);
        setMenuOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAuthOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [authOpen, menuOpen]);

  async function handleGoogleLogin() {
    setLoading(true);
    setOauthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setOauthError(error.message);
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setConfirmOpen(false);
      return;
    }
    setConfirmOpen(false);
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  function handleDashboard() {
    setMenuOpen(false);
    router.push(user?.role === "admin" ? "/admin" : "/portal");
  }

  if (user) {
    return (
      <>
        <div ref={wrapperRef} className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            className="w-7 h-7 rounded-full bg-white/10 border border-white/20 hover:border-white/40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Account menu"
          >
            <span className="text-[10px] font-medium text-white/80 leading-none">
              {getInitials(user.name)}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-[calc(100%+12px)] right-0 min-w-[180px] bg-[rgba(10,10,10,0.9)] backdrop-blur-[16px] border border-[rgba(255,244,227,0.1)] rounded-xl p-1.5 flex flex-col gap-0.5 z-50">
              {user.role === "admin" && (
                <button
                  onClick={() => { setMenuOpen(false); router.push("/ctrla"); }}
                  type="button"
                  className="w-full px-3.5 py-2.5 text-left text-[13px] text-[#FFF4E3] hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleDashboard}
                type="button"
                className="w-full px-3.5 py-2.5 text-left text-[13px] text-[#FFF4E3] hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <div className="h-px bg-[rgba(255,244,227,0.08)] mx-2 my-0.5" />
              <button
                onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                type="button"
                className="w-full px-3.5 py-2.5 text-left text-[13px] text-[rgba(255,244,227,0.5)] hover:bg-white/[0.08] hover:text-[#FFF4E3] rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {confirmOpen && (
          <SignOutConfirmModal
            onConfirm={handleSignOut}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setAuthOpen((prev) => !prev)}
        type="button"
        className="flex items-center justify-center px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="Sign in"
      >
        <UserCircle2 className="w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
      </button>

      {authOpen && (
        <div className="absolute bottom-[calc(100%+16px)] right-0 w-[260px] bg-[rgba(10,10,10,0.92)] backdrop-blur-[16px] border border-[rgba(255,244,227,0.1)] rounded-2xl p-4 flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Client Portal
            </span>
            <span className="text-base text-white font-medium">
              Welcome back
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 rounded-xl text-white/80 text-[13px] transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {oauthError && (
            <p className="text-[11px] text-red-400/70 text-center">{oauthError}</p>
          )}
        </div>
      )}
    </div>
  );
}
