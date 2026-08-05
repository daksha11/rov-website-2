"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE ROOM
// The join section. CTRL-A is a magazine you read; this is the
// part where you talk back.
//
// Live proof comes from /api/ctrla/room after mount, so the page
// stays static and a slow (or down) Discord never blocks render.
// Three states, in order of preference:
//   next event known  → "Next up · Feedback Friday, Fri 7 Aug"
//   healthy headcount → "412 members · 38 online"
//   neither           → no proof line at all
// It never invents a number. An honest silence beats "3 members",
// which reads as a dead room and costs joins.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { ed, Bleed, Kicker, Label } from "./editorial";
import { DISCORD_INVITES, type RoomSnapshot } from "@/lib/ctrla/discord";

const WHAT_HAPPENS = [
  "Feedback Friday, every week",
  "Toolkits, argued over by the people using them",
  "Atlanta creatives who actually show up",
];

function formatEventDate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function TheRoom() {
  const [room, setRoom] = useState<RoomSnapshot | null>(null);
  const invite = DISCORD_INVITES.ctrlaHub;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ctrla/room")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.room) setRoom(d.room as RoomSnapshot);
      })
      .catch(() => {
        /* proof line just stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The section exists to send people somewhere. With nowhere to send them,
  // it has no reason to render.
  if (!invite) return null;

  const eventDate = room?.nextEvent ? formatEventDate(room.nextEvent.startsAt) : null;
  const proof = eventDate
    ? `Next up · ${room!.nextEvent!.name}, ${eventDate}`
    : room?.memberCount
      ? `${room.memberCount.toLocaleString()} members${
          room.onlineCount ? ` · ${room.onlineCount.toLocaleString()} online` : ""
        }`
      : null;

  return (
    <section
      id="the-room"
      style={{
        background: `linear-gradient(180deg, ${ed.ground} 0%, ${ed.panel} 50%, ${ed.ground} 100%)`,
        borderTop: `1px solid ${ed.hair}`,
        borderBottom: `1px solid ${ed.hair}`,
        padding: "clamp(40px,6vw,80px) 0",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: 80,
      }}
    >
      <Bleed>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: "clamp(20px,3vw,34px)",
          }}
        >
          <Kicker color={ed.gold}>The Room · CTRL-A on Discord</Kicker>
          {proof && <Label color={ed.gold}>{proof}</Label>}
        </div>

        <h2
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(38px,6vw,88px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            color: ed.ink,
            margin: "0 0 20px",
          }}
        >
          Come talk back
        </h2>

        <p
          style={{
            fontFamily: ed.body,
            fontSize: "clamp(15px,1.7vw,20px)",
            lineHeight: 1.6,
            color: ed.inkSoft,
            margin: "0 0 26px",
            maxWidth: 560,
          }}
        >
          CTRL-A is a magazine you read. This is the part where you answer. Producers,
          designers, editors and builders in one room, showing work while it is still
          rough, which is the only time feedback is worth anything.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 32px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {WHAT_HAPPENS.map((line) => (
            <li
              key={line}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: ed.mono,
                fontSize: "clamp(11px,1.2vw,13px)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ed.inkFaint,
              }}
            >
              <span
                aria-hidden
                style={{ width: 14, height: 1, background: ed.gold, flexShrink: 0 }}
              />
              {line}
            </li>
          ))}
        </ul>

        <a
          href={invite}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: ed.gold,
            color: ed.void,
            fontFamily: ed.mono,
            fontSize: "clamp(11px,1.2vw,13px)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "14px 26px",
            textDecoration: "none",
            border: `1px solid ${ed.gold}`,
          }}
        >
          Join the room
          <span aria-hidden>→</span>
        </a>

        <p
          style={{
            fontFamily: ed.body,
            fontSize: 13,
            lineHeight: 1.5,
            color: ed.inkFaint,
            margin: "16px 0 0",
            maxWidth: 460,
          }}
        >
          Free, and it stays free. If you make music, there is a second room behind it.
        </p>
      </Bleed>
    </section>
  );
}
