import type { Metadata } from "next";
import ClaudeCourseContent from "./ClaudeCourseContent";

export const metadata: Metadata = {
  title: "The Claude Code Course: Models, Skills, Systems, Token Craft | CTRL-A",
  description:
    "A living, visual course on building with Claude Code, from CTRL-A by Range of View Studios. The real moves from our sessions: which model to reach for and why, skill files, slash commands, subagents and workflows, MCP tools, and the token craft that separates a tool from a money pit. Interactive, honest, updated as the tools shift.",
  keywords: [
    "Claude Code course",
    "Claude Code tutorial",
    "AI coding models",
    "Opus Sonnet Haiku",
    "skill files",
    "slash commands",
    "subagents",
    "workflows",
    "MCP tools",
    "token optimization",
    "compact context",
    "CTRL-A",
    "Range of View Studios",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/claude-code" },
  openGraph: {
    title: "The Claude Code Course: Models, Skills, Systems, Token Craft | CTRL-A",
    description:
      "The real moves from our sessions: which model to reach for, skills, systems, and the token craft that separates a tool from a money pit. Interactive and living.",
    url: "https://www.rovstudios.com/ctrla/claude-code",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Claude Code Course | CTRL-A",
    description:
      "A living, visual, interactive course on building with Claude Code. Models, skills, systems, and token craft.",
  },
};

export default function ClaudeCodeCoursePage() {
  return <ClaudeCourseContent />;
}
