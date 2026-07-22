"use client";

/**
 * MediaUploader · uploads submission media to the ctrla-submissions bucket
 * under submissions/<uid>/<uuid>.<ext> (storage RLS enforces the prefix),
 * and hands back an ordered list of { path, kind }. The first item is the
 * hero. Track B only. Best-effort per file; a failed upload is surfaced, not
 * swallowed, so the submitter can retry before sending.
 */

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { MediaItem } from "@/lib/ctrla/community";
import { C, NEUE } from "./theme";

const supabase = createClient();
const BUCKET = "ctrla-submissions";

// Per-kind size caps (bytes). The bucket enforces an 80MB hard floor and the
// allowed mime types server-side; these give the submitter a clear message
// before a wasted upload. Tune here.
const MB = 1024 * 1024;
const LIMITS: Record<MediaItem["kind"], number> = {
  image: 8 * MB,
  audio: 25 * MB,
  video: 80 * MB,
};

function kindOf(file: File): MediaItem["kind"] {
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

// Reject anything that is not an image/audio/video, or that exceeds its cap.
// Returns an error string, or null when the file is fine.
function rejectReason(file: File): string | null {
  const t = file.type;
  if (!t.startsWith("image/") && !t.startsWith("audio/") && !t.startsWith("video/")) {
    return `${file.name} is not an image, audio, or video file.`;
  }
  const kind = kindOf(file);
  if (file.size > LIMITS[kind]) {
    return `${file.name} is too large. Max ${Math.round(LIMITS[kind] / MB)}MB for ${kind}.`;
  }
  return null;
}

// A dependency-free unique-ish id (crypto when available).
function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  }
}

export default function MediaUploader({
  userId,
  value,
  onChange,
  max = 8,
}: {
  userId: string;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || busy) return;
    setError(null);
    setBusy(true);
    const next: MediaItem[] = [...value];
    try {
      for (const file of Array.from(files)) {
        if (next.length >= max) break;
        const reason = rejectReason(file);
        if (reason) {
          setError(reason);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const path = `submissions/${userId}/${uid()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) {
          setError(`Could not upload ${file.name}. ${upErr.message}`);
          continue;
        }
        next.push({ path, kind: kindOf(file) });
      }
      onChange(next);
    } finally {
      setBusy(false);
    }
  }

  function removeAt(i: number) {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
  }

  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          border: `1px dashed ${C.hair}`,
          borderRadius: 12,
          padding: "22px 16px",
          cursor: busy ? "default" : "pointer",
          color: C.soft,
          fontFamily: NEUE,
          fontSize: 14,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {busy ? "Uploading…" : `Add media (${value.length}/${max})`}
        <input
          type="file"
          accept="image/*,audio/*,video/*"
          multiple
          hidden
          disabled={busy || value.length >= max}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      <p style={{ margin: "8px 0 0", fontSize: 11.5, color: C.faint, fontFamily: NEUE }}>
        Images up to 8MB, audio up to 25MB, video up to 80MB. Up to {max} items, first is the cover.
      </p>

      {error && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: C.rose }}>{error}</p>}

      {value.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {value.map((m, i) => (
            <div key={m.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: `1px solid ${C.hair}`, borderRadius: 10, padding: "10px 12px" }}>
              <span style={{ fontSize: 13, color: C.soft }}>
                {i === 0 && <strong style={{ color: C.gold }}>Hero · </strong>}
                {m.kind} · {m.path.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                style={{ font: "inherit", fontSize: 12, color: C.faint, background: "transparent", border: "none", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
