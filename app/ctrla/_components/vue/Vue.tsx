"use client";

// ═══════════════════════════════════════════════════════
// VUE — THE NARRATOR
//
// The body is settled art and stays a flat webp. The face is SVG, because the
// face is the only part that has to move. This component is the join: it draws
// the pose, then lays VueEye onto the visor rect the registry measured for
// that pose, so the drawn eye lands exactly where the painted one was.
// ═══════════════════════════════════════════════════════

import Image from "next/image";
import { type CSSProperties } from "react";
import VueEye, { type VueMood } from "./VueEye";
import { VUE_POSES, vueSrc, type VueColorway, type VuePose } from "./poses";

export interface VueProps {
  pose: VuePose;
  colorway?: VueColorway;
  /** Rendered height in px, or any CSS length. Width follows the art. */
  height?: number | string;
  mood?: VueMood;
  wakeOnScroll?: boolean;
  /**
   * Clip the pose at the page edge it was drawn for (see `edge` in the pose
   * registry). Required for `leaning`, which has no arm on the side the edge
   * is meant to cover. The component then measures only the visible part, so
   * sitting it flush against a container edge is all the placement needed.
   */
  bleed?: boolean;
  /** Above-the-fold placements only — everything else should stay lazy. */
  priority?: boolean;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Vue({
  pose,
  colorway = "purple",
  height = 320,
  mood = "calm",
  wakeOnScroll = true,
  bleed = false,
  priority = false,
  // Vue is decoration wrapped around copy that already says what it says, so
  // the default is to hide it from screen readers. Pass `alt` to override.
  alt = "",
  className,
  style,
}: VueProps) {
  const spec = VUE_POSES[pose];
  const h = typeof height === "number" ? `${height}px` : height;
  const eye = spec.eye;
  const edge = bleed ? spec.edge : undefined;

  // With a bleed, the outer box measures only the part that stays on the page
  // and clips the rest, so sitting it flush against a container edge is all
  // the placement needed. The figure inside stays full size and simply
  // overflows: to the right by default, or pulled left by the hidden width
  // when the far side is the one being cut. Deliberately no `position` on the
  // wrapper — callers position it themselves, and an inline `position:
  // relative` here would silently beat their class.
  const figure = (
    <div
      className={edge ? undefined : className}
      style={{
        position: "relative",
        height: edge ? "100%" : h,
        aspectRatio: `${spec.width} / ${spec.height}`,
        marginLeft: edge?.side === "left" ? `-${(edge.amount / (1 - edge.amount)) * 100}%` : undefined,
        flexShrink: 0,
        ...(edge ? null : style),
      }}
    >
      <Image
        src={vueSrc(pose, colorway)}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        width={spec.width}
        height={spec.height}
        priority={priority}
        sizes={`${typeof height === "number" ? Math.ceil((height * spec.width) / spec.height) : 400}px`}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <div
        style={{
          position: "absolute",
          left: `${eye.x * 100}%`,
          top: `${eye.y * 100}%`,
          width: `${eye.w * 100}%`,
          height: `${eye.h * 100}%`,
          pointerEvents: "none",
        }}
      >
        <VueEye mood={mood} wakeOnScroll={wakeOnScroll} />
      </div>
    </div>
  );

  if (!edge) return figure;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        height: h,
        aspectRatio: `${spec.width * (1 - edge.amount)} / ${spec.height}`,
        flexShrink: 0,
        ...style,
      }}
    >
      {figure}
    </div>
  );
}

/**
 * Vue from the shoulders up — for inline slots where a full figure would be
 * absurd, like the byline on a pull-quote. Crops to the helmet by scaling the
 * art up inside a round window, which keeps the eye animation intact.
 */
export function VueBust({
  pose = "pointing",
  colorway = "purple",
  size = 44,
  mood = "calm",
  className,
  style,
}: {
  pose?: VuePose;
  colorway?: VueColorway;
  size?: number;
  mood?: VueMood;
  className?: string;
  style?: CSSProperties;
}) {
  const spec = VUE_POSES[pose];
  // Frame the helmet: the eye rect tells us where the head is, so centre on it
  // and zoom until the helmet fills the window.
  const cx = spec.eye.x + spec.eye.w / 2;
  // The helmet's centre sits a little above the eye, so bias upward or the
  // dome gets cropped and the bust reads as a coin instead of a head.
  const cy = spec.eye.y + spec.eye.h / 2 - 0.016;
  // Wide enough to keep the whole helmet in the window; any tighter and the
  // bust is a glowing smear rather than a character.
  const zoom = 2;

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: `${zoom * 100}%`,
          aspectRatio: `${spec.width} / ${spec.height}`,
          transform: `translate(${-cx * 100}%, ${-cy * 100}%)`,
        }}
      >
        <Vue pose={pose} colorway={colorway} height="100%" mood={mood} wakeOnScroll={false} />
      </span>
    </span>
  );
}
