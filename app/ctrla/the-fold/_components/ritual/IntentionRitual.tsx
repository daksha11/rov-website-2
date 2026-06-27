"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — intention ritual
// The ~15 second entry. Three steps, one at a time, slow fades.
// Mode and duration auto-advance on choice; the last step names
// one thing. Completing it commits the intention and hands off
// to the immersive transition.
// ═══════════════════════════════════════════════════════

import { useCallback, useState } from "react";
import { Bleed, Label, ed } from "../../../_components/editorial";
import { FOLD_COPY } from "../../_content/copy";
import { MODES, DURATIONS } from "../../_state/foldConfig";
import type { Mode, DurationKey, Intention } from "../../_state/types";
import RitualStep from "./RitualStep";

const ADVANCE_DELAY = 320; // a beat so the selection is felt before the fade

export default function IntentionRitual({
  onComplete,
  onBack,
}: {
  onComplete: (intention: Intention) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [durationKey, setDurationKey] = useState<DurationKey | null>(null);
  const [oneThing, setOneThing] = useState("");

  const pickMode = useCallback((id: string) => {
    setMode(id as Mode);
    window.setTimeout(() => setStep(1), ADVANCE_DELAY);
  }, []);

  const pickDuration = useCallback((id: string) => {
    setDurationKey(id as DurationKey);
    window.setTimeout(() => setStep(2), ADVANCE_DELAY);
  }, []);

  const complete = useCallback(() => {
    if (!mode || !durationKey) return;
    onComplete({ mode, durationKey, oneThing: oneThing.trim() });
  }, [mode, durationKey, oneThing, onComplete]);

  const back = useCallback(() => {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  }, [step, onBack]);

  return (
    <section style={{ position: "relative", zIndex: 2, padding: "clamp(48px,9vw,128px) 0" }}>
      <Bleed>
        <Label color={ed.inkFaint} style={{ display: "block", marginBottom: "clamp(28px,4vw,44px)" }}>
          {FOLD_COPY.ritual.eyebrow}
        </Label>

        {step === 0 && (
          <RitualStep
            n={FOLD_COPY.ritual.steps.mode.n}
            total="03"
            prompt={FOLD_COPY.ritual.steps.mode.prompt}
            kind="choice"
            options={MODES.map((m) => ({ id: m.id, label: m.label }))}
            selected={mode ?? undefined}
            onSelect={pickMode}
            onBack={back}
            backLabel="Leave"
          />
        )}

        {step === 1 && (
          <RitualStep
            n={FOLD_COPY.ritual.steps.duration.n}
            total="03"
            prompt={FOLD_COPY.ritual.steps.duration.prompt}
            kind="choice"
            options={DURATIONS.map((d) => ({ id: d.key, label: d.label }))}
            selected={durationKey ?? undefined}
            onSelect={pickDuration}
            onBack={back}
            backLabel={FOLD_COPY.ritual.back}
          />
        )}

        {step === 2 && (
          <RitualStep
            n={FOLD_COPY.ritual.steps.oneThing.n}
            total="03"
            prompt={FOLD_COPY.ritual.steps.oneThing.prompt}
            kind="input"
            value={oneThing}
            onChange={setOneThing}
            placeholder={FOLD_COPY.ritual.steps.oneThing.placeholder}
            onAdvance={complete}
            advanceLabel={FOLD_COPY.ritual.enter}
            canAdvance
            onBack={back}
            backLabel={FOLD_COPY.ritual.back}
          />
        )}
      </Bleed>
    </section>
  );
}
