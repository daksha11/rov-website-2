"use client";

import { useState } from "react";
import type { FlowMode, FlowNode } from "../_content/types";

const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const LINE = "rgba(59,33,20,0.14)";
const CREAM_PANEL = "#fffdf8";

function edgeAnchor(n: FlowNode, side: "top" | "bottom" | "left" | "right"): [number, number] {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  if (side === "top") return [cx, n.y];
  if (side === "bottom") return [cx, n.y + n.h];
  if (side === "left") return [n.x, cy];
  return [n.x + n.w, cy];
}

export function EcosystemDiagram({ modes }: { modes: FlowMode[] }) {
  const [activeKey, setActiveKey] = useState(modes[0]?.key);
  const active = modes.find((m) => m.key === activeKey) ?? modes[0];
  if (!active) return null;

  const nodesById = new Map(active.nodes.map((n) => [n.id, n]));

  return (
    <div
      style={{
        background: CREAM_PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
        marginBottom: 22,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {modes.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setActiveKey(m.key)}
            style={{
              background: activeKey === m.key ? RUST : "#fff",
              color: activeKey === m.key ? "#FFF4E3" : "rgba(59,33,20,0.65)",
              border: `1px solid ${activeKey === m.key ? RUST : LINE}`,
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={active.viewBox.join(" ")}
          preserveAspectRatio="xMidYMin meet"
          style={{ display: "block", minWidth: 720, width: "100%", height: "auto" }}
          role="img"
          aria-label={`${active.label} diagram`}
        >
          <defs>
            <marker id="ah-in" markerWidth={9} markerHeight={9} refX={7} refY={3} orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill={RUST} />
            </marker>
            <marker id="ah-pay" markerWidth={9} markerHeight={9} refX={7} refY={3} orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="#A6402C" />
            </marker>
          </defs>

          {active.links.map((link, i) => {
            const a = nodesById.get(link.from);
            const b = nodesById.get(link.to);
            if (!a || !b) return null;
            const pay = link.kind === "pay";
            const color = pay ? "#A6402C" : RUST;
            const ac: [number, number] = [a.x + a.w / 2, a.y + a.h / 2];
            const bc: [number, number] = [b.x + b.w / 2, b.y + b.h / 2];
            const dy = bc[1] - ac[1];
            const dx = bc[0] - ac[0];
            const vertical = Math.abs(dy) >= Math.abs(dx);
            let p1: [number, number];
            let p2: [number, number];
            if (vertical) {
              if (dy > 0) {
                p1 = edgeAnchor(a, "bottom");
                p2 = edgeAnchor(b, "top");
              } else {
                p1 = edgeAnchor(a, "top");
                p2 = edgeAnchor(b, "bottom");
              }
            } else {
              if (dx > 0) {
                p1 = edgeAnchor(a, "right");
                p2 = edgeAnchor(b, "left");
              } else {
                p1 = edgeAnchor(a, "left");
                p2 = edgeAnchor(b, "right");
              }
            }
            const mx = (p1[0] + p2[0]) / 2;
            const my = (p1[1] + p2[1]) / 2;
            const path = vertical
              ? `M${p1[0]},${p1[1]} C${p1[0]},${my} ${p2[0]},${my} ${p2[0]},${p2[1]}`
              : `M${p1[0]},${p1[1]} C${mx},${p1[1]} ${mx},${p2[1]} ${p2[0]},${p2[1]}`;
            const labelWidth = link.label ? link.label.length * 6.4 + 12 : 0;

            return (
              <g key={`${link.from}-${link.to}-${i}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={pay ? "5,4" : undefined}
                  markerEnd={`url(#${pay ? "ah-pay" : "ah-in"})`}
                />
                {link.label && (
                  <>
                    <rect
                      x={mx - labelWidth / 2}
                      y={my - 9}
                      width={labelWidth}
                      height={17}
                      rx={4}
                      fill={CREAM_PANEL}
                      opacity={0.94}
                    />
                    <text
                      x={mx}
                      y={my + 3.5}
                      textAnchor="middle"
                      fill={color}
                      style={{ font: "700 11px -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      {link.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {active.nodes.map((n) => {
            const fill = n.variant === "hub" ? "#F3E6DD" : n.variant === "warn" ? "#F4E1DB" : "#fffdf8";
            const stroke = n.variant === "hub" ? RUST : n.variant === "warn" ? "#A6402C" : LINE;
            const strokeWidth = n.variant === "hub" ? 2 : 1.5;
            return (
              <g key={n.id}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={11} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                <text
                  x={n.x + n.w / 2}
                  y={n.y + 22}
                  textAnchor="middle"
                  style={{ font: "600 13px Norwige, Georgia, serif", fill: ESPRESSO }}
                >
                  {n.title}
                </text>
                {n.sub && (
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + 39}
                    textAnchor="middle"
                    style={{ font: "400 10.5px Inter, -apple-system, sans-serif", fill: "rgba(59,33,20,0.6)" }}
                  >
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 12.5, color: "rgba(59,33,20,0.65)", marginTop: 12 }}>
        {active.legend.map((item) => (
          <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 22, borderTop: `3px solid ${item.color}` }} />
            {item.label}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: "rgba(59,33,20,0.65)", marginTop: 8, fontStyle: "italic" }}>{active.note}</p>
    </div>
  );
}
