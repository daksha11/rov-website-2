"use client";

import { v4 as uuid } from "uuid";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { Input } from "@/components/brand-kit/ui/input";
import { Button } from "@/components/brand-kit/ui/button";
import { Textarea } from "@/components/brand-kit/ui/textarea";
import { Switch } from "@/components/brand-kit/ui/switch";
import { Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function isValidGradientCss(value: string): boolean {
  if (!value.trim()) return false;
  if (typeof window === "undefined" || typeof CSS === "undefined") return true;
  try {
    return CSS.supports("background", value);
  } catch {
    return false;
  }
}

export default function GradientsStep() {
  const gradients = useBrandKitStore((s) => s.data.gradients);
  const addGradient = useBrandKitStore((s) => s.addGradient);
  const updateGradient = useBrandKitStore((s) => s.updateGradient);
  const removeGradient = useBrandKitStore((s) => s.removeGradient);
  const colors = useBrandKitStore((s) => s.data.colors.swatches);

  const handleAdd = () => {
    const c1 = colors[0]?.hex || "#E3C24A";
    const c2 = colors[colors.length - 1]?.hex || "#24123A";
    addGradient({
      id: uuid(),
      name: `Gradient ${gradients.length + 1}`,
      css: `linear-gradient(135deg, ${c1}, ${c2})`,
      isPrimary: gradients.length === 0,
    });
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#F0E6E0]/60 mb-2 font-medium">Step 05</p>
        <h2 className="text-2xl font-light tracking-tight mb-1 text-[#F0E6E0]"><span className="font-semibold">Gradients</span></h2>
        <p className="text-sm text-[#F0E6E0]/65">
          Define gradient styles. Paste the full CSS gradient value.
        </p>
      </div>

      {gradients.length === 0 && (
        <div className="rounded-xl border border-dashed border-[rgba(240,230,224,0.18)] bg-[rgba(240,230,224,0.02)] p-6 text-center">
          <div
            className="h-16 rounded-lg mb-3 border border-[rgba(240,230,224,0.1)]"
            style={{
              background: `linear-gradient(135deg, ${
                colors[0]?.hex || "#E3C24A"
              }, ${colors[colors.length - 1]?.hex || "#24123A"})`,
            }}
          />
          <p className="text-xs text-[#F0E6E0]/60 leading-relaxed">
            Create gradient styles from your palette.
            <br />
            <span className="text-[#F0E6E0]/50">
              Great for covers, CTAs, and accent blocks.
            </span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        {gradients.map((grad) => (
          <div
            key={grad.id}
            className="rounded-xl bg-[rgba(240,230,224,0.03)] backdrop-blur-md border border-[rgba(240,230,224,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(240,230,224,0.04)] overflow-hidden"
          >
            <div
              className="h-28 relative"
              style={{ background: grad.css }}
            >
              {grad.isPrimary && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-[9px] tracking-[0.15em] uppercase text-[#F0E6E0] font-medium">
                  <Star className="size-2.5 fill-current" />
                  Primary
                </div>
              )}
            </div>
            <div className="p-3 space-y-2">
              <Input
                value={grad.name}
                onChange={(e) =>
                  updateGradient(grad.id, { name: e.target.value })
                }
                placeholder="Gradient name"
              />
              <Textarea
                value={grad.css}
                onChange={(e) =>
                  updateGradient(grad.id, { css: e.target.value })
                }
                aria-invalid={!isValidGradientCss(grad.css)}
                className={cn(
                  "font-mono text-xs resize-none",
                  !isValidGradientCss(grad.css) &&
                    "border-[rgba(220,120,100,0.5)] focus-visible:ring-[rgba(220,120,100,0.3)]"
                )}
                rows={2}
                placeholder="linear-gradient(135deg, #color1, #color2)"
              />
              {!isValidGradientCss(grad.css) && (
                <p className="text-[10px] text-[#E89178]/85 leading-relaxed">
                  Not a valid CSS background value. Try
                  <code className="mx-1 px-1 py-0.5 rounded bg-[rgba(0,0,0,0.25)]">
                    linear-gradient(135deg, #E3C24A, #24123A)
                  </code>
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#F0E6E0]/70 cursor-pointer">
                  <Switch
                    checked={grad.isPrimary}
                    onCheckedChange={(checked) =>
                      updateGradient(grad.id, { isPrimary: checked })
                    }
                  />
                  Primary gradient
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGradient(grad.id)}
                  className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-3"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed"
      >
        <Plus className="size-4 mr-1" />
        Add Gradient
      </Button>
    </div>
  );
}
