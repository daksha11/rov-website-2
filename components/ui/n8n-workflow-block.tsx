"use client";

import { motion, useMotionValue } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Database,
  Mail,
  Plus,
  Settings,
  Webhook,
  Zap,
} from "lucide-react";

// Interfaces
interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
  brief: string;
}

interface WorkflowConnection {
  from: string;
  to: string;
}

// Constants
const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const MAX_NODES = 4;
const BODY = "'Roboto', sans-serif";

const nodeTemplates: Omit<WorkflowNode, "id" | "position">[] = [
  {
    type: "trigger",
    title: "Form Submitted",
    description: "New lead fills out contact form",
    icon: Webhook,
    color: "warm",
    brief: "Starts the workflow when someone submits your website form.",
  },
  {
    type: "action",
    title: "Save to CRM",
    description: "Store lead in your database",
    icon: Database,
    color: "copper",
    brief: "Auto-saves the lead to your CRM. No manual data entry.",
  },
  {
    type: "condition",
    title: "Check Budget",
    description: "Is budget over $1,000?",
    icon: Settings,
    color: "sand",
    brief: "Routes the lead based on budget. High-value leads get priority.",
  },
  {
    type: "action",
    title: "Send Email",
    description: "Auto-reply to the lead",
    icon: Mail,
    color: "rust",
    brief: "Sends a personalized reply with your Calendly link instantly.",
  },
  {
    type: "action",
    title: "Notify Team",
    description: "Alert on Slack or Discord",
    icon: Zap,
    color: "bronze",
    brief: "Pings your team in Slack or Discord when a lead comes in.",
  },
];

const initialNodes: WorkflowNode[] = [
  {
    id: "node-1",
    ...nodeTemplates[0],
    position: { x: 50, y: 100 },
  },
  {
    id: "node-2",
    ...nodeTemplates[1],
    position: { x: 300, y: 100 },
  },
  {
    id: "node-3",
    ...nodeTemplates[2],
    position: { x: 550, y: 100 },
  },
];

const initialConnections: WorkflowConnection[] = [
  { from: "node-1", to: "node-2" },
  { from: "node-2", to: "node-3" },
];

const colorClasses: Record<string, string> = {
  warm: "border-[#EA9A61]/40 bg-[#EA9A61]/10 text-[#EA9A61]",
  copper: "border-[#B16937]/40 bg-[#B16937]/10 text-[#C4956A]",
  sand: "border-[#C4956A]/40 bg-[#C4956A]/10 text-[#C4956A]",
  rust: "border-[#A64D2B]/40 bg-[#A64D2B]/10 text-[#EA9A61]",
  bronze: "border-[#8B7355]/40 bg-[#8B7355]/10 text-[#C4956A]",
};

// Memoized Connection Line
const WorkflowConnectionLine = React.memo(function WorkflowConnectionLine({
  fromPos,
  toPos,
}: {
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}) {
  const startX = fromPos.x + NODE_WIDTH;
  const startY = fromPos.y + NODE_HEIGHT / 2;
  const endX = toPos.x;
  const endY = toPos.y + NODE_HEIGHT / 2;
  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;

  return (
    <path
      d={`M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`}
      fill="none"
      stroke="#EA9A61"
      strokeWidth={2}
      strokeDasharray="8,6"
      strokeLinecap="round"
      opacity={0.3}
    />
  );
});

// Memoized Node Card — uses motion values for zero-rerender dragging
const WorkflowNodeCard = React.memo(function WorkflowNodeCard({
  node,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragCommit,
  onDelete,
}: {
  node: WorkflowNode;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (x: number, y: number) => void;
  onDragCommit: (x: number, y: number) => void;
  onDelete: () => void;
}) {
  const Icon = node.icon;
  const [showBrief, setShowBrief] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Motion values for GPU-accelerated drag — no React re-renders during drag
  const motionX = useMotionValue(node.position.x);
  const motionY = useMotionValue(node.position.y);

  // Sync position from parent state (when another action moves this node)
  useEffect(() => {
    if (!isDragging) {
      motionX.set(node.position.x);
      motionY.set(node.position.y);
    }
  }, [node.position.x, node.position.y, isDragging, motionX, motionY]);

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => setShowBrief(true), 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowBrief(false);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: 100000, bottom: 100000 }}
      dragElastic={0}
      onDragStart={() => { handleMouseLeave(); onDragStart(); }}
      onDrag={() => {
        // Throttled commit for connection lines — only updates parent every ~50ms
        onDragCommit(motionX.get(), motionY.get());
      }}
      onDragEnd={() => {
        onDragEnd(motionX.get(), motionY.get());
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: motionX,
        y: motionY,
        width: NODE_WIDTH,
        transformOrigin: "0 0",
        willChange: isDragging ? "transform" : "auto",
      }}
      className="absolute cursor-grab"
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
    >
      {/* Tooltip */}
      {showBrief && !isDragging && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-48 rounded-lg border border-[#EA9A61]/20 bg-[#151110] px-3 py-2 pointer-events-none z-[60]"
          style={{ fontFamily: BODY, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
        >
          <p className="text-[clamp(0.7rem,1.5vw,0.75rem)] leading-[1.5] text-white/80">{node.brief}</p>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#151110]" />
        </div>
      )}

      <Card
        className={`group/node relative w-full overflow-hidden rounded-xl border ${colorClasses[node.color]} bg-black/70 p-3 transition-shadow duration-200 hover:shadow-lg hover:shadow-[#EA9A61]/5 ${isDragging ? "shadow-xl ring-2 ring-[#EA9A61]/30" : ""}`}
      >
        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity duration-150 hover:bg-red-500/20 hover:border-red-400/30 z-10 cursor-pointer"
          aria-label={`Delete ${node.title}`}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-white/40 hover:text-red-400">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="relative space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-black/60`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge
                variant="outline"
                className="mb-0.5 rounded-full border-white/10 bg-white/[0.04] px-1.5 py-0 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.15em] text-white/40"
              >
                {node.type}
              </Badge>
              <h3 className="truncate text-xs font-semibold tracking-tight text-white/90" style={{ fontFamily: BODY }}>
                {node.title}
              </h3>
            </div>
          </div>
          <p className="line-clamp-2 text-[clamp(0.7rem,1.5vw,0.75rem)] leading-relaxed text-white/50" style={{ fontFamily: BODY }}>
            {node.description}
          </p>
          <div className="flex items-center gap-1.5 text-[clamp(0.7rem,1.5vw,0.75rem)] text-white/30">
            <ArrowRight className="h-2.5 w-2.5" />
            <span className="uppercase tracking-[0.1em]">Connected</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

// Memoized SVG connections layer
const ConnectionsLayer = React.memo(function ConnectionsLayer({
  connections,
  nodes,
  width,
  height,
}: {
  connections: WorkflowConnection[];
  nodes: WorkflowNode[];
  width: number;
  height: number;
}) {
  const posMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of nodes) map.set(n.id, n.position);
    return map;
  }, [nodes]);

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      {connections.map((c) => {
        const fromPos = posMap.get(c.from);
        const toPos = posMap.get(c.to);
        if (!fromPos || !toPos) return null;
        return (
          <WorkflowConnectionLine
            key={`${c.from}-${c.to}`}
            fromPos={fromPos}
            toPos={toPos}
          />
        );
      })}
    </svg>
  );
});

// Main Component
export function N8nWorkflowBlock() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => ({
    width: Math.max(...initialNodes.map((n) => n.position.x + NODE_WIDTH)) + 50,
    height: Math.max(...initialNodes.map((n) => n.position.y + NODE_HEIGHT)) + 50,
  }));

  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDragStart = useCallback((nodeId: string) => {
    setDraggingNodeId(nodeId);
  }, []);

  // Throttled position commit — updates React state for connection lines at ~20fps instead of 60fps
  const handleDragCommit = useCallback((nodeId: string, x: number, y: number) => {
    if (throttleRef.current) return; // skip if a commit is pending
    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, position: { x, y } } : n))
      );
      setContentSize((prev) => {
        const nw = x + NODE_WIDTH + 50;
        const nh = y + NODE_HEIGHT + 50;
        return nw <= prev.width && nh <= prev.height
          ? prev
          : { width: Math.max(prev.width, nw), height: Math.max(prev.height, nh) };
      });
    }, 50);
  }, []);

  // Final position commit on drag end — ensures state is accurate
  const handleDragEnd = useCallback((nodeId: string, x: number, y: number) => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }
    setDraggingNodeId(null);
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, position: { x, y } } : n))
    );
  }, []);

  const nodeCallbacksRef = useRef(
    new Map<string, {
      onDragStart: () => void;
      onDragEnd: (x: number, y: number) => void;
      onDragCommit: (x: number, y: number) => void;
      onDelete: () => void;
    }>()
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
    nodeCallbacksRef.current.delete(nodeId);
  }, []);

  const addNode = useCallback(() => {
    setNodes((prev) => {
      if (prev.length >= MAX_NODES) return prev;
      const template = nodeTemplates[Math.floor(Math.random() * nodeTemplates.length)];
      const lastNode = prev[prev.length - 1];
      const pos = lastNode
        ? { x: lastNode.position.x + 250, y: lastNode.position.y }
        : { x: 50, y: 100 };
      const newNode: WorkflowNode = { id: `node-${Date.now()}`, ...template, position: pos };

      if (lastNode) {
        setConnections((pc) => [...pc, { from: lastNode.id, to: newNode.id }]);
      }
      setContentSize((ps) => ({
        width: Math.max(ps.width, pos.x + NODE_WIDTH + 50),
        height: Math.max(ps.height, pos.y + NODE_HEIGHT + 50),
      }));

      const canvas = canvasRef.current;
      if (canvas) {
        requestAnimationFrame(() => {
          canvas.scrollTo({ left: pos.x + NODE_WIDTH - canvas.clientWidth + 100, behavior: "smooth" });
        });
      }
      return [...prev, newNode];
    });
  }, []);

  const isAtMax = nodes.length >= MAX_NODES;

  const getNodeCallbacks = useCallback(
    (nodeId: string) => {
      let cached = nodeCallbacksRef.current.get(nodeId);
      if (!cached) {
        cached = {
          onDragStart: () => handleDragStart(nodeId),
          onDragEnd: (x: number, y: number) => handleDragEnd(nodeId, x, y),
          onDragCommit: (x: number, y: number) => handleDragCommit(nodeId, x, y),
          onDelete: () => deleteNode(nodeId),
        };
        nodeCallbacksRef.current.set(nodeId, cached);
      }
      return cached;
    },
    [handleDragStart, handleDragCommit, handleDragEnd, deleteNode]
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#EA9A61]/15 bg-black/60 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-[#EA9A61]/40 bg-[#EA9A61]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#EA9A61]"
          >
            Active
          </Badge>
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/40" style={{ fontFamily: BODY }}>
            Workflow Builder
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addNode}
          disabled={isAtMax}
          className="h-8 gap-2 rounded-lg text-xs uppercase tracking-[0.2em] text-white/50 border-white/10 bg-white/[0.03] hover:text-[#EA9A61] hover:border-[#EA9A61]/30 hover:bg-[#EA9A61]/5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isAtMax ? "Max Reached" : "Add Node"}</span>
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative h-[300px] w-full overflow-auto rounded-xl border border-white/[0.06] bg-[#0a0806] sm:h-[350px] md:h-[400px]"
      >
        <div className="relative" style={{ minWidth: contentSize.width, minHeight: contentSize.height }}>
          <ConnectionsLayer connections={connections} nodes={nodes} width={contentSize.width} height={contentSize.height} />
          {nodes.map((node) => {
            const cb = getNodeCallbacks(node.id);
            return (
              <WorkflowNodeCard
                key={node.id}
                node={node}
                isDragging={draggingNodeId === node.id}
                onDragStart={cb.onDragStart}
                onDragEnd={cb.onDragEnd}
                onDragCommit={cb.onDragCommit}
                onDelete={cb.onDelete}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40" style={{ fontFamily: BODY }}>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#EA9A61]" />
            <span className="uppercase tracking-[0.15em]">{nodes.length} {nodes.length === 1 ? "Node" : "Nodes"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#B16937]" />
            <span className="uppercase tracking-[0.15em]">{connections.length} {connections.length === 1 ? "Connection" : "Connections"}</span>
          </div>
        </div>
        <p className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/25" style={{ fontFamily: BODY }}>
          Hover to learn · Drag to move
        </p>
      </div>
    </div>
  );
}
