"use client";

/**
 * /internal/map · the living system map.
 * Gated the same way as /admin: Supabase session + profiles.role check.
 * All content comes from ./map-data.ts · edit that file, not this one.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LAYERS, NODES, FLOWS, LAST_UPDATED, type MapNode } from "./map-data";

const supabase = createClient();

const C = {
  cream: "#FFF4E3",
  espresso: "#3B2114",
  rust: "#90422C",
  orange: "#EA9A61",
  hair: "rgba(59,33,20,0.14)",
  faint: "rgba(59,33,20,0.55)",
};

const nodeById = new Map(NODES.map((n) => [n.id, n]));

function NodeCard({ node }: { node: MapNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${C.hair}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: "0 1px 4px rgba(59,33,20,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 17, color: C.espresso }}>
          {node.label}
        </h3>
        <code style={{ fontSize: 11, color: C.rust, background: "rgba(144,66,44,0.07)", padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
          {node.path}
        </code>
      </div>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.55, color: C.faint }}>{node.note}</p>
      {node.connectsTo && node.connectsTo.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
          {node.connectsTo.map((id) => (
            <span
              key={id}
              title={nodeById.get(id)?.path || id}
              style={{
                fontSize: 10.5,
                fontFamily: "'Neue Montreal', Inter, sans-serif",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: C.cream,
                background: C.rust,
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              → {nodeById.get(id)?.label || id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InternalMapPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profile?.role !== "admin" && profile?.role !== "engineer") {
        router.push("/");
        return;
      }
      setStatus("ok");
    };
    checkAccess();
  }, [router]);

  if (status === "checking") {
    return (
      <main style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Checking access...
        </p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: C.cream, color: C.espresso, padding: "clamp(28px,5vw,64px) clamp(18px,5vw,64px)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: C.rust }}>
            Internal · not linked anywhere · noindex
          </p>
          <h1 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: "clamp(34px,5.5vw,54px)", lineHeight: 1.05 }}>
            How the codebase works
          </h1>
          <p style={{ margin: "14px 0 0", fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.6, color: C.faint, maxWidth: 640 }}>
            The living map of rovstudios.com. Five layers, top to bottom: a request enters a route, renders through shared UI,
            runs domain logic, touches services, and reads or writes data. Every card comes from{" "}
            <code style={{ fontSize: 12.5, color: C.rust }}>map-data.ts</code> · update that file when the system changes.
          </p>
          <p style={{ margin: "10px 0 0", fontFamily: "'Neue Montreal', Inter, sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.orange }}>
            Last updated {LAST_UPDATED}
          </p>
        </header>

        {/* Layers */}
        {LAYERS.map((layer, i) => {
          const nodes = NODES.filter((n) => n.layer === layer.id);
          return (
            <section key={layer.id} style={{ marginBottom: 8 }}>
              <div
                style={{
                  border: `1px solid ${C.hair}`,
                  borderRadius: 18,
                  padding: "clamp(16px,2.5vw,26px)",
                  background: i % 2 === 0 ? "rgba(234,154,97,0.06)" : "rgba(144,66,44,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
                  <h2 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 21, color: C.rust }}>
                    {layer.title}
                  </h2>
                  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.faint }}>{layer.blurb}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px,100%), 1fr))", gap: 12 }}>
                  {nodes.map((n) => (
                    <NodeCard key={n.id} node={n} />
                  ))}
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div style={{ textAlign: "center", padding: "6px 0", color: C.orange, fontSize: 18, lineHeight: 1 }}>↓</div>
              )}
            </section>
          );
        })}

        {/* Flows */}
        <section style={{ marginTop: 44 }}>
          <h2 style={{ margin: "0 0 6px", fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 26 }}>
            Five flows worth knowing
          </h2>
          <p style={{ margin: "0 0 20px", fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.faint }}>
            The end-to-end stories a new engineer should be able to trace on day one.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FLOWS.map((flow, i) => (
              <div key={flow.title} style={{ background: "#FFFFFF", border: `1px solid ${C.hair}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 15, color: C.orange }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ margin: 0, fontFamily: "Norwige, sans-serif", fontWeight: 700, fontSize: 16.5 }}>{flow.title}</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: "10px 0" }}>
                  {flow.steps.map((id, j) => (
                    <span key={`${id}-${j}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11.5, fontFamily: "'Neue Montreal', Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", color: C.espresso, background: "rgba(234,154,97,0.22)", border: `1px solid rgba(234,154,97,0.5)`, borderRadius: 999, padding: "4px 12px" }}>
                        {nodeById.get(id)?.label || id}
                      </span>
                      {j < flow.steps.length - 1 && <span style={{ color: C.rust, fontSize: 14 }}>→</span>}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.55, color: C.faint }}>{flow.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <footer style={{ marginTop: 44, paddingTop: 20, borderTop: `1px solid ${C.hair}` }}>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.faint, lineHeight: 1.6 }}>
            Companion docs: <code style={{ color: C.rust }}>docs/CODEBASE-AUDIT.md</code> (what and why),{" "}
            <code style={{ color: C.rust }}>CONTRIBUTING.md</code> (where new things go),{" "}
            <code style={{ color: C.rust }}>supabase/</code> (database schema). Middleware refreshes sessions but gates nothing:
            every protected page, including this one, checks the Supabase role itself.
          </p>
        </footer>
      </div>
    </main>
  );
}
