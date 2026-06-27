"use client";

import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Switch } from "@/components/brand-kit/ui/switch";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/lib/brand-kit/types";

export default function SectionsConfigStep() {
  const sections = useBrandKitStore((s) => s.data.sections);
  const toggleSection = useBrandKitStore((s) => s.toggleSection);
  const reorderSections = useBrandKitStore((s) => s.reorderSections);

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  const moveSection = (index: number, direction: -1 | 1) => {
    const newSections = [...sorted];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index].order;
    newSections[index] = { ...newSections[index], order: newSections[targetIndex].order };
    newSections[targetIndex] = { ...newSections[targetIndex], order: temp };

    reorderSections(newSections);
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 mb-2 font-medium">Step 07</p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#F0E6E0]"><span className="font-semibold">Sections</span></h2>
        <p className="text-sm text-[#F0E6E0]/65">
          Choose which sections to include and their order.
        </p>
      </div>

      <div className="space-y-2">
        {sorted.map((section, i) => (
          <div
            key={section.id}
            className={cn(
              "group flex items-center gap-3 p-3 rounded-xl backdrop-blur-md border transition-all",
              section.enabled
                ? "bg-[rgba(240,230,224,0.03)] border-[rgba(240,230,224,0.12)] shadow-[inset_0_1px_0_rgba(240,230,224,0.03)]"
                : "bg-transparent border-[rgba(240,230,224,0.06)] opacity-60"
            )}
          >
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                onClick={() => moveSection(i, -1)}
                disabled={i === 0}
                className="size-5 rounded flex items-center justify-center text-[#F0E6E0]/40 hover:text-[#F0E6E0] hover:bg-[rgba(240,230,224,0.08)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#F0E6E0]/40 transition-all"
              >
                <ChevronUp className="size-3" />
              </button>
              <button
                onClick={() => moveSection(i, 1)}
                disabled={i === sorted.length - 1}
                className="size-5 rounded flex items-center justify-center text-[#F0E6E0]/40 hover:text-[#F0E6E0] hover:bg-[rgba(240,230,224,0.08)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#F0E6E0]/40 transition-all"
              >
                <ChevronDown className="size-3" />
              </button>
            </div>

            <Switch
              checked={section.enabled}
              onCheckedChange={() => toggleSection(section.id as SectionId)}
            />

            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "text-sm transition-colors",
                  section.enabled ? "text-[#F0E6E0]" : "text-[#F0E6E0]/50"
                )}
              >
                {section.label}
              </div>
            </div>

            <span className="text-[10px] text-[#F0E6E0]/40 font-mono tracking-wider flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
