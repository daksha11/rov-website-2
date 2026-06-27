"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — the room
// Immersive, full-screen, and the boundary where the heavy
// subsystems live (audio engine + presence), so they stay off the
// landing chunk. Composes: atmosphere, presence field, whispers,
// chrome, the session timer, the soundscape rail, mode counts, and
// the creative-fuel rail. Ends on a landing, not an alarm.
// ═══════════════════════════════════════════════════════

import { useCallback, useState } from "react";
import { ed } from "../../../_components/editorial";
import { durationMs } from "../../_state/foldConfig";
import type { Intention, Phase, Soundscape } from "../../_state/types";
import { useSoundscape } from "../../_audio/useSoundscape";
import { usePresence } from "../../_presence/usePresence";
import PresenceField from "../presence/PresenceField";
import ModeCounts from "../presence/ModeCounts";
import AmbientWhispers from "../presence/AmbientWhispers";
import RoomChrome from "./RoomChrome";
import SessionTimer from "./SessionTimer";
import SoundscapeRail from "./SoundscapeRail";
import CreativeFuelRail from "./CreativeFuelRail";
import SessionEnd from "./SessionEnd";

export default function TheFoldRoom({
  phase,
  intention,
  soundscape,
  sessionCount,
  startedAt,
  onSetSoundscape,
  onEnd,
  onAgain,
  onExit,
}: {
  phase: Phase;
  intention: Intention;
  soundscape: Soundscape;
  sessionCount: number;
  startedAt: number | null;
  onSetSoundscape: (s: Soundscape) => void;
  onEnd: () => void;
  onAgain: () => void;
  onExit: () => void;
}) {
  const { muted, ready, toggleMute } = useSoundscape(soundscape, true);
  const { dots, counts, total, whisper } = usePresence(intention.mode, true);

  const [captures, setCaptures] = useState<string[]>([]);
  const [inIt, setInIt] = useState(false);

  const onCapture = useCallback((line: string) => {
    setCaptures((c) => [...c, line]);
  }, []);

  const onHalf = useCallback(() => {
    setInIt(true);
    window.setTimeout(() => setInIt(false), 4200);
  }, []);

  const ended = phase === "ending" || phase === "done";
  const active = phase === "active";

  return (
    <div className="fold-room" data-soundscape={soundscape}>
      <div aria-hidden className="fold-room-atmos" />
      <PresenceField dots={dots} />
      <AmbientWhispers whisper={whisper} />

      {active && (
        <>
          <RoomChrome
            intention={intention}
            muted={muted}
            soundReady={ready}
            onToggleMute={toggleMute}
            onLeave={onExit}
          />

          {/* The focal timer */}
          <div className="fold-room-center fold-fade-in">
            {startedAt !== null && (
              <SessionTimer
                startedAt={startedAt}
                durationMs={durationMs(intention.durationKey)}
                onHalf={onHalf}
                onEnd={onEnd}
              />
            )}
            <span
              className="fold-init"
              style={{
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontSize: "clamp(16px,2vw,24px)",
                color: ed.gold,
                opacity: inIt ? 1 : 0,
                transition: "opacity 1s ease",
                marginTop: 18,
              }}
            >
              You&apos;re in it.
            </span>
          </div>

          {/* Bottom-left: who else is here */}
          <div className="fold-room-bl">
            <ModeCounts counts={counts} total={total} />
          </div>

          {/* Bottom-center: the stream */}
          <div className="fold-room-bc">
            <SoundscapeRail
              current={soundscape}
              sessionCount={sessionCount}
              onSelect={onSetSoundscape}
            />
          </div>

          {/* Right: creative fuel */}
          <CreativeFuelRail onCapture={onCapture} />
        </>
      )}

      {ended && (
        <div className="fold-room-center">
          <SessionEnd
            oneThing={intention.oneThing}
            captures={captures}
            onAgain={onAgain}
            onExit={onExit}
          />
        </div>
      )}
    </div>
  );
}
