"use client";

/**
 * /admin/ctrla/forms · the form-config editor.
 * Staff edit each submission type's front-end form: open/closed, title,
 * intro, credit cost, and the field list (label, help, required, order).
 * Saves through PUT /api/ctrla/forms (staff-gated). The submit pages render
 * from these rows; the submissions API's zod stays the safety floor, so a
 * config change can never make the server accept something zod rejects.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { FormConfig, FormFieldConfig } from "@/lib/ctrla/community";

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
const input: React.CSSProperties = {
  font: "inherit", fontFamily: NEUE, fontSize: 14, color: C.cream,
  background: "rgba(255,255,255,0.04)", border: `1px solid ${C.hair}`,
  borderRadius: 10, padding: "10px 12px", outline: "none", width: "100%",
};

export default function FormsEditorPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const { data: me } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (me?.role !== "admin" && me?.role !== "engineer") { router.push("/account"); return; }

      const res = await fetch("/api/ctrla/forms");
      const json = await res.json();
      if (json.ok) setConfigs(json.configs as FormConfig[]);
      else setError("Could not load form configs.");
      setStatus("ok");
    })();
  }, [router]);

  function patch(type: string, next: Partial<FormConfig>) {
    setConfigs((cs) => cs.map((c) => (c.type === type ? { ...c, ...next } : c)));
  }

  function patchField(type: string, idx: number, next: Partial<FormFieldConfig>) {
    setConfigs((cs) =>
      cs.map((c) =>
        c.type === type ? { ...c, fields: c.fields.map((f, i) => (i === idx ? { ...f, ...next } : f)) } : c,
      ),
    );
  }

  function moveField(type: string, idx: number, dir: -1 | 1) {
    setConfigs((cs) =>
      cs.map((c) => {
        if (c.type !== type) return c;
        const fields = [...c.fields];
        const j = idx + dir;
        if (j < 0 || j >= fields.length) return c;
        [fields[idx], fields[j]] = [fields[j], fields[idx]];
        return { ...c, fields };
      }),
    );
  }

  async function save(cfg: FormConfig) {
    setSavingType(cfg.type);
    setError(null);
    setFlash(null);
    try {
      const res = await fetch("/api/ctrla/forms", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: cfg.type,
          is_open: cfg.is_open,
          title: cfg.title,
          intro: cfg.intro,
          credit_cost: cfg.credit_cost,
          fields: cfg.fields,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) setFlash(`Saved ${cfg.title}`);
      else setError("Save failed. Try again.");
    } finally {
      setSavingType(null);
      setTimeout(() => setFlash(null), 2500);
    }
  }

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 26 }}>
          <Link href="/admin/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
            <span style={{ color: C.gold }}>←</span> Community queue
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/admin/ctrla/economy" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 600 }}>Economy</Link>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>Form configs</span>
          </div>
        </div>

        <h1 style={{ margin: "0 0 4px", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(26px,5vw,40px)" }}>Contribution forms</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
          Toggle a type on or off, change its cost, and edit its fields. The submit pages render from this. Validation limits still apply on the server, so hard rules can not be removed here.
        </p>

        {status === "checking" && <p style={{ fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Loading…</p>}
        {error && <p style={{ fontSize: 13, color: C.rose, fontWeight: 600 }}>{error}</p>}
        {flash && <p style={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>{flash}</p>}

        <div style={{ display: "grid", gap: 16 }}>
          {configs.map((cfg) => (
            <section key={cfg.type} style={{ ...card, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 18 }}>{cfg.title}</h2>
                  <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: cfg.track === "magazine" ? "#160C28" : C.plum, background: cfg.track === "magazine" ? C.gold : "transparent", border: cfg.track === "magazine" ? "none" : `1px solid ${C.hair}`, borderRadius: 999, padding: "3px 10px" }}>
                    {cfg.track}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => patch(cfg.type, { is_open: !cfg.is_open })}
                  style={{ font: "inherit", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", background: "transparent", border: "none", color: cfg.is_open ? C.gold : C.faint, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  <span aria-hidden style={{ width: 40, height: 22, borderRadius: 999, background: cfg.is_open ? C.gold : "rgba(255,255,255,0.1)", position: "relative" }}>
                    <span style={{ position: "absolute", top: 3, left: cfg.is_open ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: cfg.is_open ? "#160C28" : C.faint, transition: "left 0.2s ease" }} />
                  </span>
                  {cfg.is_open ? "Open" : "Paused"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: cfg.track === "magazine" ? "1fr 1fr" : "1fr", gap: 12, marginTop: 16 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Title</span>
                  <input value={cfg.title} onChange={(e) => patch(cfg.type, { title: e.target.value })} style={input} />
                </label>
                {cfg.track === "magazine" && (
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Credit cost</span>
                    <input type="number" min={0} value={cfg.credit_cost} onChange={(e) => patch(cfg.type, { credit_cost: Number(e.target.value) })} style={input} />
                  </label>
                )}
              </div>

              <label style={{ display: "grid", gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Intro</span>
                <input value={cfg.intro ?? ""} onChange={(e) => patch(cfg.type, { intro: e.target.value })} style={input} />
              </label>

              <p style={{ margin: "18px 0 8px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, fontWeight: 700 }}>Fields</p>
              <div style={{ display: "grid", gap: 8 }}>
                {cfg.fields.map((f, i) => (
                  <div key={f.key} style={{ border: `1px solid ${C.hair}`, borderRadius: 10, padding: 12, display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: C.plum, fontFamily: "monospace" }}>{f.key}</span>
                      <span style={{ fontSize: 11, color: C.faint }}>· {f.kind}</span>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        <button type="button" onClick={() => moveField(cfg.type, i, -1)} style={arrowBtn}>↑</button>
                        <button type="button" onClick={() => moveField(cfg.type, i, 1)} style={arrowBtn}>↓</button>
                      </div>
                    </div>
                    <input value={f.label} onChange={(e) => patchField(cfg.type, i, { label: e.target.value })} placeholder="Label" style={input} />
                    <input value={f.help ?? ""} onChange={(e) => patchField(cfg.type, i, { help: e.target.value })} placeholder="Help text (optional)" style={input} />
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.soft }}>
                      <input type="checkbox" checked={f.required} onChange={(e) => patchField(cfg.type, i, { required: e.target.checked })} />
                      Required
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  disabled={savingType === cfg.type}
                  onClick={() => save(cfg)}
                  style={{ font: "inherit", fontFamily: NEUE, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#160C28", background: C.gold, border: "none", borderRadius: 999, padding: "11px 22px", cursor: "pointer" }}
                >
                  {savingType === cfg.type ? "Saving…" : "Save changes"}
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

const arrowBtn: React.CSSProperties = {
  font: "inherit", fontSize: 12, color: "#F0E6E0", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(240,230,224,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer",
};
