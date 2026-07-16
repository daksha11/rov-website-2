"use client";

/**
 * Contributions section of the /account profile-dashboard.
 * Two groups, one per track: magazine features (media thumbnail, cost paid,
 * and a payback line when featured) and toolkit contributions (as before).
 * Both share the status vocabulary so tracking reads the same for either.
 * Identity, bio, and the public-profile toggle live in the page's identity
 * card, not here.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { REWARDS } from "@/lib/credits/config";
import { STATUS_META, TOOLKITS, TRACK_FOR, TYPE_META, type MediaItem, type MySubmissionRow } from "@/lib/ctrla/community";

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

const FEATURED_PAYBACK = REWARDS["contribution-featured"].points;

export default function CommunityPanel({
  userId,
  onCounts,
}: {
  userId: string;
  /** Reports (total, featured) so the page's stat row can show them. */
  onCounts?: (total: number, featured: number) => void;
}) {
  const [subs, setSubs] = useState<MySubmissionRow[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase
        .from("ctrla_submissions")
        .select("id, toolkit_slug, type, track, credit_cost, media, status, payload, review_note, created_at")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);
      const rows = (s ?? []) as MySubmissionRow[];
      setSubs(rows);
      onCounts?.(rows.length, rows.filter((r) => r.status === "featured").length);
      setLoaded(true);

      // Sign the hero thumbnail of each magazine row (private bucket).
      const heroes = rows
        .filter((r) => Array.isArray(r.media) && r.media[0]?.kind === "image")
        .map((r) => ({ id: r.id, path: (r.media as MediaItem[])[0].path }));
      if (heroes.length) {
        const map: Record<string, string> = {};
        await Promise.all(
          heroes.map(async (h) => {
            const { data } = await supabase.storage.from("ctrla-submissions").createSignedUrl(h.path, 3600);
            if (data?.signedUrl) map[h.id] = data.signedUrl;
          }),
        );
        setThumbs(map);
      }
    };
    load();
    // onCounts is a stable setter passthrough; re-running on identity change is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!loaded) return null;

  const magazine = subs.filter((s) => (s.track ?? TRACK_FOR[s.type]) === "magazine");
  const toolkit = subs.filter((s) => (s.track ?? TRACK_FOR[s.type]) !== "magazine");

  return (
    <section style={{ ...card, marginTop: 16, padding: "clamp(22px,4vw,30px)", fontFamily: NEUE }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 19, color: C.cream }}>My contributions</h2>
        <Link href="/ctrla/submit" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#160C28", background: C.gold, borderRadius: 999, padding: "9px 18px", textDecoration: "none" }}>
          Contribute
        </Link>
      </div>

      {subs.length === 0 ? (
        <p style={{ margin: "16px 0 0", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
          Nothing yet. Suggest a tool, pitch an idea, or put your work in the magazine, and track it here.
        </p>
      ) : (
        <>
          {magazine.length > 0 && (
            <Group title="Magazine features">
              {magazine.map((s) => (
                <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.hair}`, borderRadius: 14, padding: 14, display: "flex", gap: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.hair}` }}>
                    {thumbs[s.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbs[s.id]} alt="" width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <StatusRow s={s} />
                    <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 600, color: C.cream }}>{s.payload.title}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: C.faint }}>
                      {typeof s.credit_cost === "number" && s.credit_cost > 0 ? `${s.credit_cost} credits spent` : null}
                      {s.status === "featured" ? (
                        <span style={{ color: C.gold, fontWeight: 700 }}>{typeof s.credit_cost === "number" && s.credit_cost > 0 ? " · " : ""}Paid back +{FEATURED_PAYBACK}</span>
                      ) : null}
                    </p>
                    {s.status === "rejected" && s.review_note && (
                      <p style={{ margin: "6px 0 0", fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>Note from review: {s.review_note}</p>
                    )}
                  </div>
                </div>
              ))}
            </Group>
          )}

          {toolkit.length > 0 && (
            <Group title="Toolkit contributions">
              {toolkit.map((s) => (
                <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.hair}`, borderRadius: 14, padding: "14px 16px" }}>
                  <StatusRow s={s} />
                  <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 600, color: C.cream }}>{s.payload.title}</p>
                  {s.status === "rejected" && s.review_note && (
                    <p style={{ margin: "6px 0 0", fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>Note from review: {s.review_note}</p>
                  )}
                </div>
              ))}
            </Group>
          )}
        </>
      )}
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>{title}</p>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </div>
  );
}

function StatusRow({ s }: { s: MySubmissionRow }) {
  const status = STATUS_META[s.status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: TONE_COLOR[status.tone], borderRadius: 999, padding: "3px 10px" }}>
        {status.label}
      </span>
      <span style={{ fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {TYPE_META[s.type]?.label ?? s.type}
        {s.toolkit_slug ? ` · ${TOOLKITS.find((t) => t.slug === s.toolkit_slug)?.title ?? "General"}` : ""}
      </span>
    </div>
  );
}
