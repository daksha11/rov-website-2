"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — orchestrator
// You arrive into the Commons and drift between rooms. The scene
// is the immersive shell; audio + presence are effects keyed to
// the place you are standing in. Heavy work (the cafe) is this
// whole route; the magazine only carries a static teaser.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ed } from "../_components/editorial";
import { FOLD_COPY } from "./_content/copy";
import { useFoldSession } from "./_state/useFoldSession";
import { placeDef, isRoom, COMMONS } from "./_state/foldConfig";
import { getTimeBand, greetingFor } from "./_state/timeOfDay";
import type { TimeBand } from "./_state/types";
import { useCafeAudio } from "./_audio/useCafeAudio";
import { usePresence } from "./_presence/usePresence";
import Arrival from "./_components/Arrival";
import CafeScene from "./_components/CafeScene";
import Wayfinding from "./_components/Wayfinding";
import AmbientMixer from "./_components/AmbientMixer";
import PlacePanel from "./_components/PlacePanel";

export default function TheFoldContent() {
  const router = useRouter();
  const { state, arrive, go, setNote } = useFoldSession();
  const { phase, place, visited, note } = state;
  const inside = phase === "inside";
  const def = placeDef(place);
  const roomPlace = isRoom(place);

  const { ready, muted, levels, setLevel, applyPreset, toggleMute } = useCafeAudio(
    inside,
    COMMONS.preset
  );
  const { dots, whisper } = usePresence(place, inside);

  const [band, setBand] = useState<TimeBand | null>(null);

  // Immersive: dark ground, no page scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    const prevOf = document.body.style.overflow;
    document.body.style.backgroundColor = ed.void;
    document.body.style.overflow = "hidden";
    setBand(getTimeBand(new Date()));
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflow = prevOf;
    };
  }, []);

  // Each place sets its own ambient blend.
  useEffect(() => {
    if (inside) applyPreset(placeDef(place).preset);
  }, [place, inside, applyPreset]);

  const greeting = band ? greetingFor(band) : "Find your seat.";

  return (
    <>
      <CafeScene place={place} dots={dots} whisper={whisper}>
        {/* Chrome */}
        <div className="fold-chrome">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(17px,2vw,23px)", color: ed.paper }}>
              {FOLD_COPY.wordmark}
            </span>
            <span style={{ color: ed.inkFaint }}>·</span>
            <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.gold, whiteSpace: "nowrap" }}>
              {def.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/ctrla")}
            className="fold-leave"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
              {FOLD_COPY.leave}
            </span>
            <span style={{ color: ed.inkFaint }}>→</span>
          </button>
        </div>

        {/* The place */}
        <PlacePanel def={def} isRoomPlace={roomPlace} note={note} setNote={setNote} greeting={greeting} />

        {/* The doors */}
        <Wayfinding current={place} visited={visited} onGo={go} />

        {/* The mix */}
        <AmbientMixer levels={levels} muted={muted} soundReady={ready} onSet={setLevel} onToggleMute={toggleMute} />
      </CafeScene>

      {phase === "arriving" && <Arrival onArrived={arrive} />}
    </>
  );
}
