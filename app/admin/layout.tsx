import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// The admin front door, bolted server-side. Every /admin/* route now resolves
// the session and role BEFORE any admin UI renders, instead of relying on each
// page's post-mount redirect. A definitive "not staff" answer redirects away
// (fail closed); an unexpected error falls through to render, where the pages'
// own client-side checks and the staff-gated API routes still enforce access
// (fail open on error only, so a transient glitch never locks staff out).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Not signed in: send to the public home, same as the pages do today.
    if (!user) redirect("/");

    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    // Signed in but not staff: send to their own dashboard.
    if (me?.role !== "admin" && me?.role !== "engineer") redirect("/account");
  } catch (err) {
    // next/navigation's redirect() throws a control-flow signal; let it pass
    // through so the redirect actually happens. Any other error falls through
    // to render, where the client-side guards remain the backstop.
    if (err && typeof err === "object" && "digest" in err && typeof (err as { digest?: string }).digest === "string" && (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  return <>{children}</>;
}
