"use client";

import React from "react";
import { motion } from "framer-motion";

const workflows = [
    {
        title: "RAG Chatbot",
        category: "Content & Marketing",
        description: "Automatically drafts, schedules, and posts brand-aligned social content across multiple platforms from a single trigger.",
        imageUrl: "/aipage/aiwf1.png",
        downloadUrl: "/aipage/rag_chatbot.json",
        tools: [
            { label: "GPT-4", color: "#10A37F" },
            { label: "Notion", color: "#ffffff" },
            { label: "Buffer", color: "#E0445E" },
        ],
        extraTools: 1,
        // SVG flow diagram nodes
        nodes: [
            { x: 14, label: "Trigger\nSchedule" },
            { x: 30, label: "GPT-4\nDraft" },
            { x: 48, label: "Notion\nApprove" },
            { x: 66, label: "Buffer\nPost" },
            { x: 82, label: "Analytics\nReport" },
        ],
    },
    {
        title: "Lead Qualification & CRM Sync",
        category: "Sales Automation",
        description: "Captures inbound website leads, enriches contact data, sends automated follow-ups, and syncs qualified prospects directly into HubSpot CRM.",
        imageUrl: "/aipage/aiwf2.png",
        downloadUrl: "/aipage/website_inbound_crm.json",
        tools: [
            { label: "OpenAI", color: "#10A37F" },
            { label: "HubSpot", color: "#FF7A59" },
            { label: "Gmail", color: "#EA4335" },
        ],
        extraTools: 2,
        nodes: [
            { x: 14, label: "Form\nSubmit" },
            { x: 30, label: "AI\nScore" },
            { x: 48, label: "Enrich\nData" },
            { x: 66, label: "CRM\nSync" },
            { x: 82, label: "Email\nSend" },
        ],
    },
    {
        title: "Customer Support AI Agent",
        category: "Support & Operations",
        description: "Handles inbound appointment requests automatically. Checks calendar availability in real time, confirms open slots with users, and books meetings instantly while capturing customer details.",
        imageUrl: "/aipage/aiwf3.png",
        downloadUrl: "/aipage/appointment_booking.json",
        tools: [
            { label: "Claude", color: "#D4A27F" },
            { label: "Slack", color: "#4A154B" },
            { label: "Zendesk", color: "#03363D" },
        ],
        extraTools: 0,
        nodes: [
            { x: 14, label: "Ticket\nInbound" },
            { x: 30, label: "Classify\nIntent" },
            { x: 48, label: "AI\nResolve" },
            { x: 66, label: "Escalate\n/ Close" },
            { x: 82, label: "Log\nMetrics" },
        ],
    },
];

function WorkflowDiagram({ nodes }: { nodes: { x: number; label: string }[] }) {
    return (
        <svg
            viewBox="0 0 100 28"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
            {/* Connection lines */}
            {nodes.slice(0, -1).map((node, i) => (
                <line
                    key={`line-${i}`}
                    x1={node.x + 7}
                    y1={14}
                    x2={nodes[i + 1].x - 1}
                    y2={14}
                    stroke="rgba(234,154,97,0.35)"
                    strokeWidth="0.6"
                    strokeDasharray="1.5,1"
                />
            ))}

            {/* Arrow heads */}
            {nodes.slice(0, -1).map((node, i) => (
                <polygon
                    key={`arrow-${i}`}
                    points={`${nodes[i + 1].x - 1},14 ${nodes[i + 1].x - 2.5},12.8 ${nodes[i + 1].x - 2.5},15.2`}
                    fill="rgba(234,154,97,0.5)"
                />
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <g key={`node-${i}`}>
                    {/* Node box */}
                    <rect
                        x={node.x - 7}
                        y={8}
                        width={14}
                        height={12}
                        rx={2}
                        fill="rgba(126,42,12,0.40)"
                        stroke={i === 0 ? "rgba(234,154,97,0.7)" : "rgba(202,53,0,0.35)"}
                        strokeWidth="0.5"
                    />
                    {/* Node text - two lines */}
                    {node.label.split("\n").map((line, lineIdx) => (
                        <text
                            key={lineIdx}
                            x={node.x}
                            y={lineIdx === 0 ? 13 : 17.5}
                            textAnchor="middle"
                            fill={lineIdx === 0 ? "rgba(255,255,255,0.85)" : "rgba(234,154,97,0.7)"}
                            fontSize="2.2"
                            fontFamily="Roboto, sans-serif"
                            fontWeight={lineIdx === 0 ? "600" : "400"}
                        >
                            {line}
                        </text>
                    ))}
                </g>
            ))}
        </svg>
    );
}

export default function AIWorkflowsSection() {
    return (
        <section
            style={{
                position: "relative",
                zIndex: 3,
                padding: "clamp(60px, 10vw, 100px) clamp(16px, 8%, 8%)",
            }}
        >
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
            >
                <h2
                    style={{
                        fontFamily: "Norwige, sans-serif",
                        fontStyle: "italic",
                        fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                        fontWeight: 600,
                        color: "white",
                        marginBottom: "16px",
                        lineHeight: 1.15,
                    }}
                >
                    Sample Automation Workflows
                </h2>
                <p
                    style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
                        color: "rgba(255,255,255,0.5)",
                        maxWidth: "520px",
                        lineHeight: 1.7,
                        margin: 0,
                    }}
                >
                    Explore real-world AI systems we build for our clients — from content engines to fully automated support pipelines.
                </p>
            </motion.div>

            {/* Cards Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                    gap: "20px",
                }}
            >
                {workflows.map((wf, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.12 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 40px rgba(202,53,0,0.12)" }}
                        style={{
                            background: "linear-gradient(160deg, rgba(126,42,12,0.22) 0%, rgba(0,0,0,0.35) 100%)",
                            border: "1px solid rgba(159,45,0,0.30)",
                            borderRadius: "18px",
                            overflow: "hidden",
                            cursor: "default",
                            transition: "all 0.35s ease",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Diagram Area */}
                        <div
                            style={{
                                background: "rgba(0,0,0,0.45)",
                                borderBottom: "1px solid rgba(159,45,0,0.20)",
                                padding: wf.imageUrl ? "0px" : "28px 24px 24px",
                                height: "160px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Subtle grid bg */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage:
                                        "linear-gradient(rgba(159,45,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(159,45,0,0.07) 1px, transparent 1px)",
                                    backgroundSize: "24px 24px",
                                    pointerEvents: "none",
                                }}
                            />
                            {wf.imageUrl ? (
                                <img
                                    src={wf.imageUrl}
                                    alt={wf.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                />
                            ) : (
                                <WorkflowDiagram nodes={wf.nodes} />
                            )}
                        </div>

                        {/* Card Footer */}
                        <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
                            {/* Tool Pills + Category Badge */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* Tool dots */}
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    {wf.tools.map((tool, ti) => (
                                        <div
                                            key={ti}
                                            title={tool.label}
                                            style={{
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "8px",
                                                background: "rgba(126,42,12,0.30)",
                                                border: "1px solid rgba(202,53,0,0.35)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: "Roboto, sans-serif",
                                                    fontSize: "0.55rem",
                                                    fontWeight: 700,
                                                    color: "rgba(255,255,255,0.75)",
                                                    letterSpacing: "0.02em",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {tool.label.slice(0, 3).toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                    {wf.extraTools > 0 && (
                                        <span
                                            style={{
                                                fontFamily: "Roboto, sans-serif",
                                                fontSize: "0.75rem",
                                                color: "rgba(255,255,255,0.4)",
                                                fontWeight: 500,
                                            }}
                                        >
                                            +{wf.extraTools}
                                        </span>
                                    )}
                                </div>

                                {/* Category badge */}
                                <span
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        color: "#E8914A",
                                        background: "rgba(126,42,12,0.25)",
                                        border: "1px solid rgba(202,53,0,0.35)",
                                        borderRadius: "9999px",
                                        padding: "4px 12px",
                                        letterSpacing: "0.03em",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {wf.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3
                                style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.92)",
                                    margin: 0,
                                    lineHeight: 1.35,
                                }}
                            >
                                {wf.title}
                            </h3>

                            {/* Description */}
                            <p
                                style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "0.82rem",
                                    color: "rgba(255,255,255,0.45)",
                                    margin: 0,
                                    lineHeight: 1.65,
                                    flex: 1,
                                }}
                            >
                                {wf.description}
                            </p>

                            {/* Download Button */}
                            {wf.downloadUrl && (
                                <a
                                    href={wf.downloadUrl}
                                    download
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                        color: "white",
                                        textDecoration: "none",
                                        fontWeight: 700,
                                        fontFamily: "Roboto, sans-serif",
                                        fontSize: "0.82rem",
                                        padding: "12px 24px",
                                        borderRadius: "9999px",
                                        marginTop: "4px",
                                        boxShadow: "0 4px 24px rgba(160, 90, 40, 0.45)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "scale(1.02)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Download Workflow
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
