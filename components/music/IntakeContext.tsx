"use client";

// Everything we've learned about this visitor, in one place.
//
// Replaces the old RoleContext, which only held who they were. The two intakes
// on this site (the quote estimator in Act 2, the readiness audit in Act 3)
// used to know nothing about each other, so the same person could tell the
// audit they have no cover art and then be asked by the estimator whether they
// want cover art. One store fixes that, it lets the estimator drop a whole
// question when the audit already answered it, and it means a lead arrives as
// a single profile rather than two disconnected form fills.
//
// Persisted to localStorage so a returning visitor isn't re-interrogated.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Role = "artist" | "manager" | "other";

const STORAGE_KEY = "rovmusic:intake";
// Bumped when the shape changes, so stale profiles are dropped rather than
// half-read into a newer UI.
const SCHEMA_VERSION = 2;

export interface AuditResult {
  /** Keys of the readiness items they said they already have. */
  have: string[];
  /** Keys they're missing. Derived at write time so consumers don't recompute. */
  missing: string[];
  score: number;
  total: number;
}

export interface RosterProfile {
  size: string;
  stage: string;
}

export interface EstimateResult {
  need: string;
  songs: string;
  extras: string[];
  cadence: string;
  /** Recommended checkout key, if any. */
  plan: string | null;
}

interface Profile {
  role: Role | null;
  audit: AuditResult | null;
  roster: RosterProfile | null;
  estimate: EstimateResult | null;
}

interface IntakeState extends Profile {
  /** localStorage has been read. Until then, render nothing role-dependent. */
  ready: boolean;
  setRole: (role: Role) => void;
  setAudit: (audit: AuditResult) => void;
  setRoster: (roster: RosterProfile) => void;
  setEstimate: (estimate: EstimateResult) => void;
  clearAll: () => void;
}

const EMPTY: Profile = { role: null, audit: null, roster: null, estimate: null };

const IntakeContext = createContext<IntakeState | null>(null);

function isRole(value: unknown): value is Role {
  return value === "artist" || value === "manager" || value === "other";
}

export function IntakeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Profile>(EMPTY);
  const [ready, setReady] = useState(false);

  // Setters read the latest profile through a ref so they stay referentially
  // stable, which keeps them safe inside consumers' dependency arrays.
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Profile> & { v?: number };
        if (parsed.v === SCHEMA_VERSION) {
          setState({
            role: isRole(parsed.role) ? parsed.role : null,
            audit: parsed.audit ?? null,
            roster: parsed.roster ?? null,
            estimate: parsed.estimate ?? null,
          });
        }
      }
    } catch {
      // Private mode, disabled storage, or corrupt JSON. Treat as a first visit.
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: Profile) => {
    setState(next);
    stateRef.current = next;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ v: SCHEMA_VERSION, ...next })
      );
    } catch {
      // Non-fatal: the answers still apply for this session.
    }
  }, []);

  const setRole = useCallback((role: Role) => persist({ ...stateRef.current, role }), [persist]);
  const setAudit = useCallback((audit: AuditResult) => persist({ ...stateRef.current, audit }), [persist]);
  const setRoster = useCallback((roster: RosterProfile) => persist({ ...stateRef.current, roster }), [persist]);
  const setEstimate = useCallback((estimate: EstimateResult) => persist({ ...stateRef.current, estimate }), [persist]);
  const clearAll = useCallback(() => persist(EMPTY), [persist]);

  const value = useMemo(
    () => ({ ...state, ready, setRole, setAudit, setRoster, setEstimate, clearAll }),
    [state, ready, setRole, setAudit, setRoster, setEstimate, clearAll]
  );

  return <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>;
}

export function useIntake(): IntakeState {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error("useIntake must be used inside an IntakeProvider");
  return ctx;
}

/**
 * Same, but returns null instead of throwing when there's no provider. For
 * shared chrome like the footer, which renders on every music page: a page that
 * forgets the provider should quietly lose the role switcher, not 500.
 */
export function useOptionalIntake(): IntakeState | null {
  return useContext(IntakeContext);
}

/**
 * The effective role for copy purposes. Treats "not yet answered" as artist,
 * since artists are the default audience and the page must read correctly
 * before anyone touches the gate (and for crawlers, which never will).
 */
export function useEffectiveRole(): Role {
  return useIntake().role ?? "artist";
}

export const ROLE_LABELS: Record<Role, string> = {
  artist: "Artist",
  manager: "Manager",
  other: "Collaborator",
};

/** Fired by the inline switchers and the footer link to reopen the gate. */
export const OPEN_GATE_EVENT = "rovmusic:open-role-gate";

export function openRoleGate() {
  window.dispatchEvent(new Event(OPEN_GATE_EVENT));
}
