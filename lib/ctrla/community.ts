// lib/ctrla/community.ts
// ─────────────────────────────────────────────────────────────
// Shared types + labels for the CTRL-A community pipeline.
// The zod schemas that validate payloads live in the API route;
// these are the shapes the UI reads and writes.
// ─────────────────────────────────────────────────────────────

export type SubmissionType = "tool" | "idea" | "signal" | "resource";
export type SubmissionStatus = "pending" | "approved" | "featured" | "rejected";
export type ToolkitSlug = "music" | "web-dev" | "design" | "video";

export const TOOLKITS: { slug: ToolkitSlug; title: string }[] = [
  { slug: "music", title: "Music" },
  { slug: "web-dev", title: "Web Dev" },
  { slug: "design", title: "Design" },
  { slug: "video", title: "Video" },
];

export const TYPE_META: Record<
  SubmissionType,
  { label: string; blurb: string; needsToolkit: boolean }
> = {
  tool: {
    label: "Suggest a tool",
    blurb: "A tool you actually use that belongs in a toolkit.",
    needsToolkit: true,
  },
  idea: {
    label: "Pitch an idea",
    blurb: "A feature, section, or direction CTRL-A should explore.",
    needsToolkit: false,
  },
  signal: {
    label: "Report a signal",
    blurb: "An industry shift the Signals feed should know about.",
    needsToolkit: true,
  },
  resource: {
    label: "Share a resource",
    blurb: "A guide, video, or read that leveled you up.",
    needsToolkit: true,
  },
};

export const STATUS_META: Record<SubmissionStatus, { label: string; tone: "wait" | "good" | "great" | "bad" }> = {
  pending: { label: "In review", tone: "wait" },
  approved: { label: "On the wall", tone: "good" },
  featured: { label: "Featured", tone: "great" },
  rejected: { label: "Not this time", tone: "bad" },
};

/** payload shapes per type (validated server-side) */
export interface SubmissionPayload {
  title: string; // tool/resource name, idea title, signal headline
  url?: string;
  body?: string; // pitch / note / why you love it
  tags?: string[];
  level?: "Beginner" | "Intermediate" | "Pro";
  kind?: "Release" | "Shift" | "Trend" | "Sunset"; // signals only
}

export interface WallRow {
  id: string;
  toolkit_slug: ToolkitSlug | null;
  type: SubmissionType;
  status: SubmissionStatus;
  payload: SubmissionPayload;
  created_at: string;
  author_handle: string | null;
  author_name: string | null;
  author_avatar: string | null;
  author_is_public: boolean;
  votes: number;
}

export interface MySubmissionRow {
  id: string;
  toolkit_slug: ToolkitSlug | null;
  type: SubmissionType;
  status: SubmissionStatus;
  payload: SubmissionPayload;
  review_note: string | null;
  created_at: string;
}
