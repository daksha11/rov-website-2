"use client";

// One line only. Catch the thought, stay in the room. Saves to the
// in-memory session export shown at the end.

import { useState } from "react";
import { ed } from "../../../_components/editorial";

export default function QuickCapture({ onSave }: { onSave: (line: string) => void }) {
  const [v, setV] = useState("");
  const [flash, setFlash] = useState(false);

  const save = () => {
    const line = v.trim();
    if (!line) return;
    onSave(line);
    setV("");
    setFlash(true);
    window.setTimeout(() => setFlash(false), 900);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.inkFaint }}>
        {flash ? "Caught" : "Catch a thought"}
      </span>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        placeholder="one line, then back to it"
        aria-label="Quick capture"
        style={{
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${flash ? ed.gold : ed.hair}`,
          outline: "none",
          padding: "6px 0",
          fontFamily: ed.body,
          fontSize: "clamp(14px,1.6vw,17px)",
          color: ed.paper,
          transition: "border-color .3s ease",
        }}
      />
    </div>
  );
}
