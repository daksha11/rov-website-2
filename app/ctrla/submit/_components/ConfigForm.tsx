"use client";

/**
 * ConfigForm · renders a submission form from an admin-editable FormConfig
 * and posts to /api/ctrla/submissions. The config drives which fields show
 * and their labels/help; the server's zod is the real validator, so this is
 * a helpful UI, not the gate. Field keys match the API payload keys exactly,
 * so the collected values assemble straight into the request body.
 *
 * Track B (magazine) shows a cost header against the live balance, with an
 * inline earn path when short, and never lets a paid submit fire without the
 * required media / tools / process.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";
import {
  TOOLKITS,
  type FormConfig,
  type FormFieldConfig,
  type MediaItem,
  type ProcessSection,
  type ToolUsed,
  type ToolkitSlug,
} from "@/lib/ctrla/community";
import { C, NEUE, NORWIGE, card, inputStyle, labelStyle } from "./theme";
import MediaUploader from "./MediaUploader";

type Values = Record<string, unknown>;

export default function ConfigForm({ config, userId }: { config: FormConfig; userId: string }) {
  const { points } = useCredits();
  const [values, setValues] = useState<Values>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMagazine = config.track === "magazine";
  const cost = config.credit_cost;
  const short = isMagazine && points !== null && points < cost;

  function set(key: string, v: unknown) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  const canSubmit = useMemo(() => {
    for (const f of config.fields) {
      if (!f.required) continue;
      const v = values[f.key];
      if (f.kind === "media" && (!Array.isArray(v) || v.length === 0)) return false;
      if (f.kind === "tools" && (!Array.isArray(v) || v.length < 3)) return false;
      if (f.kind === "sections" && (!Array.isArray(v) || v.length < 3)) return false;
      if (f.kind === "tags" && (!Array.isArray(v) || v.length === 0)) return false;
      if ((f.kind === "text" || f.kind === "textarea" || f.kind === "url" || f.kind === "toolkit" || f.kind === "date") && !String(v ?? "").trim()) return false;
    }
    return true;
  }, [config.fields, values]);

  async function submit() {
    if (!canSubmit || sending || short) return;
    setSending(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { type: config.type };
      for (const f of config.fields) {
        const v = values[f.key];
        if (v === undefined || v === null || v === "") continue;
        body[f.key] = v;
      }
      const res = await fetch("/api/ctrla/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setDone(true);
        return;
      }
      if (res.status === 402) setError("You are just short on credits. Earn a few more and come back.");
      else if (res.status === 409) setError("This submission type is paused right now. Check back soon.");
      else setError(json.error || "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <section style={{ ...card, padding: "clamp(24px,5vw,34px)", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 22, color: C.gold }}>Sent to review</h2>
        <p style={{ margin: "12px 0 20px", fontSize: 14, color: C.soft, lineHeight: 1.6 }}>
          {isMagazine
            ? "Your feature is in the queue. We will email you at each step, and you can track it on your profile."
            : "Thank you. We will review it and let you know. Track it on your profile."}
        </p>
        <Link href="/account" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#160C28", background: C.gold, borderRadius: 999, padding: "12px 24px", textDecoration: "none" }}>
          Track it on your profile
        </Link>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {config.intro && (
        <p style={{ margin: 0, fontSize: 15, color: C.soft, lineHeight: 1.6 }}>{config.intro}</p>
      )}

      {isMagazine && (
        <div style={{ ...card, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Cost to submit</p>
            <p style={{ margin: "4px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 22, color: C.gold }}>{cost} credits</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 12, color: C.faint }}>Your balance</p>
            <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: short ? C.rose : C.cream }}>
              {points === null ? "…" : points.toLocaleString()}
            </p>
          </div>
          {short && (
            <p style={{ flexBasis: "100%", margin: 0, fontSize: 13, color: C.soft, lineHeight: 1.6 }}>
              A little short. Earn more by playing{" "}
              <Link href="/ctrla" style={{ color: C.gold }}>the Daily</Link>, finishing a guide, or following on Instagram, then come back. Nothing here is spent until you submit.
            </p>
          )}
        </div>
      )}

      {config.fields.map((f) => (
        <Field key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} userId={userId} />
      ))}

      {error && <p style={{ margin: 0, fontSize: 13.5, color: C.rose }}>{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit || sending || short}
        style={{
          font: "inherit",
          fontFamily: NEUE,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#160C28",
          background: !canSubmit || short ? "rgba(227,194,74,0.4)" : C.gold,
          border: "none",
          borderRadius: 999,
          padding: "15px 26px",
          cursor: !canSubmit || sending || short ? "default" : "pointer",
        }}
      >
        {sending ? "Sending…" : isMagazine ? `Submit · ${cost} credits` : "Submit for review"}
      </button>
    </div>
  );
}

// ── One field, rendered by kind ──────────────────────────────────────
function Field({
  field,
  value,
  onChange,
  userId,
}: {
  field: FormFieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
  userId: string;
}) {
  const labelNode = (
    <label style={labelStyle}>
      {field.label}
      {!field.required && <span style={{ color: C.faint, textTransform: "none", letterSpacing: 0 }}> · optional</span>}
    </label>
  );
  const help = field.help ? (
    <p style={{ margin: "6px 0 0", fontSize: 12, color: C.faint }}>{field.help}</p>
  ) : null;

  switch (field.kind) {
    case "textarea":
      return (
        <div>
          {labelNode}
          <textarea
            value={(value as string) || ""}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, minHeight: 120, resize: "vertical", lineHeight: 1.55 }}
          />
          {help}
        </div>
      );
    case "url":
      return (
        <div>
          {labelNode}
          <input type="url" value={(value as string) || ""} placeholder="https://" onChange={(e) => onChange(e.target.value)} style={inputStyle} />
          {help}
        </div>
      );
    case "date":
      return (
        <div>
          {labelNode}
          <input type="date" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
          {help}
        </div>
      );
    case "toolkit":
      return (
        <div>
          {labelNode}
          <select value={(value as string) || ""} onChange={(e) => onChange(e.target.value || undefined)} style={inputStyle}>
            <option value="">Choose a toolkit</option>
            {TOOLKITS.map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
          {help}
        </div>
      );
    case "select":
      return (
        <div>
          {labelNode}
          <select value={(value as string) || ""} onChange={(e) => onChange(e.target.value || undefined)} style={inputStyle}>
            <option value="">Choose one</option>
            {(field.options || []).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {help}
        </div>
      );
    case "tags":
      return (
        <div>
          {labelNode}
          <input
            value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
            placeholder="Comma separated"
            onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20))}
            style={inputStyle}
          />
          {help}
        </div>
      );
    case "media":
      return (
        <div>
          {labelNode}
          <MediaUploader userId={userId} value={(value as MediaItem[]) || []} onChange={(items) => onChange(items)} />
          {help}
        </div>
      );
    case "tools":
      return (
        <div>
          {labelNode}
          <ToolsField value={(value as ToolUsed[]) || []} onChange={(t) => onChange(t)} />
          {help}
        </div>
      );
    case "sections":
      return (
        <div>
          {labelNode}
          <SectionsField value={(value as ProcessSection[]) || []} onChange={(s) => onChange(s)} />
          {help}
        </div>
      );
    case "text":
    default:
      return (
        <div>
          {labelNode}
          <input value={(value as string) || ""} maxLength={field.maxLength} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
          {help}
        </div>
      );
  }
}

// Story tools: name + optional toolkit mapping.
function ToolsField({ value, onChange }: { value: ToolUsed[]; onChange: (v: ToolUsed[]) => void }) {
  const rows = value.length ? value : [{ name: "" }];
  function update(i: number, patch: Partial<ToolUsed>) {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    onChange(next.filter((r) => r.name.trim()));
    if (patch.name !== undefined && i === rows.length - 1 && patch.name.trim()) {
      // keep an empty trailing row for adding more
    }
  }
  const display = [...rows];
  if (display[display.length - 1]?.name.trim()) display.push({ name: "" });

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {display.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <input
            value={r.name}
            placeholder="Tool or material"
            onChange={(e) => {
              const next = [...display];
              next[i] = { ...next[i], name: e.target.value };
              onChange(next.filter((x) => x.name.trim()));
            }}
            style={{ ...inputStyle, flex: 2 }}
          />
          <select
            value={r.toolkit || ""}
            onChange={(e) => {
              const next = [...display];
              next[i] = { ...next[i], toolkit: (e.target.value || undefined) as ToolkitSlug | undefined };
              onChange(next.filter((x) => x.name.trim()));
            }}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="">Toolkit</option>
            {TOOLKITS.map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: 11.5, color: C.faint }}>At least three. Map each to a toolkit where it fits.</p>
    </div>
  );
}

// Story process: sectioned heading + body, the ugly steps included.
function SectionsField({ value, onChange }: { value: ProcessSection[]; onChange: (v: ProcessSection[]) => void }) {
  const rows = value.length ? value : [{ heading: "", body: "" }];
  const display = [...rows];
  if (display[display.length - 1]?.heading.trim() || display[display.length - 1]?.body.trim()) {
    display.push({ heading: "", body: "" });
  }
  function commit(next: ProcessSection[]) {
    onChange(next.filter((s) => s.heading.trim() || s.body.trim()));
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {display.map((s, i) => (
        <div key={i} style={{ display: "grid", gap: 6, border: `1px solid ${C.hair}`, borderRadius: 12, padding: 12 }}>
          <input
            value={s.heading}
            placeholder={`Step ${i + 1} heading`}
            onChange={(e) => {
              const next = [...display];
              next[i] = { ...next[i], heading: e.target.value };
              commit(next);
            }}
            style={inputStyle}
          />
          <textarea
            value={s.body}
            placeholder="What actually happened here, mess and all."
            onChange={(e) => {
              const next = [...display];
              next[i] = { ...next[i], body: e.target.value };
              commit(next);
            }}
            style={{ ...inputStyle, minHeight: 90, resize: "vertical", lineHeight: 1.55 }}
          />
        </div>
      ))}
      <p style={{ margin: 0, fontSize: 11.5, color: C.faint }}>At least three steps. Show the real process, not the highlight reel.</p>
    </div>
  );
}
