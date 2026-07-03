"use client";

import { useMemo, useState } from "react";

const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const ORANGE = "#EA9A61";
const NEGATIVE = "#A6402C";
const LINE = "rgba(59,33,20,0.14)";

const BROKER_OPTIONS = [
  { value: 70, label: "KW pre-cap, 70% to agent" },
  { value: 80, label: "eXp pre-cap, 80% to agent" },
  { value: 95, label: "RE/MAX, 95% (after desk fee)" },
  { value: 100, label: "100% model (Real/ONE), flat fee" },
  { value: 50, label: "Rookie / high-split, 50%" },
];

function money(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

interface CascadeRow {
  label: string;
  amount: number;
  isSubtraction: boolean;
}

export function MoneyFlowCalculator() {
  const [price, setPrice] = useState(400000);
  const [comm, setComm] = useState(5.5);
  const [sideMul, setSideMul] = useState<1 | 2>(1);
  const [broker, setBroker] = useState(100);
  const [onTeam, setOnTeam] = useState(false);
  const [team, setTeam] = useState(50);
  const [tax, setTax] = useState(28);

  const result = useMemo(() => {
    const commFrac = comm / 100;
    const brokerKeepFrac = broker / 100;
    const teamTakeFrac = team / 100;
    const taxFrac = tax / 100;

    const total = price * commFrac;
    const sideGross = sideMul === 2 ? total : total / 2;
    const afterBroker = sideGross * brokerKeepFrac;
    const afterTeam = onTeam ? afterBroker * (1 - teamTakeFrac) : afterBroker;
    const afterTax = afterTeam * (1 - taxFrac);

    const rows: CascadeRow[] = [
      { label: `Total commission (${commFrac === Math.floor(commFrac) ? comm : comm}%)`, amount: total, isSubtraction: false },
      { label: sideMul === 2 ? "Both sides (dual agency)" : "Your one side", amount: sideGross, isSubtraction: false },
      { label: `− Brokerage keeps ${Math.round((1 - brokerKeepFrac) * 100)}%`, amount: afterBroker, isSubtraction: true },
    ];
    if (onTeam) {
      rows.push({ label: `− Team lead keeps ${Math.round(teamTakeFrac * 100)}%`, amount: afterTeam, isSubtraction: true });
    }
    rows.push({ label: `− Taxes set aside ${Math.round(taxFrac * 100)}%`, amount: afterTax, isSubtraction: true });

    const pct = total > 0 ? Math.round((afterTax / total) * 100) : 0;
    const keepNote = `The agent keeps ~${pct}% of the ${money(total)} the seller paid. The rest went to the broker${onTeam ? ", the team lead," : ""} and taxes.`;

    return { total, afterTax, rows, keepNote };
  }, [price, comm, sideMul, broker, onTeam, team, tax]);

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
        className="rov-calc-grid"
      >
        {/* CONTROLS */}
        <div>
          <Control label="Sale price" value={money(price)}>
            <input
              type="range"
              min={150000}
              max={2000000}
              step={10000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ accentColor: RUST, width: "100%" }}
              aria-label="Sale price"
            />
          </Control>

          <Control label="Total commission" value={`${comm.toFixed(1)}%`}>
            <input
              type="range"
              min={4}
              max={6}
              step={0.1}
              value={comm}
              onChange={(e) => setComm(Number(e.target.value))}
              style={{ accentColor: RUST, width: "100%" }}
              aria-label="Total commission percentage"
            />
          </Control>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Your side</label>
            <div style={{ display: "flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
              {([1, 2] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSideMul(v)}
                  style={{
                    flex: 1,
                    background: sideMul === v ? RUST : "#fff",
                    color: sideMul === v ? "#FFF4E3" : ESPRESSO,
                    border: "none",
                    padding: 9,
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {v === 1 ? "One side (listing OR buyer)" : "Both sides (dual)"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Brokerage split (agent keeps)</label>
            <select
              value={broker}
              onChange={(e) => setBroker(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 9,
                border: `1px solid ${LINE}`,
                borderRadius: 8,
                background: "#fff",
                color: ESPRESSO,
                fontFamily: "inherit",
                fontSize: 14,
              }}
            >
              {BROKER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ToggleSwitch checked={onTeam} onChange={setOnTeam} label="On a team? (lead takes a cut)" />
            </div>
            {onTeam && (
              <div>
                <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between", color: "rgba(59,33,20,0.65)" }}>
                  Team keeps <span style={{ color: RUST, fontVariantNumeric: "tabular-nums" }}>{team}%</span>
                </label>
                <input
                  type="range"
                  min={30}
                  max={60}
                  step={5}
                  value={team}
                  onChange={(e) => setTeam(Number(e.target.value))}
                  style={{ accentColor: RUST, width: "100%" }}
                  aria-label="Team lead split percentage"
                />
              </div>
            )}
          </div>

          <Control label="Tax set-aside" value={`${tax}%`}>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              style={{ accentColor: RUST, width: "100%" }}
              aria-label="Tax set-aside percentage"
            />
          </Control>
        </div>

        {/* OUTPUT */}
        <div>
          <div style={{ marginBottom: 16 }}>
            {result.rows.map((row) => {
              const width = Math.max(4, (row.amount / result.total) * 100);
              return (
                <div key={row.label} style={{ marginBottom: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "9px 0",
                      borderBottom: `1px dashed ${LINE}`,
                      fontSize: 14.5,
                      color: ESPRESSO,
                    }}
                  >
                    <span>{row.label}</span>
                    <span
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                        color: row.isSubtraction ? NEGATIVE : ESPRESSO,
                      }}
                    >
                      {money(row.amount)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 6,
                      background: row.isSubtraction ? NEGATIVE : RUST,
                      marginTop: 4,
                      width: `${width}%`,
                      transition: "width .3s",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: RUST,
              color: "#FFF4E3",
              borderRadius: 12,
              padding: "18px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 40, lineHeight: 1 }}>{money(result.afterTax)}</div>
            <div style={{ fontSize: 13, color: "rgba(255,244,227,0.8)", marginTop: 4 }}>real take-home on this one deal</div>
          </div>

          <p style={{ fontSize: 13.5, color: "rgba(59,33,20,0.65)", marginTop: 12, textAlign: "center", fontStyle: "italic" }}>
            {result.keepNote}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .rov-calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Control({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
        {label} <span style={{ color: RUST, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </label>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <span
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        style={{
          position: "relative",
          width: 44,
          height: 24,
          flex: "0 0 auto",
          background: checked ? RUST : "#D9D2C4",
          borderRadius: 20,
          transition: ".2s",
          display: "inline-block",
        }}
      >
        <span
          style={{
            position: "absolute",
            height: 18,
            width: 18,
            left: checked ? 23 : 3,
            top: 3,
            background: "#fff",
            borderRadius: "50%",
            transition: ".2s",
          }}
        />
      </span>
      <span style={{ fontSize: 14, color: ESPRESSO, fontWeight: 600 }}>{label}</span>
    </label>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 7,
  color: ESPRESSO,
  fontFamily: "inherit",
};
