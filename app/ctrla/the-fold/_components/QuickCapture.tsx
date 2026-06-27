"use client";

// Leave a line in the notebook and stay in the room. One line only.

import { useState } from "react";
import { ed } from "../../_components/editorial";

export default function QuickCapture() {
  const [v, setV] = useState("");
  const [flash, setFlash] = useState(false);

  const save = () => {
    if (!v.trim()) return;
    setV("");
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
        {flash ? "Caught" : "Notebook"}
      </span>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="one line, then back to it"
        aria-label="Notebook"
        style={{
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${flash ? ed.gold : ed.hair}`,
          outline: "none",
          padding: "5px 0",
          fontFamily: ed.body,
          fontSize: "clamp(13px,1.5vw,16px)",
          color: ed.paper,
          transition: "border-color .3s ease",
        }}
      />
    </div>
  );
}
