import { supabase } from "@/utils/supabase";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Uses getUser() instead of getSession() to validate the token server-side,
// preventing forged/stale localStorage tokens from bypassing the portal gate.
export async function navigateToPortal(router: AppRouterInstance): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError && userError.message !== "Auth session missing!") throw userError;

    if (user) {
      router.push("/portal");
    } else {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
    }
  } catch (err) {
    console.error("Portal navigation failed:", err);
  }
}
