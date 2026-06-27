"use client";

import { v4 as uuid } from "uuid";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Label } from "@/components/brand-kit/ui/label";
import { Button } from "@/components/brand-kit/ui/button";
import { Textarea } from "@/components/brand-kit/ui/textarea";
import { Plus, X } from "lucide-react";

export default function BrandVoiceStep() {
  const voice = useBrandKitStore((s) => s.data.voice);
  const setVoice = useBrandKitStore((s) => s.setVoice);

  const addPillar = () => {
    setVoice({
      pillars: [
        ...voice.pillars,
        {
          id: uuid(),
          label: `Pillar ${voice.pillars.length + 1}`,
          word: "",
          description: "",
        },
      ],
    });
  };

  const updatePillar = (
    id: string,
    updates: Partial<(typeof voice.pillars)[0]>
  ) => {
    setVoice({
      pillars: voice.pillars.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const removePillar = (id: string) => {
    setVoice({ pillars: voice.pillars.filter((p) => p.id !== id) });
  };

  const updateList = (
    key: "doExamples" | "dontExamples" | "weAre" | "weAreNot",
    index: number,
    value: string
  ) => {
    const updated = [...voice[key]];
    updated[index] = value;
    setVoice({ [key]: updated });
  };

  const addToList = (
    key: "doExamples" | "dontExamples" | "weAre" | "weAreNot"
  ) => {
    setVoice({ [key]: [...voice[key], ""] });
  };

  const removeFromList = (
    key: "doExamples" | "dontExamples" | "weAre" | "weAreNot",
    index: number
  ) => {
    setVoice({ [key]: voice[key].filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 mb-2 font-medium">Step 06</p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#F0E6E0]">Brand <span className="font-semibold">Voice</span></h2>
        <p className="text-sm text-[#F0E6E0]/65">
          Define voice pillars and tone guidelines.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Voice Pillars</Label>
        {voice.pillars.map((pillar, pi) => (
          <div
            key={pillar.id}
            className="group p-3 rounded-xl bg-[rgba(240,230,224,0.03)] backdrop-blur-md border border-[rgba(240,230,224,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(240,230,224,0.04)] space-y-2 hover:border-[rgba(240,230,224,0.2)] transition-all"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[9px] font-mono tracking-wider uppercase text-[#F0E6E0]/50 flex-shrink-0">
                  {String(pi + 1).padStart(2, "0")}
                </span>
                <input
                  value={pillar.word}
                  onChange={(e) =>
                    updatePillar(pillar.id, { word: e.target.value })
                  }
                  className="flex-1 font-medium bg-transparent border-0 p-0 text-sm text-[#F0E6E0] outline-none focus:text-[#F0E6E0] transition-colors min-w-0"
                  placeholder="e.g. Grounded"
                />
              </div>
              <button
                onClick={() => removePillar(pillar.id)}
                className="size-6 rounded-full flex items-center justify-center text-[#F0E6E0]/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <X className="size-3" />
              </button>
            </div>
            <Textarea
              value={pillar.description}
              onChange={(e) =>
                updatePillar(pillar.id, { description: e.target.value })
              }
              className="text-xs resize-none min-h-[50px]"
              rows={2}
              placeholder="Describe this pillar..."
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addPillar}
          className="w-full border-dashed"
        >
          <Plus className="size-3.5 mr-1" />
          Add Pillar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(["doExamples", "dontExamples"] as const).map((key) => (
          <div key={key} className="space-y-2">
            <Label>{key === "doExamples" ? "Do" : "Don't"}</Label>
            {voice[key].map((item, i) => (
              <div key={i} className="flex gap-1">
                <Input
                  value={item}
                  onChange={(e) => updateList(key, i, e.target.value)}
                  className="text-xs"
                  placeholder={
                    key === "doExamples"
                      ? "Speak with warmth..."
                      : "Use jargon..."
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromList(key, i)}
                  className="size-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToList(key)}
              className="w-full border-dashed text-xs h-7"
            >
              <Plus className="size-3 mr-1" />
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
