"use client";

// ═══════════════════════════════════════════════════════
// DEVELOPMENT — motifs, hero, and playables
// A typing-terminal hero, a live "edit me" HTML/CSS editor, and an
// interactive git branch graph (a nod to the moment Linus wrote Git).
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

// ── Motifs (drawn inside the shared 240x180 viewBox) ────
export function renderDevMotif(kind: string, accent: string): ReactNode | null {
  const s = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const faint = { ...s, opacity: 0.4 };
  const dot = { fill: accent, stroke: "none" };
  switch (kind) {
    case "dev-nodes":
      return (
        <>
          <line {...faint} x1={60} y1={54} x2={120} y2={120} />
          <line {...faint} x1={120} y1={120} x2={186} y2={60} />
          <line {...faint} x1={60} y1={54} x2={186} y2={60} />
          <line {...faint} x1={120} y1={120} x2={110} y2={40} />
          <circle {...s} cx={60} cy={54} r={13} />
          <circle {...s} cx={186} cy={60} r={13} />
          <circle {...s} cx={120} cy={120} r={13} />
          <circle {...dot} cx={110} cy={40} r={7} />
        </>
      );
    case "dev-browser":
      return (
        <>
          <rect {...s} x={30} y={34} width={180} height={116} rx={8} />
          <line {...s} x1={30} y1={62} x2={210} y2={62} />
          <circle {...dot} cx={44} cy={48} r={4} />
          <circle {...dot} cx={58} cy={48} r={4} />
          <circle {...dot} cx={72} cy={48} r={4} />
          <rect {...faint} x={92} y={42} width={104} height={12} rx={6} />
          <line {...faint} x1={48} y1={88} x2={140} y2={88} />
          <line {...faint} x1={48} y1={108} x2={168} y2={108} />
          <line {...faint} x1={48} y1={128} x2={120} y2={128} />
        </>
      );
    case "dev-penguin":
      return (
        <>
          <path {...s} d="M120 34 C 92 34, 80 62, 80 96 C 80 130, 96 150, 120 150 C 144 150, 160 130, 160 96 C 160 62, 148 34, 120 34 Z" />
          <path {...faint} d="M120 58 C 106 58, 100 78, 100 100 C 100 124, 110 140, 120 140 C 130 140, 140 124, 140 100 C 140 78, 134 58, 120 58 Z" />
          <circle {...dot} cx={110} cy={64} r={4} />
          <circle {...dot} cx={130} cy={64} r={4} />
          <path {...s} d="M112 74 L120 84 L128 74" />
          <path {...s} d="M104 150 l -12 12 M136 150 l 12 12" />
        </>
      );
    case "dev-braces":
      return (
        <>
          <path {...s} d="M92 40 C 74 40, 84 84, 66 90 C 84 96, 74 140, 92 140" />
          <path {...s} d="M148 40 C 166 40, 156 84, 174 90 C 156 96, 166 140, 148 140" />
          <line {...faint} x1={106} y1={74} x2={134} y2={74} />
          <line {...faint} x1={106} y1={90} x2={134} y2={90} />
          <line {...faint} x1={106} y1={106} x2={124} y2={106} />
        </>
      );
    case "dev-ajax":
      return (
        <>
          <path {...s} d="M150 90 A 40 40 0 1 1 128 54" />
          <path {...s} d="M128 40 l 6 16 l -18 4" />
          <rect {...faint} x={96} y={78} width={48} height={24} rx={4} />
        </>
      );
    case "dev-branch":
      return (
        <>
          <line {...s} x1={84} y1={40} x2={84} y2={150} />
          <path {...s} d="M84 74 C 84 100, 156 92, 156 118" />
          <path {...faint} d="M156 118 C 156 138, 108 134, 84 128" />
          <circle {...dot} cx={84} cy={52} r={9} />
          <circle {...dot} cx={84} cy={128} r={9} />
          <circle {...s} cx={156} cy={118} r={9} />
        </>
      );
    case "dev-tree":
      return (
        <>
          <rect {...s} x={96} y={30} width={48} height={26} rx={4} />
          <line {...faint} x1={120} y1={56} x2={120} y2={72} />
          <line {...faint} x1={60} y1={72} x2={180} y2={72} />
          <line {...faint} x1={60} y1={72} x2={60} y2={88} />
          <line {...faint} x1={120} y1={72} x2={120} y2={88} />
          <line {...faint} x1={180} y1={72} x2={180} y2={88} />
          <rect {...s} x={36} y={88} width={48} height={26} rx={4} />
          <rect {...s} x={96} y={88} width={48} height={26} rx={4} />
          <rect {...s} x={156} y={88} width={48} height={26} rx={4} />
          <line {...faint} x1={60} y1={114} x2={60} y2={130} />
          <rect {...faint} x={36} y={130} width={48} height={22} rx={4} />
        </>
      );
    case "dev-cloud":
      return (
        <>
          <path {...s} d="M74 118 C 54 118, 50 92, 72 88 C 72 66, 108 60, 116 82 C 140 74, 158 96, 146 112 C 160 112, 164 118, 158 118 Z" />
          <path {...dot} d="M118 118 l 14 0 l -20 30 l 6 -20 l -12 0 Z" />
        </>
      );
    case "dev-caret":
      return (
        <>
          <path {...s} d="M70 66 L100 90 L70 114" />
          <line {...s} x1={112} y1={118} x2={168} y2={118} />
          <rect {...dot} x={150} y={70} width={16} height={30} rx={2} />
        </>
      );
    default:
      return null;
  }
}

// ── DevHero — a terminal that types the story ───────────
const HERO_LINES = [
  "$ linus --just-a-hobby",
  "> booting a free operating system...",
  "> it now runs most of the internet.",
  "$ git init",
  "> fourteen years later, same guy.",
  "> the barrier just dropped again.",
];
export function DevHero({ accent }: { accent: string }) {
  const [text, setText] = useState("");
  const state = useRef({ line: 0, char: 0, hold: 0, deleting: false });
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setText(HERO_LINES.slice(0, 3).join("\n"));
      return;
    }
    const id = setInterval(() => {
      const st = state.current;
      const shown = HERO_LINES.slice(Math.max(0, st.line - 2), st.line);
      const cur = HERO_LINES[st.line] ?? "";
      if (st.hold > 0) {
        st.hold -= 1;
      } else if (st.char < cur.length) {
        st.char += 1;
      } else {
        st.hold = 14;
        st.line = (st.line + 1) % HERO_LINES.length;
        st.char = 0;
        if (st.line === 0) {
          setText("");
          return;
        }
      }
      setText([...shown, cur.slice(0, st.char)].join("\n"));
    }, 55);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="ctrla-dev-hero" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <pre className="ctrla-dev-hero-pre">
        {text}
        <span className="ctrla-dev-caret" />
      </pre>
    </div>
  );
}

// ── CodeEditor — a live, sandboxed "edit me" box ────────
const DEFAULT_CODE = `<style>
  body { font-family: sans-serif; display:grid;
    place-items:center; height:100vh; margin:0;
    background:#160C28; color:#F0E6E0; }
  h1 { font-size: 34px; letter-spacing:-1px; }
  span { color: #E3C24A; }
</style>

<h1>hello, <span>world</span></h1>`;
export function CodeEditor({ accent }: { accent: string }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  return (
    <div className="ctrla-code" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-code-pane">
        <div className="ctrla-code-bar">
          <span className="ctrla-code-tag">index.html</span>
          <button type="button" className="ctrla-code-reset" onClick={() => setCode(DEFAULT_CODE)}>
            Reset
          </button>
        </div>
        <textarea
          className="ctrla-code-ta"
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Edit the HTML and CSS"
        />
      </div>
      <div className="ctrla-code-pane">
        <div className="ctrla-code-bar">
          <span className="ctrla-code-tag">preview</span>
          <span className="ctrla-play-hint" style={{ color: accent }}>Live</span>
        </div>
        <iframe className="ctrla-code-frame" title="Live preview" sandbox="" srcDoc={code} />
      </div>
    </div>
  );
}

// ── BranchGraph — build a git history by hand ───────────
type GNode = { id: number; lane: number; seq: number; parents: number[] };
export function BranchGraph({ accent }: { accent: string }) {
  const [nodes, setNodes] = useState<GNode[]>([
    { id: 0, lane: 0, seq: 0, parents: [] },
    { id: 1, lane: 0, seq: 1, parents: [0] },
  ]);
  const [tips, setTips] = useState<Record<number, number>>({ 0: 1 });
  const [active, setActive] = useState(0);
  const [lanes, setLanes] = useState(1);
  const nextId = useRef(2);
  const nextSeq = useRef(2);

  function commit() {
    const id = nextId.current++;
    const seq = nextSeq.current++;
    setNodes((n) => [...n, { id, lane: active, seq, parents: [tips[active]] }]);
    setTips((t) => ({ ...t, [active]: id }));
  }
  function branch() {
    const lane = lanes;
    const id = nextId.current++;
    const seq = nextSeq.current++;
    setNodes((n) => [...n, { id, lane, seq, parents: [tips[active]] }]);
    setTips((t) => ({ ...t, [lane]: id }));
    setLanes((l) => l + 1);
    setActive(lane);
  }
  function merge() {
    if (active === 0) return;
    const id = nextId.current++;
    const seq = nextSeq.current++;
    const from = active;
    setNodes((n) => [...n, { id, lane: 0, seq, parents: [tips[0], tips[from]] }]);
    setTips((t) => ({ ...t, 0: id }));
    setActive(0);
  }
  function reset() {
    nextId.current = 2;
    nextSeq.current = 2;
    setNodes([
      { id: 0, lane: 0, seq: 0, parents: [] },
      { id: 1, lane: 0, seq: 1, parents: [0] },
    ]);
    setTips({ 0: 1 });
    setActive(0);
    setLanes(1);
  }

  const GAP_X = 62;
  const GAP_Y = 52;
  const PAD = 34;
  const maxSeq = Math.max(...nodes.map((n) => n.seq));
  const width = PAD * 2 + maxSeq * GAP_X;
  const height = PAD * 2 + (lanes - 1) * GAP_Y;
  const pos = (n: { seq: number; lane: number }) => ({ x: PAD + n.seq * GAP_X, y: PAD + n.lane * GAP_Y });
  const byId = (id: number) => nodes.find((n) => n.id === id)!;

  return (
    <div className="ctrla-git" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-git-head">
        <button type="button" className="ctrla-808-btn" onClick={commit}>+ Commit</button>
        <button type="button" className="ctrla-808-btn ctrla-808-btn-ghost" onClick={branch}>Branch</button>
        <button type="button" className="ctrla-808-btn ctrla-808-btn-ghost" onClick={merge} disabled={active === 0}>Merge to main</button>
        <button type="button" className="ctrla-808-btn ctrla-808-btn-ghost" onClick={reset}>Reset</button>
        <span className="ctrla-play-hint" style={{ color: accent }}>On {active === 0 ? "main" : `branch ${active}`}</span>
      </div>
      <div className="ctrla-git-scroll">
        <svg width={Math.max(width, 300)} height={Math.max(height, 60)} style={{ display: "block" }}>
          {nodes.map((n) =>
            n.parents.map((pid) => {
              const a = pos(byId(pid));
              const b = pos(n);
              const d =
                a.y === b.y
                  ? `M${a.x} ${a.y} L${b.x} ${b.y}`
                  : `M${a.x} ${a.y} C ${a.x + GAP_X * 0.5} ${a.y}, ${b.x - GAP_X * 0.5} ${b.y}, ${b.x} ${b.y}`;
              return <path key={`${pid}-${n.id}`} d={d} fill="none" stroke={accent} strokeWidth={2.5} opacity={0.55} />;
            })
          )}
          {nodes.map((n) => {
            const p = pos(n);
            const isTip = tips[n.lane] === n.id;
            return (
              <circle
                key={n.id}
                cx={p.x}
                cy={p.y}
                r={isTip ? 9 : 7}
                fill={n.lane === 0 ? accent : "#F0E6E0"}
                stroke={accent}
                strokeWidth={2.5}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
