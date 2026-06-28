"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — entry orchestrator
// The asteroid-belt landing is the entry screen. "Find a seat" leads
// into the immersive cafe (the deeper experience). The belt unmounts
// when you enter, so its RAF loop and listeners are torn down and only
// one heavy experience is ever live at a time.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import dynamic from "next/dynamic";
import TheFoldBelt from "./_components/TheFoldBelt";

// The cafe is heavy (audio, presence, scene). Load it only when the
// visitor commits to entering, keeping the landing's first paint light.
const TheFoldContent = dynamic(() => import("./TheFoldContent"), { ssr: false });

export default function FoldEntry() {
  const [entered, setEntered] = useState(false);
  if (entered) return <TheFoldContent />;
  return <TheFoldBelt onEnter={() => setEntered(true)} />;
}
