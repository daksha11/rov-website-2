"use client";

/**
 * /ctrla/submit/[type] · a dedicated, single-purpose submit page per type.
 * Each URL shows only that type's fields, rendered from the admin-editable
 * form config (ctrla_form_configs). The server's zod remains the real
 * validator. Unknown or closed types fall back to a gentle not-found.
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { FormConfig, SubmissionType } from "@/lib/ctrla/community";
import SubmitShell from "../_components/SubmitShell";
import ConfigForm from "../_components/ConfigForm";
import { C, NEUE, NORWIGE, card } from "../_components/theme";

const supabase = createClient();

const KNOWN: SubmissionType[] = ["tool", "idea", "signal", "resource", "history", "art", "story"];

export default function SubmitTypePage() {
  const params = useParams();
  const type = String(params.type) as SubmissionType;
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing" | "closed">("loading");

  useEffect(() => {
    if (!KNOWN.includes(type)) {
      setState("missing");
      return;
    }
    (async () => {
      const [{ data: cfg }, { data: { session } }] = await Promise.all([
        supabase
          .from("ctrla_form_configs")
          .select("type, track, is_open, title, intro, credit_cost, fields, sort")
          .eq("type", type)
          .maybeSingle(),
        supabase.auth.getSession(),
      ]);
      setUserId(session?.user.id ?? null);
      if (!cfg) {
        setState("missing");
        return;
      }
      const c = cfg as FormConfig;
      setConfig(c);
      setState(c.is_open ? "ok" : "closed");
    })();
  }, [type]);

  if (state === "loading") {
    return (
      <SubmitShell title="Contribute">
        <p style={{ fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Loading…</p>
      </SubmitShell>
    );
  }

  if (state === "missing") {
    return (
      <SubmitShell title="Not found">
        <section style={{ ...card, padding: "clamp(24px,5vw,34px)" }}>
          <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>That form does not exist</h2>
          <p style={{ margin: "10px 0 18px", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
            It may have been renamed or paused. Here is everything you can contribute.
          </p>
          <Link href="/ctrla/submit" style={{ fontSize: 13, fontWeight: 700, color: C.gold, textDecoration: "none" }}>
            Back to Contribute →
          </Link>
        </section>
      </SubmitShell>
    );
  }

  if (state === "closed" && config) {
    return (
      <SubmitShell title={config.title}>
        <section style={{ ...card, padding: "clamp(24px,5vw,34px)" }}>
          <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>Paused for now</h2>
          <p style={{ margin: "10px 0 18px", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
            This one is closed at the moment, usually because the queue is full. Try another way to contribute.
          </p>
          <Link href="/ctrla/submit" style={{ fontSize: 13, fontWeight: 700, color: C.gold, textDecoration: "none" }}>
            Back to Contribute →
          </Link>
        </section>
      </SubmitShell>
    );
  }

  return (
    <SubmitShell title={config!.title} eyebrow={config!.track === "magazine" ? "Get featured" : "Improve a toolkit"}>
      {userId && <ConfigForm config={config!} userId={userId} />}
    </SubmitShell>
  );
}
