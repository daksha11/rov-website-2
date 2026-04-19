"use client";

// OAuth callback landing page. Supabase JS client automatically detects and
// exchanges the auth code in the URL on initialization. We wait for the
// SIGNED_IN event then redirect to the portal.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        subscription.unsubscribe();
        router.replace("/portal");
      }
    });

    // Fallback: if already signed in (e.g. direct navigation), redirect now
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/portal");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "rgba(255,244,227,0.5)",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "14px",
        letterSpacing: "0.1em",
      }}
    >
      Signing you in...
    </div>
  );
}
