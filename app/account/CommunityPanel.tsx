"use client";

/**
 * Contributions section of the /account profile-dashboard.
 * Lists the user's CTRL-A submissions with live statuses (pending /
 * approved / featured / rejected, including the review note) and the
 * contribute CTA. Identity, bio, and the public-profile toggle live
 * up in the page's identity card, not here.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { STATUS_META, TOOLKITS, TYPE_META, type MySubmissionRow } from "@/lib/ctrla/community";

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
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const TONE_COLOR: Record<string, string> = {
  wait: C.plum,
  good: C.rose,
  great: C.gold,
  bad: "rgba(240,230,224,0.35)",
};

export default function CommunityPanel({
  userId,
  onCounts,
}: {
  userId: string;
  /** Reports (total, featured) so the page's stat row can show them. */
  onCounts?: (total: number, featured: number) => void;
}) {
  const [subs, setSubs] = useState<MySubmissionRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase
        .from("ctrla_submissions")
        .select("id, toolkit_slug, type, status, payload, review_note, created_at")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);
      const rows = (s ?? []) as MySubmissionRow[];
      setSubs(rows);
      onCounts?.(rows.length, rows.filter((r) => r.status === "featured").length);
      setLoaded(true);
    };
    load();
    // onCounts is a stable setter passthrough; re-running on identity change is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!loaded) return null;

  return (
    <section style={{ ...card, marginTop: 16, padding: "clamp(22px,4vw,30px)", fontFamily: NEUE }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 19, color: C.cream }}>
          My contributions
        </h2>
        <Link href="/ctrla/contribute" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#160C28", background: C.gold, borderRadius: 999, padding: "9px 18px", textDecoration: "none" }}>
          Contribute
        </Link>
      </div>

      {subs.length === 0 ? (
        <p style={{ margin: "16px 0 0", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
          Nothing yet. Suggest a tool, pitch an idea, or report a signal, and track it here.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {subs.map((s) => {
            const status = STATUS_META[s.status];
            return (
              <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.hair}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: TONE_COLOR[status.tone], borderRadius: 999, padding: "3px 10px" }}>
                    {status.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {TYPE_META[s.type]?.label ?? s.type} · {TOOLKITS.find((t) => t.slug === s.toolkit_slug)?.title ?? "General"}
                  </span>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 600, color: C.cream }}>{s.payload.title}</p>
                {s.status === "rejected" && s.review_note && (
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>
                    Note from review: {s.review_note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
