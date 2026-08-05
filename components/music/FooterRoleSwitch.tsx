"use client";

// The permanent, unobtrusive home for "I picked the wrong one".
//
// The role gate fires once and the toast confirms it for three seconds. After
// that the only always-available way back is here, in the footer, where a
// settings-shaped affordance belongs. RoleInline covers the sections where
// changing it would actually alter what you're reading.

import { ROLE_LABELS, openRoleGate, useOptionalIntake } from "@/components/music/IntakeContext";

export default function FooterRoleSwitch() {
  // Optional on purpose: the footer renders on every music page, and one that
  // forgets the provider should lose this control rather than crash.
  const intake = useOptionalIntake();

  if (!intake?.ready) return null;
  const { role } = intake;

  return (
    <button
      type="button"
      onClick={openRoleGate}
      className="text-white/40 hover:text-white/70 text-xs md:text-sm transition-colors cursor-pointer text-left"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {role ? (
        <>
          Viewing as {ROLE_LABELS[role]}
          <span className="text-white/20 mx-1.5">·</span>
          <span className="text-[#EA9A61]/70">change</span>
        </>
      ) : (
        <span className="text-[#EA9A61]/70">Who are you? Tailor this page</span>
      )}
    </button>
  );
}
