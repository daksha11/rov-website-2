"use client";

/**
 * CostHeader · the Track B (magazine) submit header. Shows the cost from the
 * form config against the member's live balance, and when they are short, an
 * inline earn path instead of a dead end. Nothing is spent until submit.
 */

import Link from "next/link";
import { C, NORWIGE, card } from "./theme";

export default function CostHeader({
  cost,
  balance,
  short,
}: {
  cost: number;
  balance: number | null;
  short: boolean;
}) {
  return (
    <div style={{ ...card, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Cost to submit</p>
        <p style={{ margin: "4px 0 0", fontFamily: NORWIGE, fontWeight: 700, fontSize: 22, color: C.gold }}>{cost} credits</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 12, color: C.faint }}>Your balance</p>
        <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: short ? C.rose : C.cream }}>
          {balance === null ? "…" : balance.toLocaleString()}
        </p>
      </div>
      {short && (
        <p style={{ flexBasis: "100%", margin: 0, fontSize: 13, color: C.soft, lineHeight: 1.6 }}>
          A little short. Earn more by playing{" "}
          <Link href="/ctrla" style={{ color: C.gold }}>the Daily</Link>, finishing a guide, or following on Instagram, then come back. Nothing here is spent until you submit.
        </p>
      )}
    </div>
  );
}
