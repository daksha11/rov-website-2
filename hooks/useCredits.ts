import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { EarnAction } from "@/lib/credits/config";

// ─────────────────────────────────────────────────────────────
// useCredits — the CTRL-A credit wallet for the current user.
//
// Reads the balance from brand_kit_credits (the shared wallet) with a live
// realtime subscription, exposes the user's referral code, captures any
// ?ref= code from the URL, attributes a referral once the user is signed
// in, and exposes earn() for browser-claimable rewards. Spending stays on
// the server (spend_credits) behind whatever tool triggers it.
// ─────────────────────────────────────────────────────────────

const REF_KEY = "ctrla_ref";
const REF_DONE_PREFIX = "ctrla_ref_claimed_";

type EarnResult = { ok: boolean; points?: number; awarded?: number; alreadyClaimed?: boolean; error?: string };

export function useCredits() {
  const [points, setPoints] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Capture ?ref= as early as possible, before any sign-in.
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && !localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        const uid = session.user.id;
        setUserId(uid);

        // Balance + referral code in parallel.
        const [{ data: credits }, { data: profile }] = await Promise.all([
          supabase.from("brand_kit_credits").select("points").eq("user_id", uid).maybeSingle(),
          supabase.from("profiles").select("referral_code").eq("id", uid).maybeSingle(),
        ]);
        if (credits) setPoints(credits.points);
        if (profile?.referral_code) setReferralCode(profile.referral_code);
        setLoading(false);

        // Attribute a pending referral once (server dedupes anyway).
        try {
          const ref = localStorage.getItem(REF_KEY);
          if (ref && !localStorage.getItem(REF_DONE_PREFIX + uid)) {
            await fetch("/api/credits/refer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: ref }),
            });
            localStorage.setItem(REF_DONE_PREFIX + uid, "1");
          }
        } catch {
          /* best-effort */
        }

        // Live balance updates.
        channel = supabase
          .channel(`credits_${uid}_${Math.random().toString(36).slice(2, 8)}`)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "brand_kit_credits", filter: `user_id=eq.${uid}` },
            (payload: { new: { points: number } }) => setPoints(payload.new.points)
          )
          .subscribe();
      } catch {
        setLoading(false);
      }
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // opts.guide is required for the per-guide reward (guide-complete); ignored otherwise.
  const earn = useCallback(async (action: EarnAction, opts?: { guide?: string }): Promise<EarnResult> => {
    try {
      const res = await fetch("/api/credits/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(opts?.guide ? { guide: opts.guide } : {}) }),
      });
      const data = (await res.json().catch(() => ({}))) as EarnResult;
      if (data.ok && typeof data.points === "number") setPoints(data.points);
      return data;
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }, []);

  return { points, referralCode, userId, loading, signedIn: !!userId, earn };
}
