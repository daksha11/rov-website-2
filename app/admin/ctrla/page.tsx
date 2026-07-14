"use client";

/**
 * /admin/ctrla · the community review queue.
 * Staff-only (admin / engineer, same gate as /admin). Reads the
 * pending queue and flips statuses through /api/ctrla/review, which
 * also fires the author's Klaviyo email. Kept as its own route so
 * the main admin command center stays untouched.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { TOOLKITS, TYPE_META, type SubmissionPayload, type SubmissionType } from "@/lib/ctrla/community";

const supabase = createClient();

const C = {
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  plum: "#8E76B8",
  hair: "rgba(240,230,224,0.1)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};
const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
const NORWIGE = "Norwige, sans-serif";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
};

interface QueueRow {
  id: string;
  toolkit_slug: string | null;
  type: SubmissionType;
  payload: SubmissionPayload;
  created_at: string;
  profiles: { full_name: string | null; handle: string | null; email: string | null } | null;
}

export default function CtrlaQueuePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const { data: me } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (me?.role !== "admin" && me?.role !== "engineer") { router.push("/account"); return; }

      const res = await fetch("/api/ctrla/review");
      const json = await res.json();
      if (json.ok) setQueue(json.queue as QueueRow[]);
      else setError("Could not load the queue.");
      setStatus("ok");
    };
    load();
  }, [router]);

  async function review(id: string, newStatus: "approved" | "featured" | "rejected", reviewNote?: string) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch("/api/ctrla/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submissionId: id, status: newStatus, note: reviewNote || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setError("Review failed. Try again."); return; }
      setQueue((q) => q.filter((r) => r.id !== id));
      setRejecting(null);
      setNote("");
    } finally {
      setBusy(null);
    }
  }

  const btn = (bg: string, fg: string): React.CSSProperties => ({
    font: "inherit", fontFamily: NEUE, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: fg, background: bg, border: "none", borderRadius: 999,
    padding: "10px 18px", cursor: "pointer",
  });

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 26 }}>
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
            <span style={{ color: C.gold }}>←</span> Admin
          </Link>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
            Community queue
          </span>
        </div>

        <h1 style={{ margin: "0 0 4px", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(26px,5vw,40px)" }}>
          Submissions in review
        </h1>
        <p style={{ margin: "0 0 26px", fontSize: 13.5, color: C.faint }}>
          Approve puts it on the wall. Feature puts it on the wall with the gold badge. Every decision emails the author.
        </p>

        {status === "checking" && (
          <p style={{ fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Loading the queue...</p>
        )}
        {error && <p style={{ fontSize: 13, color: C.rose, fontWeight: 600 }}>{error}</p>}

        {status === "ok" && queue.length === 0 && !error && (
          <div style={{ ...card, padding: 32, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.faint }}>Queue is clear. Nothing pending.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 14 }}>
          {queue.map((r) => (
            <article key={r.id} style={{ ...card, padding: "20px 22px" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: C.rose, borderRadius: 999, padding: "4px 12px" }}>
                  {TYPE_META[r.type]?.label ?? r.type}
                </span>
                <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: C.plum, border: `1px solid ${C.hair}`, borderRadius: 999, padding: "4px 12px" }}>
                  {TOOLKITS.find((t) => t.slug === r.toolkit_slug)?.title ?? "General"}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: C.faint }}>
                  {r.profiles?.full_name || r.profiles?.email || "Unknown"}
                </span>
              </div>

              <h2 style={{ margin: "12px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 18 }}>
                {r.payload.url ? (
                  <a href={r.payload.url} target="_blank" rel="noopener noreferrer" style={{ color: C.cream, textDecoration: "none" }}>
                    {r.payload.title} <span style={{ color: C.gold }}>↗</span>
                  </a>
                ) : r.payload.title}
              </h2>
              {r.payload.body && (
                <p style={{ margin: "8px 0 0", fontSize: 14, color: C.soft, lineHeight: 1.6 }}>{r.payload.body}</p>
              )}
              {r.payload.tags && r.payload.tags.length > 0 && (
                <p style={{ margin: "8px 0 0", fontSize: 12, color: C.faint }}>Tags: {r.payload.tags.join(", ")}</p>
              )}

              {rejecting === r.id ? (
                <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  <input
                    value={note}
                    maxLength={500}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="One line for the author (optional, goes in the email)"
                    style={{ width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 13.5, color: C.cream, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.hair}`, borderRadius: 10, padding: "11px 14px", outline: "none" }}
                  />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" disabled={busy === r.id} onClick={() => review(r.id, "rejected", note)} style={btn(C.rose, "#160C28")}>
                      Confirm reject
                    </button>
                    <button type="button" onClick={() => { setRejecting(null); setNote(""); }} style={{ ...btn("transparent", C.faint), border: `1px solid ${C.hair}` }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                  <button type="button" disabled={busy === r.id} onClick={() => review(r.id, "approved")} style={btn(C.gold, "#160C28")}>
                    Approve
                  </button>
                  <button type="button" disabled={busy === r.id} onClick={() => review(r.id, "featured")} style={{ ...btn("linear-gradient(135deg, #E3C24A 0%, #A56A67 100%)", "#160C28") }}>
                    Feature
                  </button>
                  <button type="button" disabled={busy === r.id} onClick={() => setRejecting(r.id)} style={{ ...btn("transparent", C.faint), border: `1px solid ${C.hair}` }}>
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
