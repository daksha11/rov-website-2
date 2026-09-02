"use client";

/**
 * /ctrla/submit · the Contribute hub. Two doors:
 *   Improve a toolkit (free, fast) → Track A types
 *   Get featured (credits, magazine) → Track B types
 * Each card routes into a dedicated, single-purpose submit page that renders
 * from the admin-editable form config. Types an admin has closed are hidden.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { FormConfig } from "@/lib/ctrla/community";
import { C, NEUE, NORWIGE, card } from "./_components/theme";
import { GOOD_FIRST, submitHref } from "@/lib/ctrla/contribute";
import { CRAFT_LABEL } from "@/lib/ctrla/path";
import type { CraftSlug } from "@/lib/ctrla/profile";

const supabase = createClient();

export default function ContributeHub() {
  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("ctrla_form_configs")
      .select("type, track, is_open, title, intro, credit_cost, fields, sort")
      .order("sort", { ascending: true })
      .then(({ data }) => {
        setConfigs(((data as FormConfig[]) || []).filter((c) => c.is_open));
        setLoaded(true);
      });
  }, []);

  const toolkit = configs.filter((c) => c.track === "toolkit");
  const magazine = configs.filter((c) => c.track === "magazine");

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> CTRL-A
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>Contribute</span>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(20px,5vw,36px) clamp(18px,5vw,40px) 80px" }}>
        <h1 style={{ margin: "0 0 8px", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(30px,6vw,52px)", lineHeight: 1, color: C.cream }}>
          Add to CTRL-A
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: C.soft, lineHeight: 1.6, maxWidth: 560 }}>
          Two ways in. Make the toolkits sharper, or put your own work in the magazine. Reviewed weekly; approved work ships with your name on it.{" "}
          <Link href="/ctrla/changelog" style={{ color: C.gold, textDecoration: "none", borderBottom: `1px solid ${C.gold}` }}>See what changed</Link>
        </p>

        <GoodFirst />

        {!loaded ? (
          <p style={{ marginTop: 28, fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Loading…</p>
        ) : (
          <>
            <Door
              eyebrow="Free · fast"
              title="Improve a toolkit"
              blurb="Suggest a tool, pitch an idea, report a signal, share a resource, or add a history milestone. This is how the toolkits stay sharp."
              items={toolkit}
            />
            <Door
              eyebrow="Credits · magazine"
              title="Get featured"
              blurb="Put your work in the magazine. Art in any medium, or the full story with the process and the ugly steps. Costs credits to keep the bar high, pays you back when featured."
              items={magazine}
              showCost
            />
          </>
        )}
      </div>
    </main>
  );
}

function GoodFirst() {
  const crafts = Object.keys(GOOD_FIRST) as CraftSlug[];
  return (
    <section style={{ marginTop: 32 }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>Good first contribution</p>
      <h2 style={{ margin: "6px 0 6px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 24, color: C.cream }}>Small, true, and yours</h2>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: C.faint, lineHeight: 1.6, maxWidth: 560 }}>
        The things a person who just walked the path can hand back. Pick your craft.
      </p>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {crafts.map((craft) => (
          <div key={craft} style={{ ...card, padding: "16px 18px" }}>
            <span style={{ display: "block", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: 8 }}>{CRAFT_LABEL[craft]}</span>
            {GOOD_FIRST[craft].slice(0, 3).map((a) => (
              <Link key={a.title} href={submitHref(a.type, craft)} style={{ display: "block", fontSize: 13.5, color: C.cream, textDecoration: "none", lineHeight: 1.4, padding: "6px 0", borderTop: `1px solid ${C.hair}` }}>
                {a.title} <span style={{ color: C.gold }}>→</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Door({
  eyebrow,
  title,
  blurb,
  items,
  showCost,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  items: FormConfig[];
  showCost?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginTop: 32 }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>{eyebrow}</p>
      <h2 style={{ margin: "6px 0 6px", fontFamily: NORWIGE, fontWeight: 700, fontSize: 24, color: C.cream }}>{title}</h2>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: C.faint, lineHeight: 1.6, maxWidth: 560 }}>{blurb}</p>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {items.map((c) => (
          <Link
            key={c.type}
            href={`/ctrla/submit/${c.type}`}
            style={{ ...card, padding: "18px 18px", textDecoration: "none", color: C.cream, display: "flex", flexDirection: "column", gap: 6, transition: "border-color 0.2s ease" }}
          >
            <span style={{ fontFamily: NORWIGE, fontWeight: 700, fontSize: 16 }}>{c.title}</span>
            {c.intro && <span style={{ fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>{c.intro}</span>}
            {showCost && c.credit_cost > 0 && (
              <span style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: C.gold }}>{c.credit_cost} credits</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
