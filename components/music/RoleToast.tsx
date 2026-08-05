"use client";

// A three-second confirmation that the role choice registered, then it leaves.
//
// The job the old floating chip was doing badly: reassurance. That only needs
// to happen once, at the moment of choosing, not permanently in the corner of
// every section. Changing the role afterwards lives inline (RoleInline) and in
// the footer, where it's discoverable without being ambient.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ROLE_LABELS, type Role } from "@/components/music/IntakeContext";

const BODY = "'Roboto', sans-serif";
const VISIBLE_MS = 3000;

export const ROLE_CHOSEN_EVENT = "rovmusic:role-chosen";

export default function RoleToast() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const onChosen = (e: Event) => {
      const next = (e as CustomEvent<Role>).detail;
      setRole(next);
    };
    window.addEventListener(ROLE_CHOSEN_EVENT, onChosen);
    return () => window.removeEventListener(ROLE_CHOSEN_EVENT, onChosen);
  }, []);

  useEffect(() => {
    if (!role) return;
    const t = setTimeout(() => setRole(null), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [role]);

  return (
    <AnimatePresence>
      {role && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-[92px] left-1/2 -translate-x-1/2 z-[997] inline-flex items-center gap-2 rounded-full border border-[#EA9A61]/25 bg-black/85 backdrop-blur-md px-4 py-2 text-xs text-white/70 whitespace-nowrap pointer-events-none"
          style={{ fontFamily: BODY }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#EA9A61]" />
          Showing you the {ROLE_LABELS[role].toLowerCase()} version
        </motion.div>
      )}
    </AnimatePresence>
  );
}
