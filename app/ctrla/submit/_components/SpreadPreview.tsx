"use client";

/**
 * SpreadPreview · a live, magazine-style preview for Track B (art / story).
 * It reads the same `values` the form collects and renders them as a spread
 * that forms while the submitter types, so the paid door feels like being
 * published rather than filling a form.
 *
 * Media lives in the private ctrla-submissions bucket. The owner can read
 * their own prefix (storage RLS), so we mint short-lived signed URLs here to
 * show the hero + gallery. Signing is best-effort: a URL that fails to sign
 * just renders as a labelled placeholder, never a broken image.
 */

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { MediaItem, ProcessSection, SubmissionType, ToolUsed } from "@/lib/ctrla/community";
import { C, NEUE, NORWIGE, card } from "./theme";

const supabase = createClient();
const BUCKET = "ctrla-submissions";

type Values = Record<string, unknown>;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export default function SpreadPreview({ type, values }: { type: SubmissionType; values: Values }) {
  const media = arr<MediaItem>(values.media);
  const title = str(values.title);
  const medium = str(values.medium);
  const statement = str(values.statement);
  const bio = str(values.bio);
  const tools = arr<ToolUsed>(values.tools);
  const process = arr<ProcessSection>(values.process);
  const tags = arr<string>(values.tags);

  // Sign image paths so the hero + gallery actually render. Keyed by a stable
  // join of the paths so we only re-sign when the media set changes.
  const imagePaths = useMemo(
    () => media.filter((m) => m.kind === "image").map((m) => m.path),
    [media],
  );
  const pathsKey = imagePaths.join("|");
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    if (!imagePaths.length) {
      setUrls({});
      return;
    }
    (async () => {
      const entries = await Promise.all(
        imagePaths.map(async (p) => {
          const { data } = await supabase.storage.from(BUCKET).createSignedUrl(p, 3600);
          return [p, data?.signedUrl ?? ""] as const;
        }),
      );
      if (!cancelled) setUrls(Object.fromEntries(entries.filter(([, u]) => u)));
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathsKey]);

  const heroImg = media.find((m) => m.kind === "image");
  const heroUrl = heroImg ? urls[heroImg.path] : undefined;
  const gallery = media.filter((m) => m !== heroImg && m.kind === "image");
  const nonImage = media.filter((m) => m.kind !== "image");

  const empty = !title && !medium && !statement && media.length === 0 && !bio && tools.length === 0 && process.length === 0;

  return (
    <div style={{ ...card, overflow: "hidden", position: "sticky", top: 24 }}>
      <p style={{ margin: 0, padding: "12px 16px", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.faint, fontWeight: 600, borderBottom: `1px solid ${C.hair}` }}>
        Live preview
      </p>

      {empty ? (
        <div style={{ padding: "48px 22px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13.5, color: C.faint, lineHeight: 1.6 }}>
            Your spread forms here as you go. Add a cover image and a title to start.
          </p>
        </div>
      ) : (
        <div>
          {/* Hero */}
          <div style={{ position: "relative", aspectRatio: "3 / 2", background: "rgba(255,255,255,0.03)" }}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.faint, fontSize: 12, fontFamily: NEUE }}>
                {heroImg ? "Loading cover…" : nonImage.length ? `${nonImage[0].kind} · cover` : "Cover image"}
              </div>
            )}
          </div>

          <div style={{ padding: "20px 22px 24px" }}>
            {medium && (
              <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>{medium}</p>
            )}
            <h3 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(22px, 4vw, 30px)", lineHeight: 1.1, color: C.cream }}>
              {title || "Untitled"}
            </h3>

            {statement && (
              <p style={{ margin: "14px 0 0", fontSize: 14.5, color: C.soft, lineHeight: 1.7 }}>{statement}</p>
            )}

            {/* Story process */}
            {process.filter((p) => p.heading || p.body).length > 0 && (
              <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                {process.filter((p) => p.heading || p.body).map((p, i) => (
                  <div key={i}>
                    {p.heading && (
                      <p style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 15, color: C.cream }}>{p.heading}</p>
                    )}
                    {p.body && <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.soft, lineHeight: 1.65 }}>{p.body}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Tools used */}
            {tools.filter((t) => t.name).length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ margin: "0 0 8px", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>Made with</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {tools.filter((t) => t.name).map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: C.soft, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.hair}`, borderRadius: 999, padding: "5px 11px" }}>
                      {t.name}{t.toolkit ? ` · ${t.toolkit}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags (art) */}
            {type === "art" && tags.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 12, color: C.faint }}>#{t}</span>
                ))}
              </div>
            )}

            {/* Gallery thumbs */}
            {gallery.length > 0 && (
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 6 }}>
                {gallery.map((m) => (
                  <div key={m.path} style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                    {urls[m.path] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={urls[m.path]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {bio && (
              <p style={{ margin: "22px 0 0", paddingTop: 16, borderTop: `1px solid ${C.hair}`, fontSize: 12.5, color: C.faint, lineHeight: 1.6, fontStyle: "italic" }}>
                {bio}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
