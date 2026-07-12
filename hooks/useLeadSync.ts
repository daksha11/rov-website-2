import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// ─────────────────────────────────────────────────────────────
// useLeadSync — push an authenticated user's email into Klaviyo once.
//
// Leads captured through Supabase auth (the brand-kit Google sign-in)
// would otherwise never reach the CTRL-A email list. This best-effort
// hook syncs a logged-in user's email to Klaviyo the first time we see
// them, deduped per user via localStorage, and marks them a known lead
// so the soft ToolGates open without re-asking. It never blocks the UI
// and fails silently.
// ─────────────────────────────────────────────────────────────
export function useLeadSync(source: string) {
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;
        const email = user?.email;
        if (!email || cancelled) return;

        const key = `ctrla_klaviyo_synced_${user.id}`;
        if (localStorage.getItem(key)) return;

        const meta = (user.user_metadata || {}) as Record<string, unknown>;
        const name =
          (meta.full_name as string | undefined) || (meta.name as string | undefined);

        const res = await fetch("/api/klaviyo/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, source }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          localStorage.setItem(key, "1");
          // A known lead: open the soft gates without nagging them again.
          localStorage.setItem("ctrla_unlocked", "1");
        }
      } catch {
        /* best-effort, never surfaced */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source]);
}
