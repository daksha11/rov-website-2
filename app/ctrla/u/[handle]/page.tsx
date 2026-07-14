/**
 * /ctrla/u/[handle] · the public community profile hub.
 * Server-rendered from two definer views (ctrla_public_profiles,
 * ctrla_community_wall), so it only ever sees safe columns: never
 * email, never role, never pending or rejected work.
 *
 * This page is the reward loop: approved contributions render as
 * cards with the author's name on them, plus contribution stats.
 * Profiles are opt-in (is_public toggle on /account).
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  TOOLKITS,
  TYPE_META,
  type WallRow,
} from "@/lib/ctrla/community";

export const revalidate = 60;

const C = {
  panel: "#24123A",
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

interface PublicProfile {
  id: string;
  handle: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  links: Record<string, string> | null;
}

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function toolkitTitle(slug: string | null) {
  return TOOLKITS.find((t) => t.slug === slug)?.title ?? "General";
}

export default async function PublicProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const { handle } = params;
  const supabase = createClient(cookies());

  const { data: profile } = await supabase
    .from("ctrla_public_profiles")
    .select("id, handle, full_name, bio, avatar_url, links")
    .ilike("handle", handle)
    .maybeSingle<PublicProfile>();

  if (!profile) notFound();

  const { data: wallData } = await supabase
    .from("ctrla_community_wall")
    .select("*")
    .ilike("author_handle", handle)
    .order("created_at", { ascending: false });
  const wall = (wallData ?? []) as WallRow[];

  const name = profile.full_name || profile.handle;
  const featured = wall.filter((w) => w.status === "featured").length;
  const toolkitsTouched = new Set(wall.map((w) => w.toolkit_slug).filter(Boolean)).size;
  const links = Object.entries(profile.links ?? {}).filter(([, v]) => typeof v === "string" && v.startsWith("http"));

  const stats = [
    { n: wall.length, label: wall.length === 1 ? "Contribution" : "Contributions" },
    { n: featured, label: "Featured" },
    { n: toolkitsTouched, label: toolkitsTouched === 1 ? "Toolkit" : "Toolkits" },
  ];

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      {/* Masthead */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> CTRL-A
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>
          Community
        </span>
      </div>

      {/* Hero */}
      <section className="dash-hero" style={{ height: "clamp(120px, 18vw, 180px)", display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${C.hair}`, marginTop: 14 }}>
        <div className="ctrla-grain" style={{ zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 640, margin: "0 auto", padding: "0 clamp(18px,5vw,40px) clamp(16px,4vw,24px)" }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.soft, textShadow: "0 1px 10px rgba(15,8,32,0.55)" }}>
            CTRL-A Contributor
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(18px,5vw,40px) 80px" }}>
        {/* Identity */}
        <div style={{ ...card, padding: "clamp(24px,5vw,38px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" width={84} height={84} style={{ borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.hair}` }} />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold} 0%, ${C.rose} 55%, #4E3D73 100%)`, color: "#160C28", display: "grid", placeItems: "center", fontFamily: NORWIGE, fontWeight: 700, fontSize: 30 }}>
              {initials(name)}
            </div>
          )}
          <h1 style={{ margin: "10px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.1 }}>{name}</h1>
          <p style={{ margin: 0, fontSize: 13, color: C.gold, fontWeight: 600 }}>@{profile.handle}</p>
          {profile.bio && (
            <p style={{ margin: "8px 0 0", fontSize: 14.5, color: C.soft, lineHeight: 1.6, maxWidth: 420 }}>{profile.bio}</p>
          )}
          {links.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
              {links.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.soft, border: `1px solid ${C.hair}`, borderRadius: 999, padding: "7px 16px", textDecoration: "none" }}>
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ ...card, padding: "18px 12px", textAlign: "center" }}>
              <span style={{ display: "block", fontFamily: NORWIGE, fontWeight: 700, fontSize: 28, color: C.gold }}>{s.n}</span>
              <span style={{ display: "block", marginTop: 2, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Contributions */}
        <h2 style={{ margin: "34px 0 14px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>
          On the wall
        </h2>
        {wall.length === 0 ? (
          <div style={{ ...card, padding: 28, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
              Nothing on the wall yet. The first approved submission lands here.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {wall.map((w) => (
              <article key={w.id} style={{ ...card, padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#160C28", background: w.status === "featured" ? C.gold : C.rose, borderRadius: 999, padding: "4px 12px" }}>
                    {w.status === "featured" ? "Featured" : TYPE_META[w.type]?.label ?? w.type}
                  </span>
                  <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: C.plum, border: `1px solid ${C.hair}`, borderRadius: 999, padding: "4px 12px" }}>
                    {toolkitTitle(w.toolkit_slug)}
                  </span>
                  {w.votes > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: 12, color: C.gold, fontWeight: 700 }}>▲ {w.votes}</span>
                  )}
                </div>
                <h3 style={{ margin: "12px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 18 }}>
                  {w.payload.url ? (
                    <a href={w.payload.url} target="_blank" rel="noopener noreferrer" style={{ color: C.cream, textDecoration: "none" }}>
                      {w.payload.title} <span style={{ color: C.gold }}>↗</span>
                    </a>
                  ) : (
                    w.payload.title
                  )}
                </h3>
                {w.payload.body && (
                  <p style={{ margin: "8px 0 0", fontSize: 14, color: C.soft, lineHeight: 1.6 }}>{w.payload.body}</p>
                )}
                {w.payload.tags && w.payload.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                    {w.payload.tags.map((t) => (
                      <span key={t} style={{ fontSize: 11.5, color: C.faint, border: `1px solid ${C.hair}`, borderRadius: 999, padding: "3px 10px" }}>{t}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Join CTA */}
        <div style={{ ...card, marginTop: 28, padding: "26px 24px", textAlign: "center", background: "linear-gradient(135deg, #24123A 0%, #4E3D73 100%)", border: "1px solid rgba(227,194,74,0.3)" }}>
          <p style={{ margin: "0 0 16px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 18 }}>
            Build your own corner of CTRL-A
          </p>
          <Link href="/ctrla/contribute" style={{ display: "inline-block", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#160C28", background: C.gold, borderRadius: 999, padding: "13px 28px", textDecoration: "none" }}>
            Contribute
          </Link>
        </div>
      </div>
    </main>
  );
}
