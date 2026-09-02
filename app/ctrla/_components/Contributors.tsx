"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — CONTRIBUTORS
// The byline block at the foot of a toolkit: who improved this kit,
// the last few approved commits, and the good-first asks for this
// craft. Editorial rows, no cards. Reads the public wall view, so it
// only ever sees approved and featured work.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TYPE_META, type WallRow } from "@/lib/ctrla/community";
import { GOOD_FIRST, shortTypeLabel, submitHref } from "@/lib/ctrla/contribute";
import type { CraftSlug } from "@/lib/ctrla/profile";
import { edLight as ed, Bleed, Rule, Kicker } from "./editorial";

const supabase = createClient();

export default function Contributors({ craft }: { craft: CraftSlug }) {
  const [rows, setRows] = useState<WallRow[] | null>(null);

  useEffect(() => {
    let live = true;
    supabase
      .from("ctrla_community_wall")
      .select("*")
      .eq("toolkit_slug", craft)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => {
        if (live) setRows((data as WallRow[]) ?? []);
      });
    return () => {
      live = false;
    };
  }, [craft]);

  const authors = new Map<string, WallRow>();
  for (const r of rows ?? []) {
    if (r.author_is_public && r.author_handle && !authors.has(r.author_handle)) authors.set(r.author_handle, r);
  }
  const recent = (rows ?? []).slice(0, 5);
  const asks = GOOD_FIRST[craft];

  const linkStyle = { color: ed.plum, textDecoration: "none", borderBottom: `1px solid ${ed.plum}` } as const;

  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,88px) 0 0" }}>
      <Bleed>
        <Rule color={ed.hair} />
        <div className="ctrla-contrib-grid">
          {/* Left: who, and what changed */}
          <div>
            <Kicker color={ed.plum}>Improved by</Kicker>
            {rows === null ? (
              <p style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: ed.inkFaint, margin: "14px 0 0" }}>Loading…</p>
            ) : authors.size === 0 ? (
              <>
                <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,60px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "12px 0 14px" }}>
                  Nobody yet. Be the first name here.
                </h2>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 520 }}>
                  This kit is written by ROV and kept by whoever walks it. An approved suggestion puts your name right here, with a link to your profile.
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,60px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "12px 0 18px" }}>
                  ROV, and {authors.size === 1 ? "one member" : `${authors.size} members`}.
                </h2>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.7, color: ed.inkSoft, margin: 0, maxWidth: 560 }}>
                  {Array.from(authors.values()).map((r, i) => (
                    <span key={r.author_handle!}>
                      {i > 0 && ", "}
                      <Link href={`/ctrla/u/${r.author_handle}`} style={{ color: ed.ink, textDecoration: "none", borderBottom: `1px solid ${ed.plum}` }}>
                        {r.author_name || `@${r.author_handle}`}
                      </Link>
                    </span>
                  ))}
                </p>
              </>
            )}

            {recent.length > 0 && (
              <ol style={{ listStyle: "none", padding: 0, margin: "clamp(22px,3vw,40px) 0 0" }}>
                {recent.map((r) => (
                  <li key={r.id} style={{ borderTop: `1px solid ${ed.hair}`, padding: "14px 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "baseline" }}>
                    <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: ed.plum, whiteSpace: "nowrap" }}>
                      {shortTypeLabel(TYPE_META[r.type]?.label ?? r.type)}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(16px,1.7vw,20px)", letterSpacing: "-0.01em", color: ed.ink, display: "block" }}>
                        {r.payload.url ? (
                          <a href={r.payload.url} target="_blank" rel="noopener noreferrer" style={{ color: ed.ink, textDecoration: "none" }}>{r.payload.title} ↗</a>
                        ) : r.payload.title}
                      </span>
                      <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ed.inkFaint }}>
                        {r.author_is_public && r.author_handle ? <Link href={`/ctrla/u/${r.author_handle}`} style={{ color: ed.plum, textDecoration: "none" }}>@{r.author_handle}</Link> : "a member"}
                        {" · "}
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", margin: "18px 0 0" }}>
              <Link href="/ctrla/changelog" style={linkStyle}>Everything that changed →</Link>
            </p>
          </div>

          {/* Right: good first contributions */}
          <div>
            <Kicker color={ed.plum}>Good first contribution</Kicker>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(17px,1.9vw,23px)", lineHeight: 1.35, color: ed.ink, margin: "12px 0 0", maxWidth: 460 }}>
              Small, true, and yours. Reviewed weekly. Approved work ships with your name on it.
            </p>
            <ol style={{ listStyle: "none", padding: 0, margin: "clamp(18px,2.4vw,30px) 0 0" }}>
              {asks.map((a) => (
                <li key={a.title} style={{ borderTop: `1px solid ${ed.hair}` }}>
                  <Link href={submitHref(a.type, craft)} className="ctrla-contrib-ask" style={{ display: "block", padding: "16px 0", textDecoration: "none" }}>
                    <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(17px,1.9vw,22px)", letterSpacing: "-0.015em", lineHeight: 1.1, color: ed.ink }}>
                      {a.title} <span aria-hidden style={{ color: ed.plum }}>→</span>
                    </span>
                    <span style={{ display: "block", fontFamily: ed.body, fontSize: "clamp(13.5px,1.3vw,15.5px)", lineHeight: 1.55, color: ed.inkSoft, marginTop: 6, maxWidth: 440 }}>{a.why}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Bleed>
    </section>
  );
}
