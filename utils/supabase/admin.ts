import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client for server routes only. It bypasses RLS and
// can call the award_credits / spend_credits RPCs (which are granted to
// service_role only), so the browser can never forge credits. NEVER import
// this into a client component. Returns null if the key is not configured,
// so callers can respond with a clean "not configured" instead of throwing.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServiceClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
