"use client";

// First-visit role gate for rovmusic.com. Three cards: artist, manager,
// collaborator. The answer is remembered, so this fires once per visitor and
// never again unless they reopen it from RoleChip.
//
// Deliberate restraint: it waits ~700ms so it doesn't fight the hero video for
// attention or main-thread time, it can be dismissed without answering, and
// dismissing does NOT persist a role (the page just falls back to artist copy).
// Answering scrolls to the readiness audit, which is the whole point of asking.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic2, Users, Palette, X } from "lucide-react";
import { type Role, useRole } from "@/components/music/RoleContext";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

const OPTIONS: {
  role: Role;
  icon: typeof Mic2;
  label: string;
  sub: string;
}[] = [
  { role: "artist", icon: Mic2, label: "I make the music", sub: "Artist, producer, writer" },
  { role: "manager", icon: Users, label: "I manage artists", sub: "Manager, label, or team" },
  { role: "other", icon: Palette, label: "I work behind the scenes", sub: "Design, video, venues, press" },
];

const REVEAL_DELAY_MS = 700;

export default function RoleGate() {
  const { role, ready, setRole } = useRole();
  const [open, setOpen] = useState(false);
  // Set by RoleChip's "change" affordance via a custom event.
  const [forced, setForced] = useState(false);

  // First visit only: no stored role, and only after the hero has settled.
  useEffect(() => {
    if (!ready || role) return;
    const t = setTimeout(() => setOpen(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready, role]);

  // Reopening from the chip.
  useEffect(() => {
    const reopen = () => {
      setForced(true);
      setOpen(true);
    };
    window.addEventListener("rovmusic:open-role-gate", reopen);
    return () => window.removeEventListener("rovmusic:open-role-gate", reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const choose = (next: Role) => {
    setRole(next);
    setOpen(false);
    setForced(false);
    // Collaborators have nothing to audit, so only artists and managers get
    // walked down to it.
    if (next === "other") return;
    window.setTimeout(() => {
      document.getElementById("audit")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 380);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tell us who you are"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 190, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[1.75rem] border border-white/10 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            style={{
              background: "linear-gradient(160deg, rgba(26,21,18,1) 0%, rgba(11,9,8,1) 100%)",
              boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,244,227,0.07)",
            }}
          >
            {/* Warm bloom, top left, matching the page's accent language */}
            <div
              aria-hidden
              className="absolute -top-16 -left-10 w-64 h-64 rounded-full pointer-events-none blur-[70px]"
              style={{ background: "radial-gradient(circle, rgba(234,154,97,0.16) 0%, transparent 70%)" }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <span
                className="block text-[11px] uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
                style={{ fontFamily: BODY }}
              >
                {forced ? "Switch view" : "Before you scroll"}
              </span>
              <h2
                className="text-white text-2xl md:text-3xl font-bold italic leading-tight mb-2"
                style={{ fontFamily: HEADING }}
              >
                Who are we talking to?
              </h2>
              <p
                className="text-white/45 text-sm leading-relaxed mb-6 max-w-sm"
                style={{ fontFamily: BODY }}
              >
                One tap and we&apos;ll show you the version of this page that&apos;s actually
                about you. Nothing to fill in.
              </p>

              <div className="flex flex-col gap-2.5">
                {OPTIONS.map((o) => {
                  const Icon = o.icon;
                  const isCurrent = role === o.role;
                  return (
                    <button
                      key={o.role}
                      type="button"
                      onClick={() => choose(o.role)}
                      className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.07]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-[#EA9A61]/40 hover:bg-[#EA9A61]/[0.04]"
                      }`}
                    >
                      <span className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border border-[#EA9A61]/20 bg-[#EA9A61]/[0.07]">
                        <Icon className="w-5 h-5 text-[#EA9A61]" strokeWidth={1.6} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className="block text-white text-base md:text-lg font-semibold"
                          style={{ fontFamily: HEADING }}
                        >
                          {o.label}
                        </span>
                        <span
                          className="block text-white/40 text-xs mt-0.5"
                          style={{ fontFamily: BODY }}
                        >
                          {o.sub}
                        </span>
                      </span>
                      <span className="shrink-0 text-white/25 group-hover:text-[#EA9A61] group-hover:translate-x-0.5 transition-all duration-300">
                        &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 w-full text-center text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer"
                style={{ fontFamily: BODY }}
              >
                Just browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
