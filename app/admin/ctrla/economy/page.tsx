"use client";

/**
 * /admin/ctrla/economy · the credits console.
 * Staff-only (admin / engineer, same gate as the rest of /admin). Read-only
 * first: the earn/cost tables as configured, then a member lookup showing
 * balance + ledger, and a manual grant/deduct with a required reason. Every
 * adjustment flows through /api/credits/admin (service-role RPC), never a
 * direct client write.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { REWARDS, COSTS } from "@/lib/credits/config";

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

interface Person {
  id: string;
  full_name: string | null;
  handle: string | null;
  email: string | null;
  role: string;
}
interface LedgerRow {
  id: number;
  action: string;
  points: number;
  meta: Record<string, unknown> | null;
  created_at: string;
}

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function actionLabel(action: string) {
  const raw = action.replace(/^spend:/, "").split(":")[0].replace(/-/g, " ").trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function EconomyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [ledger, setLedger] = useState<LedgerRow[]>([]);

  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [msg, setMsg] = useState<{ tone: "good" | "bad"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const { data: me } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (me?.role !== "admin" && me?.role !== "engineer") { router.push("/account"); return; }
      setReady(true);
    })();
  }, [router]);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim() || searching) return;
    setSearching(true);
    setNotFound(false);
    setMsg(null);
    try {
      const res = await fetch(`/api/credits/admin?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      if (!json.ok || !json.found) {
        setPerson(null);
        setNotFound(true);
        return;
      }
      setPerson(json.person as Person);
      setBalance(json.balance as number);
      setLedger((json.ledger as LedgerRow[]) ?? []);
    } finally {
      setSearching(false);
    }
  }

  async function adjust(sign: 1 | -1) {
    if (!person || adjusting) return;
    const amount = Math.abs(parseInt(delta, 10));
    if (!Number.isFinite(amount) || amount <= 0) { setMsg({ tone: "bad", text: "Enter an amount." }); return; }
    if (reason.trim().length < 3) { setMsg({ tone: "bad", text: "A reason is required." }); return; }
    setAdjusting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/credits/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: person.id, delta: sign * amount, reason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setMsg({ tone: "bad", text: json.error || "Adjustment failed." });
        return;
      }
      setBalance(json.balance as number);
      setMsg({ tone: "good", text: `${sign > 0 ? "Granted" : "Deducted"} ${amount}. New balance ${json.balance}.` });
      setDelta("");
      setReason("");
      // Refresh the ledger so the adjustment shows immediately.
      const r2 = await fetch(`/api/credits/admin?q=${encodeURIComponent(person.email ?? person.handle ?? "")}`);
      const j2 = await r2.json();
      if (j2.ok && j2.found) setLedger((j2.ledger as LedgerRow[]) ?? []);
    } finally {
      setAdjusting(false);
    }
  }

  if (!ready) {
    return (
      <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
        <div aria-hidden style={{ height: 3, background: C.gold }} />
        <p style={{ padding: 40, fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Checking access…</p>
      </main>
    );
  }

  const label: React.CSSProperties = { display: "block", fontFamily: NEUE, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 600, marginBottom: 8 };
  const input: React.CSSProperties = { width: "100%", font: "inherit", fontFamily: NEUE, fontSize: 15, color: C.cream, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.hair}`, borderRadius: 12, padding: "12px 15px", outline: "none" };
  const btn = (bg: string, fg: string): React.CSSProperties => ({ font: "inherit", fontFamily: NEUE, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: fg, background: bg, border: "none", borderRadius: 999, padding: "12px 20px", cursor: "pointer" });

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 26 }}>
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
            <span style={{ color: C.gold }}>←</span> Admin
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/admin/ctrla" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 600 }}>Queue</Link>
            <Link href="/admin/ctrla/forms" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 600 }}>Forms</Link>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>Economy</span>
          </div>
        </div>

        <h1 style={{ margin: "0 0 4px", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(26px,5vw,40px)" }}>Economy</h1>
        <p style={{ margin: "0 0 26px", fontSize: 13.5, color: C.faint }}>
          The earn and cost tables as configured, and a member lookup for manual grants or deducts. Every hand adjustment lands in the ledger with your reason.
        </p>

        {/* Config reference */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 26 }}>
          <section style={{ ...card, padding: "20px 22px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>Ways to earn</p>
            <div style={{ display: "grid", gap: 8 }}>
              {(Object.keys(REWARDS) as (keyof typeof REWARDS)[]).map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
                  <span style={{ color: C.soft }}>{REWARDS[k].label}</span>
                  <span style={{ color: C.gold, fontWeight: 700 }}>+{REWARDS[k].points}</span>
                </div>
              ))}
            </div>
          </section>
          <section style={{ ...card, padding: "20px 22px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>What it costs</p>
            <div style={{ display: "grid", gap: 8 }}>
              {(Object.keys(COSTS) as (keyof typeof COSTS)[]).map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
                  <span style={{ color: C.soft, textTransform: "capitalize" }}>{k.replace(/-/g, " ")}</span>
                  <span style={{ color: C.cream, fontWeight: 700 }}>{COSTS[k]}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <p style={{ margin: "-14px 0 26px", fontSize: 12, color: C.faint }}>
          These are set in <code style={{ color: C.soft }}>lib/credits/config.ts</code>. Editing them is still a deploy; this screen is the read-only reference plus the manual lever below.
        </p>

        {/* Lookup */}
        <form onSubmit={search} style={{ ...card, padding: "20px 22px", marginBottom: 18 }}>
          <label style={label}>Find a member</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="email or handle" style={{ ...input, flex: 1, minWidth: 220 }} />
            <button type="submit" disabled={searching} style={btn(C.gold, "#160C28")}>{searching ? "…" : "Look up"}</button>
          </div>
          {notFound && <p style={{ margin: "12px 0 0", fontSize: 13, color: C.rose }}>No member matches that exactly. Try the full email or handle.</p>}
        </form>

        {person && (
          <section style={{ ...card, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>{person.full_name || person.handle || "Member"}</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.faint }}>
                  {person.email}{person.handle ? ` · @${person.handle}` : ""}{person.role !== "client" ? ` · ${person.role}` : ""}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Balance</p>
                <p style={{ margin: "2px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 28, color: C.gold }}>{balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Adjust */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.hair}` }}>
              <label style={label}>Manual adjustment</label>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input value={delta} onChange={(e) => setDelta(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="Amount" style={{ ...input, width: 130, flex: "0 0 auto" }} />
                  <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} placeholder="Reason (goes in the ledger)" style={{ ...input, flex: 1, minWidth: 200 }} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" disabled={adjusting} onClick={() => adjust(1)} style={btn(C.gold, "#160C28")}>{adjusting ? "…" : "Grant"}</button>
                  <button type="button" disabled={adjusting} onClick={() => adjust(-1)} style={{ ...btn("transparent", C.rose), border: `1px solid ${C.rose}` }}>{adjusting ? "…" : "Deduct"}</button>
                </div>
                {msg && <p style={{ margin: 0, fontSize: 13, color: msg.tone === "good" ? C.gold : C.rose, fontWeight: 600 }}>{msg.text}</p>}
              </div>
            </div>

            {/* Ledger */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.hair}` }}>
              <label style={label}>Recent activity</label>
              {ledger.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: C.faint }}>No credit activity yet.</p>
              ) : (
                <div style={{ display: "grid", gap: 2 }}>
                  {ledger.map((a) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "9px 2px", borderBottom: `1px solid ${C.hair}` }}>
                      <span style={{ fontSize: 13, color: C.soft }}>
                        {actionLabel(a.action)}
                        {a.meta && typeof a.meta.reason === "string" && <span style={{ color: C.faint }}> · {a.meta.reason}</span>}
                        <span style={{ color: C.faint }}> · {when(a.created_at)}</span>
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: a.points >= 0 ? C.gold : C.faint }}>
                        {a.points >= 0 ? `+${a.points}` : a.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
