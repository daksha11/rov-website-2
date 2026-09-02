"use client";

import { markDone } from "@/lib/ctrla/progress";
import { readProfile } from "@/lib/ctrla/profile";

// ═══════════════════════════════════════════════════════
// THE FOLD — immersive work session
// Opening a session transforms the whole screen: the browse chrome
// fades, the belt calms into a themed backdrop, and your intention,
// timer, and tasks take the center. Each room reframes the SAME
// fundamentals into a different mental posture (showing up, thinking
// wide, heads down, unstuck, winding down, locked in) with its own
// copy, default rhythm, and accent. A "shift the vibe" row lets you
// re-purpose mid-session; your intention and tasks carry over.
//
// All local (localStorage), client-only. Timer counts down to a
// target timestamp so background-tab throttling never makes it drift.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "focus" | "break";
type Task = { id: string; text: string; done: boolean };

type Profile = {
  mode: string;
  purpose: string;
  intentPrompt: string;
  intentPlaceholder: string;
  taskLead: string;
  taskPlaceholder: string;
  cue: string;
  preset: number;
  accent: string;
};

// Each world = a chakra flown as a spaceflight state. Same fundamentals,
// different framing, accent tuned to the chakra. Keys match ROOMS ids.
const PROFILES: Record<string, Profile> = {
  root: {
    mode: "Launchpad",
    purpose: "Ignition, not perfection. Just start.",
    intentPrompt: "What are you sitting down to do?",
    intentPlaceholder: "one thing, in your words",
    taskLead: "Pre-flight",
    taskPlaceholder: "the smallest first move",
    cue: "You don't have to feel ready. You have to start the count.",
    preset: 0,
    accent: "#C8564A",
  },
  sacral: {
    mode: "The Drift",
    purpose: "Go wide. No wrong turns yet.",
    intentPrompt: "What are you exploring?",
    intentPlaceholder: "the question, not the answer",
    taskLead: "Threads to pull",
    taskPlaceholder: "a possibility, an angle",
    cue: "No wrong notes yet. Drift before you dive.",
    preset: 1,
    accent: "#E0894A",
  },
  solar: {
    mode: "Full Burn",
    purpose: "One target. Full thrust.",
    intentPrompt: "What are you shipping?",
    intentPlaceholder: "name the deliverable",
    taskLead: "On the burn",
    taskPlaceholder: "keep it concrete",
    cue: "Momentum beats mood. Light it and go.",
    preset: 1,
    accent: "#E6C24A",
  },
  heart: {
    mode: "Slow Orbit",
    purpose: "Coast. Close the loops.",
    intentPrompt: "What are you wrapping up?",
    intentPlaceholder: "the loose ends",
    taskLead: "Loose ends",
    taskPlaceholder: "a small thing to close",
    cue: "The hard push is behind you. Let it circle.",
    preset: 0,
    accent: "#5FAE86",
  },
  deep: {
    mode: "Deep Field",
    purpose: "One hard thing. The rest can wait.",
    intentPrompt: "The one thing you're going deep on?",
    intentPlaceholder: "name the hard thing",
    taskLead: "Just this",
    taskPlaceholder: "keep it to one",
    cue: "Seal the doors. There is only this.",
    preset: 1,
    accent: "#7A6AD0",
  },
  golden: {
    mode: "Golden Hour",
    purpose: "You earned the light. Now enjoy it.",
    intentPrompt: "What are you making in this light?",
    intentPlaceholder: "the good, unhurried work",
    taskLead: "On the patio",
    taskPlaceholder: "a thing worth savoring",
    cue: "Rare and electric. Do the work you love here.",
    preset: 1,
    accent: "#E7A33A",
  },
};

const PRESETS = [
  { label: "25 · 5", focus: 25 * 60, brk: 5 * 60 },
  { label: "50 · 10", focus: 50 * 60, brk: 10 * 60 },
  { label: "15 · 3", focus: 15 * 60, brk: 3 * 60 },
];

const LS = { intention: "fold.intention", tasks: "fold.tasks", sessions: "fold.sessions" };

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
};
const writeLS = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};
const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
const uid = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

// ── Favicon swap while a session runs (canvas-generated, no file) ──
// Finds the existing icon link (or makes one), and can repaint it as a small
// accent dot. All guarded; on any failure the tab icon simply stays as-is.
function getFaviconLink(): { link: HTMLLinkElement; created: boolean } | null {
  try {
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    let created = false;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      created = true;
    }
    return { link, created };
  } catch {
    return null;
  }
}
function paintFaviconDot(link: HTMLLinkElement, accent: string) {
  try {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    const g = c.getContext("2d");
    if (!g) return;
    g.fillStyle = "#0f0820";
    g.beginPath();
    g.arc(16, 16, 15, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = accent;
    g.beginPath();
    g.arc(16, 16, 8, 0, Math.PI * 2);
    g.fill();
    link.type = "image/png";
    link.href = c.toDataURL("image/png");
  } catch {}
}

type RoomLite = { id: string; name: string; state: string };

const BASE_TITLE = "The Fold";

export default function FoldSession({
  open,
  locked,
  roomId,
  rooms,
  streak,
  goldenId,
  goldenUnlock,
  chime,
  onSessions,
  onPickRoom,
  onToggleLock,
  onExit,
}: {
  open: boolean;
  locked: boolean;
  roomId: string;
  rooms: RoomLite[];
  streak: number;
  goldenId: string;
  goldenUnlock: number;
  chime: (variant?: "up" | "down") => void;
  onSessions: (n: number) => void;
  onPickRoom: (id: string) => void;
  onToggleLock: () => void;
  onExit: () => void;
}) {
  const profile = PROFILES[roomId] ?? PROFILES.root;
  const roomName = rooms.find((r) => r.id === roomId)?.name ?? "The Fold";

  // ── Persisted state ──
  const [intention, setIntention] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIntention(read(LS.intention, ""));
    setTasks(read(LS.tasks, [] as Task[]));
    setSessions(read(LS.sessions, 0));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) writeLS(LS.intention, intention); }, [intention, hydrated]);
  useEffect(() => { if (hydrated) writeLS(LS.tasks, tasks); }, [tasks, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    writeLS(LS.sessions, sessions);
    onSessions(sessions); // keep the parent's lock + greeting in sync
  }, [sessions, hydrated, onSessions]);

  // ── Timer ──
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  // The timer is a summoned pop-up now, not the centerpiece. The bar chip and
  // the intention CTA both open it; it keeps ticking in the chip when closed.
  const [timerOpen, setTimerOpen] = useState(false);
  const [presetIdx, setPresetIdx] = useState(profile.preset);
  const [remaining, setRemaining] = useState(PRESETS[profile.preset].focus);
  const endRef = useRef<number | null>(null);
  const preset = PRESETS[presetIdx];
  const lenFor = useCallback((m: Mode) => (m === "focus" ? preset.focus : preset.brk), [preset]);

  // When the vibe shifts and the timer is idle, adopt that room's rhythm.
  useEffect(() => {
    if (!running) setPresetIdx(profile.preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!running) setRemaining(lenFor(mode));
  }, [presetIdx, mode, running, lenFor]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endRef.current == null) return;
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        endRef.current = null;
        setRunning(false);
        if (mode === "focus") {
          setSessions((s) => s + 1);
          // The path: a finished session is the "Work" stop.
          markDone(readProfile()?.crafts[0] ?? "music", "work", { fold: true });
          setMode("break");
          chime("down"); // focus → break: a soft settle
        } else {
          setMode("focus");
          chime("up"); // break → focus: a gentle lift
        }
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, [running, mode, chime]);

  const start = () => { endRef.current = Date.now() + remaining * 1000; setRunning(true); };
  const pause = () => { setRunning(false); endRef.current = null; };
  const reset = () => { setRunning(false); endRef.current = null; setRemaining(lenFor(mode)); };
  const switchMode = (m: Mode) => { setRunning(false); endRef.current = null; setMode(m); setRemaining(lenFor(m)); };
  const total = lenFor(mode);
  const frac = total > 0 ? 1 - remaining / total : 0;

  // ── "Leave it running" — the tab keeps the session present ──
  // Remember the real page title once, so we can always put it back.
  const titleRef = useRef<string>("");
  useEffect(() => { titleRef.current = document.title; }, []);

  // While running: live countdown in the tab title. Cleanup (on stop OR unmount)
  // restores the original title and favicon. Capturing prevHref here — before
  // the accent effect paints — keeps the restore honest across vibe shifts.
  useEffect(() => {
    if (!running) return;
    const fav = getFaviconLink();
    const prevHref = fav?.link.getAttribute("href") ?? null;
    return () => {
      document.title = titleRef.current || BASE_TITLE;
      if (fav) {
        if (fav.created) fav.link.remove();
        else if (prevHref) fav.link.setAttribute("href", prevHref);
        else fav.link.removeAttribute("href");
      }
    };
  }, [running]);

  // Tick the title text every second while running.
  useEffect(() => {
    if (running) document.title = `${fmt(remaining)} · ${BASE_TITLE}`;
  }, [running, remaining]);

  // Paint the favicon dot in the current room's accent while running.
  useEffect(() => {
    if (!running) return;
    const fav = getFaviconLink();
    if (fav) paintFaviconDot(fav.link, profile.accent);
  }, [running, profile.accent]);

  // ── Tasks ──
  const [draft, setDraft] = useState("");
  const addTask = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: uid(), text, done: false }]);
    setDraft("");
  };
  const toggleTask = (id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const removeTask = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));
  const clearDone = () => setTasks((t) => t.filter((x) => !x.done));
  const doneCount = tasks.filter((t) => t.done).length;

  // Escape closes the timer pop-up first; otherwise it exits the session — but
  // never while locked, so a stray keypress can't drop you out of a frozen world.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (timerOpen) { setTimerOpen(false); return; }
      if (!locked) onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, locked, timerOpen, onExit]);

  return (
    <div
      className={`fold__session${open ? " fold__session--open" : ""}`}
      style={{ ["--accent" as string]: profile.accent }}
      aria-hidden={!open}
    >
      <div className="fold__session-bar">
        <span className="fold__session-brand">The Fold · <b>{roomName}</b></span>
        <div className="fold__session-baractions">
          <button
            type="button"
            className={`fold__session-timerchip${running ? " is-running" : ""}`}
            onClick={() => setTimerOpen(true)}
            title="Open the focus timer"
          >
            <span className="fold__session-timerchip-dot" aria-hidden />
            <span className="fold__session-timerchip-time">{fmt(remaining)}</span>
            <span className="fold__session-timerchip-label">{running ? (mode === "focus" ? "focusing" : "break") : "timer"}</span>
          </button>
          <button
            type="button"
            className={`fold__session-lock${locked ? " is-locked" : ""}`}
            onClick={onToggleLock}
            aria-pressed={locked}
            title={locked ? "Scrolling is frozen. Click to unlock and fly again." : "Freeze this world so scrolling can't change it."}
          >
            <span className="fold__session-lock-dot" aria-hidden />
            {locked ? "Locked in" : "Lock session"}
          </button>
          <button
            type="button"
            className="fold__session-exit"
            onClick={onExit}
            disabled={locked}
            title={locked ? "Unlock first to leave the session" : undefined}
          >
            Exit session →
          </button>
        </div>
      </div>

      <div className="fold__session-body">
        {/* The intention is the calm centerpiece now — timer summoned on demand. */}
        <div className="fold__session-focus">
          <span className="fold__session-mode">{profile.mode}</span>
          <p className="fold__session-purpose">{profile.purpose}</p>

          <div className="fold__session-intentwrap">
            <label className="fold__session-prompt" htmlFor="fold-intention">{profile.intentPrompt}</label>
            <input
              id="fold-intention"
              className="fold__session-intent"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={profile.intentPlaceholder}
              maxLength={120}
            />
          </div>

          <p className="fold__session-cue">{profile.cue}</p>

          <button
            type="button"
            className={`fold__session-rhythmcta${running ? " is-running" : ""}`}
            onClick={() => setTimerOpen(true)}
          >
            <span className="fold__session-rhythmcta-dot" aria-hidden />
            <span className="fold__session-rhythmcta-text">
              {running ? `${mode === "focus" ? "Focusing" : "On a break"} · ${fmt(remaining)}` : "Set a rhythm"}
            </span>
            <span className="fold__session-rhythmcta-arrow" aria-hidden>→</span>
          </button>
        </div>

        <aside className="fold__session-side">
          <div className="fold__tasks">
            <div className="fold__tasks-head">
              <span className="fold__focus-label">{profile.taskLead}</span>
              {doneCount > 0 && (
                <button type="button" className="fold__tasks-clear" onClick={clearDone}>clear {doneCount} done</button>
              )}
            </div>
            <div className="fold__tasks-add">
              <input
                className="fold__tasks-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
                placeholder={profile.taskPlaceholder}
                maxLength={140}
              />
              <button type="button" className="fold__tasks-addbtn" onClick={addTask} aria-label="Add task">+</button>
            </div>
            <ul className="fold__tasks-list">
              {tasks.length === 0 && <li className="fold__tasks-empty">nothing yet. name the first small step.</li>}
              {tasks.map((t) => (
                <li key={t.id} className={`fold__task${t.done ? " is-done" : ""}`}>
                  <button type="button" className="fold__task-check" onClick={() => toggleTask(t.id)} aria-pressed={t.done} aria-label={t.done ? "Mark not done" : "Mark done"}>
                    {t.done ? "✓" : ""}
                  </button>
                  <span className="fold__task-text">{t.text}</span>
                  <button type="button" className="fold__task-del" onClick={() => removeTask(t.id)} aria-label="Remove task">✕</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className={`fold__session-vibes${locked ? " is-frozen" : ""}`}>
        <span className="fold__session-vibes-lead">
          {locked ? "Locked in — unlock to fly between worlds" : "Shift the vibe"}
        </span>
        {rooms.map((r) => {
          const earnLocked = r.id === goldenId && sessions < goldenUnlock;
          const frozen = locked && r.id !== roomId; // the current world stays lit
          return (
            <button
              key={r.id}
              type="button"
              className={`fold__session-vibe${r.id === roomId ? " is-on" : ""}${earnLocked ? " is-locked" : ""}${frozen ? " is-frozen" : ""}`}
              onClick={() => { if (locked) return; onPickRoom(r.id); }}
              aria-disabled={earnLocked || frozen || undefined}
              title={
                locked
                  ? "Session locked — unlock to change worlds"
                  : earnLocked
                    ? `Opens after ${goldenUnlock} finished sessions`
                    : undefined
              }
            >
              {r.name}
              {earnLocked ? (
                <span className="fold__session-vibe-state">{sessions} / {goldenUnlock}</span>
              ) : (
                r.state && <span className="fold__session-vibe-state">{r.state}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Focus timer — a summoned pop-up, not the centerpiece. */}
      <div
        className={`fold__timerpop${timerOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Focus timer"
        aria-hidden={!timerOpen}
      >
        <button type="button" className="fold__timerpop-scrim" aria-label="Close timer" tabIndex={-1} onClick={() => setTimerOpen(false)} />
        <div className="fold__timerpop-card">
          <div className="fold__timerpop-head">
            <span className="fold__timerpop-title">Rhythm · {roomName}</span>
            <button type="button" className="fold__timerpop-close" onClick={() => setTimerOpen(false)} aria-label="Close timer">✕</button>
          </div>

          <div className="fold__timer">
            <div className="fold__timer-modes">
              <button type="button" className={`fold__timer-mode${mode === "focus" ? " is-on" : ""}`} onClick={() => switchMode("focus")}>Focus</button>
              <button type="button" className={`fold__timer-mode${mode === "break" ? " is-on" : ""}`} onClick={() => switchMode("break")}>Break</button>
            </div>
            <div className={`fold__timer-ring${running ? " is-running" : ""}`} style={{ ["--frac" as string]: frac }}>
              <span className="fold__timer-phase">{mode === "focus" ? "focus" : "break"}</span>
              <span className="fold__timer-time">{fmt(remaining)}</span>
            </div>
            <div className="fold__timer-controls">
              <button type="button" className="fold__timer-btn fold__timer-btn--primary" onClick={running ? pause : start}>
                {running ? "Pause" : "Start"}
              </button>
              <button type="button" className="fold__timer-btn" onClick={reset}>Reset</button>
            </div>
            <div className="fold__timer-meta">
              <div className="fold__timer-presets">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`fold__timer-preset${i === presetIdx ? " is-on" : ""}`}
                    onClick={() => setPresetIdx(i)}
                    disabled={running}
                    title={running ? "pause to change length" : undefined}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <span className="fold__timer-sessions">{sessions} done</span>
            </div>
            {streak > 0 && (
              <p className="fold__timer-streak">
                {streak >= 2 ? `${streak} days in a row` : "Day one of a new streak"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
