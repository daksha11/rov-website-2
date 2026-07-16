// Shared CTRL-A palette + type tokens for the submit surface, so the pages
// and shared components never drift or re-declare constants. Matches the
// cosmic-sunset system used across /account and /ctrla.
import type { CSSProperties } from "react";

export const C = {
  ground: "#0F0820",
  panel: "#24123A",
  plum: "#4E3D73",
  cream: "#F0E6E0",
  gold: "#E3C24A",
  rose: "#A56A67",
  hair: "rgba(240,230,224,0.1)",
  faint: "rgba(240,230,224,0.55)",
  soft: "rgba(240,230,224,0.82)",
};

export const NEUE = "'Neue Montreal', 'Roboto', sans-serif";
export const NORWIGE = "Norwige, sans-serif";

export const card: CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.hair}`,
  borderRadius: 18,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  font: "inherit",
  fontFamily: NEUE,
  fontSize: 15,
  color: C.cream,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${C.hair}`,
  borderRadius: 12,
  padding: "13px 16px",
  outline: "none",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: NEUE,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: C.faint,
  fontWeight: 600,
  marginBottom: 8,
};
