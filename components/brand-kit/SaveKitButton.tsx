"use client";

// Save the current kit to the member's account (the newest 3 are kept; a DB
// trigger trims older ones). Saving is free, no credits, no login wall on the
// builder: this button just asks for sign-in at the moment of saving, the same
// pattern as export. Full kit data (logos + fonts included) is stored, so a
// saved kit resumes exactly, unlike a share link.

import { useState } from "react";
import { Button } from "@/components/brand-kit/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useBrandKitStore } from "@/lib/brand-kit/store";
import { useToast } from "@/hooks/brand-kit/useToast";
import AuthModal from "@/components/brand-kit/AuthModal";

const supabase = createClient();

export default function SaveKitButton({ className }: { className?: string }) {
  const brandName = useBrandKitStore((s) => s.data.brandInfo.name);
  const pushToast = useToast((s) => s.push);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAuthOpen(true);
        return;
      }
      const data = useBrandKitStore.getState().data;
      const { error } = await supabase.from("brand_kits").insert({
        user_id: session.user.id,
        name: (brandName || "Untitled kit").slice(0, 80),
        data,
      });
      if (error) {
        pushToast("Could not save. Please try again.", "error");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      pushToast("Saved to your account", "success");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button onClick={handleSave} disabled={saving} variant="outline" className={className}>
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving…
          </>
        ) : saved ? (
          <>
            <Check className="size-4" /> Saved
          </>
        ) : (
          <>
            <Save className="size-4" /> Save to my account
          </>
        )}
      </Button>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
