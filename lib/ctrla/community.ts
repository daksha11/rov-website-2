// lib/ctrla/community.ts
// ─────────────────────────────────────────────────────────────
// Shared types + labels for the CTRL-A community pipeline.
// The zod schemas that validate payloads live in the API route;
// these are the shapes the UI reads and writes.
// ─────────────────────────────────────────────────────────────

// Track A (toolkit utility) + Track B (magazine features).
export type ToolkitType = "tool" | "idea" | "signal" | "resource" | "history";
export type MagazineType = "art" | "story";
export type SubmissionType = ToolkitType | MagazineType;
export type SubmissionTrack = "toolkit" | "magazine";
export type SubmissionStatus = "pending" | "approved" | "featured" | "rejected";
export type ToolkitSlug = "music" | "web-dev" | "design" | "video";

export const TOOLKITS: { slug: ToolkitSlug; title: string }[] = [
  { slug: "music", title: "Music" },
  { slug: "web-dev", title: "Web Dev" },
  { slug: "design", title: "Design" },
  { slug: "video", title: "Video" },
];

/** Which track a type belongs to (mirrors the DB + form-config seed). */
export const TRACK_FOR: Record<SubmissionType, SubmissionTrack> = {
  tool: "toolkit",
  idea: "toolkit",
  signal: "toolkit",
  resource: "toolkit",
  history: "toolkit",
  art: "magazine",
  story: "magazine",
};

/** One media item stored in the ctrla-submissions bucket. */
export interface MediaItem {
  path: string;
  kind: "image" | "audio" | "video";
  caption?: string;
}

/** A tool used, optionally mapped to a CTRL-A toolkit (story features). */
export interface ToolUsed {
  name: string;
  toolkit?: ToolkitSlug;
}

/** A process section, the ugly steps included (story features). */
export interface ProcessSection {
  heading: string;
  body: string;
}

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
  history: {
    label: "Add a history milestone",
    blurb: "A dated milestone for a toolkit's history section.",
    needsToolkit: true,
  },
  art: {
    label: "Submit art",
    blurb: "Any medium, shown well. Featured in the magazine.",
    needsToolkit: false,
  },
  story: {
    label: "Submit a story",
    blurb: "The full editorial: the how, the process, the ugly steps.",
    needsToolkit: false,
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
  title: string; // tool/resource name, idea title, signal headline, art/story title
  url?: string;
  body?: string; // pitch / note / why you love it
  tags?: string[];
  level?: "Beginner" | "Intermediate" | "Pro";
  kind?: "Release" | "Shift" | "Trend" | "Sunset"; // signals only
  date?: string; // history milestones (ISO date)
  // Magazine features (art / story):
  medium?: string; // art
  statement?: string; // art
  bio?: string; // art + story
  links?: string[]; // art + story
  tools?: ToolUsed[]; // story (name + toolkit mapping)
  process?: ProcessSection[]; // story
}

// ── Admin-editable form configs (ctrla_form_configs) ──────────────────
// The submit pages render from these; the API's zod stays the safety floor.
export type FieldKind =
  | "text"
  | "textarea"
  | "url"
  | "tags"
  | "select"
  | "toolkit"
  | "date"
  | "media"
  | "tools"
  | "sections";

export interface FormFieldConfig {
  key: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  help?: string;
  maxLength?: number;
  options?: string[];
  min?: number;
  max?: number;
}

export interface FormConfig {
  type: SubmissionType;
  track: SubmissionTrack;
  is_open: boolean;
  title: string;
  intro: string | null;
  credit_cost: number;
  fields: FormFieldConfig[];
  sort: number;
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
  track?: SubmissionTrack;
  credit_cost?: number;
  media?: MediaItem[] | null;
  status: SubmissionStatus;
  payload: SubmissionPayload;
  review_note: string | null;
  created_at: string;
}
