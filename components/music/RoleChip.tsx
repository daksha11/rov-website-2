"use client";

// "Viewing as: Artist · change" — the escape hatch that keeps RoleGate from
// feeling like a one-way door. Only renders once a role is actually chosen,
// and sits above the MusicNav dock without colliding with it.

import { motion } from "framer-motion";
import { ROLE_LABELS, useRole } from "@/components/music/RoleContext";

const BODY = "'Roboto', sans-serif";

export default function RoleChip() {
  const { role, ready } = useRole();

  if (!ready || !role) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      onClick={() => window.dispatchEvent(new Event("rovmusic:open-role-gate"))}
      aria-label={`Viewing as ${ROLE_LABELS[role]}. Change.`}
      className="fixed bottom-[86px] left-1/2 -translate-x-1/2 z-[998] inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 backdrop-blur-md px-3.5 py-1.5 text-[11px] text-white/50 hover:text-white/80 hover:border-[#EA9A61]/40 transition-colors cursor-pointer whitespace-nowrap"
      style={{ fontFamily: BODY }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#EA9A61]" />
      Viewing as {ROLE_LABELS[role]}
      <span className="text-white/25">·</span>
      <span className="text-[#EA9A61]/80">change</span>
    </motion.button>
  );
}
