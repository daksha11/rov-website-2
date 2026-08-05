"use client";

// "Answering as an artist · change", inline.
//
// Replaces the old floating RoleChip, which was a second persistent pill
// stacked above the nav dock. That was global chrome for state that only
// changes three sections, so it paid rent everywhere and earned it nowhere.
// This renders only inside the sections where the role actually does something,
// which is also the only place changing it would be useful.

import { ROLE_LABELS, openRoleGate, useIntake } from "@/components/music/IntakeContext";

const BODY = "'Roboto', sans-serif";

const ARTICLE: Record<string, string> = {
  artist: "an artist",
  manager: "a manager",
  other: "a collaborator",
};

export default function RoleInline({ verb = "Answering" }: { verb?: string }) {
  const { role, ready } = useIntake();

  // Nothing to say until they've chosen. The page reads as artist copy by
  // default, and announcing that would be noise.
  if (!ready || !role) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-white/30 text-xs" style={{ fontFamily: BODY }}>
      <span className="h-1 w-1 rounded-full bg-[#EA9A61]/60" />
      {verb} as {ARTICLE[role] ?? ROLE_LABELS[role]}
      <span className="text-white/15">·</span>
      <button
        type="button"
        onClick={openRoleGate}
        className="text-[#EA9A61]/70 hover:text-[#EA9A61] underline underline-offset-2 decoration-[#EA9A61]/25 hover:decoration-[#EA9A61]/60 transition-colors cursor-pointer"
      >
        change
      </button>
    </span>
  );
}
