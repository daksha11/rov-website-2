"use client";

// The "forget my path" control. Clears the account copy (DELETE
// /api/ctrla/path) and the device copy (profile + progress). Lives on the
// account page. Two clicks, because it cannot be undone.

import { useState } from "react";
import { clearProfile } from "@/lib/ctrla/profile";
import { clearProgress } from "@/lib/ctrla/progress";
import { ed } from "./editorial";

export default function ForgetPath() {
  const [arm, setArm] = useState(false);
  const [done, setDone] = useState(false);

  const forget = async () => {
    try {
      await fetch("/api/ctrla/path", { method: "DELETE" });
    } catch {
      /* the device copy still clears */
    }
    clearProgress();
    clearProfile();
    setArm(false);
    setDone(true);
  };

  if (done) {
    return <p style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold, margin: 0 }}>Forgotten. Answer the quiz again whenever you like.</p>;
  }

  return (
    <p style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkFaint, margin: 0 }}>
      {arm ? (
        <>
          This clears your quiz answers and every stop, here and on your account.{" "}
          <button type="button" onClick={() => void forget()} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: ed.amber, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Yes, forget it
          </button>{" "}
          <button type="button" onClick={() => setArm(false)} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: ed.gold, cursor: "pointer" }}>
            Keep it
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setArm(true)} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: ed.inkFaint, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
          Forget my path
        </button>
      )}
    </p>
  );
}
