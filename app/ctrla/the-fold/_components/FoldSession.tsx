"use client";

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

// Each room = a posture for the work. Same fundamentals, different framing.
const PROFILES: Record<string, Profile> = {
  commons: {
    mode: "Showing up",
    purpose: "Just start. Presence is most of the trick.",
    intentPrompt: "What are you sitting down to do?",
    intentPlaceholder: "one thing, in your words",
    taskLead: "On the floor",
    taskPlaceholder: "add a task",
    cue: "You don't have to feel ready. You just have to begin.",
    preset: 0,
    accent: "#E3C24A",
  },
  window: {
    mode: "Thinking wide",
    purpose: "Step back. Let the idea breathe.",
    intentPrompt: "What are you trying to figure out?",
    intentPlaceholder: "the question, not the answer",
    taskLead: "Threads to pull",
    taskPlaceholder: "a possibility, an angle",
    cue: "No wrong notes yet. Go wide before you go deep.",
    preset: 1,
    accent: "#8E76B8",
  },
  back: {
    mode: "Heads down",
    purpose: "One hard thing. The rest can wait.",
    intentPrompt: "The one thing you're going deep on?",
    intentPlaceholder: "name the hard thing",
    taskLead: "Just this",
    taskPlaceholder: "keep it to one",
    cue: "Close the tabs in your head. There is only this.",
    preset: 1,
    accent: "#A56A67",
  },
  quiet: {
    mode: "Unstuck",
    purpose: "Stuck is allowed. Make it small.",
    intentPrompt: "What's the smallest step from here?",
    intentPlaceholder: "something tiny",
    taskLead: "One inch",
    taskPlaceholder: "the two-minute version",
    cue: "You don't have to finish. You just have to move an inch.",
    preset: 2,
    accent: "#7E89A6",
  },
  veranda: {
    mode: "Winding down",
    purpose: "Lower the stakes. Close the loops.",
    intentPrompt: "What are you wrapping up?",
    intentPlaceholder: "the loose ends",
    taskLead: "Loose ends",
    taskPlaceholder: "a small thing to close",
    cue: "The hard work is behind you. This is the easy mile.",
    preset: 0,
    accent: "#C98A4A",
  },
  golden: {
    mode: "Locked in",
    purpose: "You're in it. Protect the flow.",
    intentPrompt: "What are you riding right now?",
    intentPlaceholder: "stay with it",
    taskLead: "In the flow",
    taskPlaceholder: "don't break stride",
    cue: "Don't break the chain. Stay exactly here.",
    preset: 1,
    accent: "#E3C24A",
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

type RoomLite = { id: string; name: string; state: string };

export default function FoldSession({
  open,
  roomId,
  rooms,
  onPickRoom,
  onExit,
}: {
  open: boolean;
  roomId: string;
  rooms: RoomLite[];
  onPickRoom: (id: string) => void;
  onExit: () => void;
}) {
  const profile = PROFILES[roomId] ?? PROFILES.commons;
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
  useEffect(() => { if (hydrated) writeLS(LS.sessions, sessions); }, [sessions, hydrated]);

  // ── Timer ──
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
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
          setMode("break");
        } else {
          setMode("focus");
        }
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, [running, mode]);

  const start = () => { endRef.current = Date.now() + remaining * 1000; setRunning(true); };
  const pause = () => { setRunning(false); endRef.current = null; };
  const reset = () => { setRunning(false); endRef.current = null; setRemaining(lenFor(mode)); };
  const switchMode = (m: Mode) => { setRunning(false); endRef.current = null; setMode(m); setRemaining(lenFor(m)); };
  const total = lenFor(mode);
  const frac = total > 0 ? 1 - remaining / total : 0;

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

  // Escape exits the session.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onExit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onExit]);

  return (
    <div
      className={`fold__session${open ? " fold__session--open" : ""}`}
      style={{ ["--accent" as string]: profile.accent }}
      aria-hidden={!open}
    >
      <div className="fold__session-bar">
        <span className="fold__session-brand">The Fold · <b>{roomName}</b></span>
        <button type="button" className="fold__session-exit" onClick={onExit}>Exit session →</button>
      </div>

      <div className="fold__session-body">
        <div className="fold__session-main">
          <span className="fold__session-mode">{profile.mode}</span>
          <p className="fold__session-purpose">{profile.purpose}</p>

          <label className="fold__session-prompt" htmlFor="fold-intention">{profile.intentPrompt}</label>
          <input
            id="fold-intention"
            className="fold__session-intent"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={profile.intentPlaceholder}
            maxLength={120}
          />
          <p className="fold__session-cue">{profile.cue}</p>

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
          </div>
        </div>

        <div className="fold__session-side">
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
        </div>
      </div>

      <div className="fold__session-vibes">
        <span className="fold__session-vibes-lead">Shift the vibe</span>
        {rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`fold__session-vibe${r.id === roomId ? " is-on" : ""}`}
            onClick={() => onPickRoom(r.id)}
          >
            {r.name}
            {r.state && <span className="fold__session-vibe-state">{r.state}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
