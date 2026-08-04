"use client";

// Who's looking at rovmusic.com. An artist, someone managing artists, or a
// collaborator. The choice is made once in RoleGate, remembered in
// localStorage, and read across the page to swap CTAs and reorder sections.
//
// `role === null` means the visitor hasn't answered yet. `ready` distinguishes
// "hasn't answered" from "we haven't read localStorage yet", so the gate never
// flashes for a returning visitor.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Role = "artist" | "manager" | "other";

const STORAGE_KEY = "rovmusic:role";

function isRole(value: unknown): value is Role {
  return value === "artist" || value === "manager" || value === "other";
}

interface RoleState {
  role: Role | null;
  /** localStorage has been read. Until then, render nothing role-dependent. */
  ready: boolean;
  setRole: (role: Role) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isRole(stored)) setRoleState(stored);
    } catch {
      // Private mode or storage disabled. Treat as a first visit.
    }
    setReady(true);
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Non-fatal: the choice still applies for this session.
    }
  }, []);

  const clearRole = useCallback(() => {
    setRoleState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Non-fatal.
    }
  }, []);

  const value = useMemo(
    () => ({ role, ready, setRole, clearRole }),
    [role, ready, setRole, clearRole]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleState {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside a RoleProvider");
  return ctx;
}

/**
 * The effective role for copy purposes. Treats "not yet answered" as artist,
 * since artists are the default audience and the page must read correctly
 * before anyone touches the gate (and for crawlers, which never will).
 */
export function useEffectiveRole(): Role {
  const { role } = useRole();
  return role ?? "artist";
}

export const ROLE_LABELS: Record<Role, string> = {
  artist: "Artist",
  manager: "Manager",
  other: "Collaborator",
};
