"use client";

/**
 * Saved brand kits on /account. Shows the member's latest 3 kits (the DB
 * trims older ones), each resumable in the builder via ?kit_id=. Owner-only
 * reads via RLS. Empty state points at the builder so the card is never a
 * dead end.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const C = {
  cream: "#F0E6E0",
  gold: "#E3C24A",
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

interface KitRow {
  id: string;
  name: string;
  updated_at: string;
}

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function SavedKits({ userId }: { userId: string }) {
  const [kits, setKits] = useState<KitRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("brand_kits")
      .select("id, name, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setKits((data as KitRow[]) ?? []);
        setLoaded(true);
      });
  }, [userId]);

  if (!loaded) return null;

  return (
    <section style={{ ...card, padding: "clamp(22px,4vw,30px)", fontFamily: NEUE }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 19, color: C.cream }}>Saved brand kits</h2>
        <Link href="/ctrla/brand-kit" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, textDecoration: "none" }}>
          New kit →
        </Link>
      </div>

      {kits.length === 0 ? (
        <p style={{ margin: "14px 0 0", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
          None yet. Build a kit and hit Save on the export step to keep it here. We hold your latest three.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {kits.map((k) => (
            <Link
              key={k.id}
              href={`/ctrla/brand-kit/builder/brand-info?kit_id=${k.id}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.hair}`, borderRadius: 14, padding: "14px 16px", textDecoration: "none" }}
            >
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: C.cream, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.name}</span>
                <span style={{ display: "block", marginTop: 2, fontSize: 12, color: C.faint }}>Saved {when(k.updated_at)}</span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold, flexShrink: 0 }}>Open →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
