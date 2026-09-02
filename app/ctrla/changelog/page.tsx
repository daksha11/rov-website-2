/**
 * /ctrla/changelog · what changed in the school, and who changed it.
 * Two sources merged by month: approved community submissions (the wall
 * view, so only safe columns and only approved or featured work) and the
 * house list in lib/ctrla/contribute.ts. Server-rendered, revalidated every
 * few minutes; nothing here needs a session.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { TOOLKITS, TYPE_META, type WallRow } from "@/lib/ctrla/community";
import { HOUSE_CHANGELOG, shortTypeLabel } from "@/lib/ctrla/contribute";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Changelog · CTRL·A",
  description: "Every change to the CTRL·A school, by month, with the name of whoever made it.",
  robots: { index: false, follow: true },
};

const C = {
  cream: "#F0E6E0",
  gold: "#E3C24A",
  plum: "#8E76B8",
  hair: "rgba(240,230,224,0.12)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};
const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
const NORWIGE = "Norwige, sans-serif";
const SERIF = "'Times New Roman', Georgia, serif";

type Entry = {
  key: string;
  date: string;
  kind: string;
  title: string;
  note?: string;
  href?: string;
  external?: boolean;
  by: { name: string; handle?: string };
  toolkit?: string;
};

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function ChangelogPage() {
  const supabase = createClient(cookies());
  const { data } = await supabase
    .from("ctrla_community_wall")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const wall = (data ?? []) as WallRow[];

  const entries: Entry[] = [
    ...HOUSE_CHANGELOG.map<Entry>((h, i) => ({
      key: `house-${i}`,
      date: h.date,
      kind: "ROV",
      title: h.title,
      note: h.note,
      href: h.href,
      by: { name: "Range Of View" },
    })),
    ...wall.map<Entry>((w) => ({
      key: w.id,
      date: w.created_at.slice(0, 10),
      kind: w.status === "featured" ? "Featured" : shortTypeLabel(TYPE_META[w.type]?.label ?? w.type),
      title: w.payload.title,
      note: w.payload.body ?? undefined,
      href: w.payload.url,
      external: !!w.payload.url,
      by: w.author_is_public && w.author_handle ? { name: w.author_name || `@${w.author_handle}`, handle: w.author_handle } : { name: "a member" },
      toolkit: TOOLKITS.find((t) => t.slug === w.toolkit_slug)?.title,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const months = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = e.date.slice(0, 7);
    if (!months.has(k)) months.set(k, []);
    months.get(k)!.push(e);
  }
  const contributors = new Set(wall.filter((w) => w.author_is_public && w.author_handle).map((w) => w.author_handle));

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> CTRL-A
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>Changelog</span>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(36px,6vw,72px) clamp(18px,5vw,40px) 96px" }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          Open school · every commit
        </p>
        <h1 style={{ margin: "14px 0 0", fontFamily: NORWIGE, fontWeight: 800, fontSize: "clamp(40px,8vw,104px)", letterSpacing: "-0.035em", lineHeight: 0.9 }}>
          What changed.
        </h1>
        <p style={{ margin: "20px 0 0", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(18px,2.2vw,26px)", lineHeight: 1.35, color: C.soft, maxWidth: 600 }}>
          Ours and yours, in one list. {wall.length} community {wall.length === 1 ? "commit" : "commits"} from {contributors.size} {contributors.size === 1 ? "person" : "people"} so far.{" "}
          <Link href="/ctrla/submit" style={{ color: C.gold, textDecoration: "none", borderBottom: `1px solid ${C.gold}` }}>Add one.</Link>
        </p>

        {Array.from(months.entries()).map(([k, list]) => (
          <section key={k} style={{ marginTop: "clamp(40px,6vw,72px)" }}>
            <h2 style={{ margin: 0, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.gold, fontWeight: 600, paddingBottom: 12, borderBottom: `1px solid ${C.hair}` }}>
              {monthLabel(k)}
            </h2>
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {list.map((e) => (
                <li key={e.key} style={{ display: "grid", gridTemplateColumns: "clamp(64px,10vw,110px) 1fr", gap: "clamp(14px,2vw,28px)", padding: "clamp(16px,2vw,24px) 0", borderBottom: `1px solid ${C.hair}` }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, paddingTop: 6 }}>
                    {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <span style={{ display: "block", color: C.plum, marginTop: 4 }}>{e.kind}</span>
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(19px,2.4vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                      {e.href ? (
                        e.external ? (
                          <a href={e.href} target="_blank" rel="noopener noreferrer" style={{ color: C.cream, textDecoration: "none" }}>{e.title} <span style={{ color: C.gold }}>↗</span></a>
                        ) : (
                          <Link href={e.href} style={{ color: C.cream, textDecoration: "none" }}>{e.title} <span style={{ color: C.gold }}>→</span></Link>
                        )
                      ) : e.title}
                    </h3>
                    {e.note && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: C.soft, maxWidth: 560 }}>{e.note}</p>}
                    <p style={{ margin: "10px 0 0", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint }}>
                      by{" "}
                      {e.by.handle ? (
                        <Link href={`/ctrla/u/${e.by.handle}`} style={{ color: C.gold, textDecoration: "none" }}>{e.by.name}</Link>
                      ) : (
                        <span style={{ color: C.gold }}>{e.by.name}</span>
                      )}
                      {e.toolkit && <> · {e.toolkit}</>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
