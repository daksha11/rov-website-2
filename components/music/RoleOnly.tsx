"use client";

// Renders children only for certain roles. Used to reorder proof on the page:
// managers need the Sam Suen case study early (it's the only asset that proves
// we can run a career), artists are better served by it late, after the song
// level offers have landed.
//
// `fallbackVisible` decides what happens before a role is chosen and for any
// visitor who dismisses the gate. Default true, so the page is never emptier
// than it was before this shipped.

import { useRole, type Role } from "@/components/music/RoleContext";

export default function RoleOnly({
  roles,
  fallbackVisible = true,
  children,
}: {
  roles: Role[];
  fallbackVisible?: boolean;
  children: React.ReactNode;
}) {
  const { role, ready } = useRole();

  // Before localStorage is read, show whatever the no-role case would show.
  // Prevents a visible section popping in or out on hydration.
  if (!ready || !role) return fallbackVisible ? <>{children}</> : null;

  return roles.includes(role) ? <>{children}</> : null;
}
