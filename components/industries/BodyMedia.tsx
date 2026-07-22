"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Inline editorial media card for an IndustryBody chapter companion. Reuses the
 * showcase band's lazy, reduced-motion-safe pattern: videos are Intersection
 * Observer-mounted with preload="none", autoplay muted+looping only once in view
 * AND only when the user has not requested reduced motion (otherwise the first
 * frame simply holds, paused). Images go through next/image. The whole card is
 * decorative (aria-hidden on the figure) supplementary matter beside prose that
 * already carries the meaning, so it never affects reading order or GEO/AEO.
 */
export function BodyMedia({
  src,
  mediaKind,
  label,
  alt = "",
}: {
  src: string;
  mediaKind: "image" | "video";
  label?: string;
  alt?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mount, setMount] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || mediaKind !== "video") return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setMount(true);
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mediaKind]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (mount && !reducedRef.current) v.play().catch(() => {});
  }, [mount]);

  return (
    <figure className="icp-cmp-media" aria-hidden>
      <div ref={wrapRef} className="icp-cmp-media-frame">
        {mediaKind === "video" ? (
          mount ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              tabIndex={-1}
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : null
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 767px) 100vw, 440px"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      {label && <figcaption className="icp-cmp-media-cap">{label}</figcaption>}
    </figure>
  );
}
