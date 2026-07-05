"use client";

import { useEffect, useState } from "react";
import { useBrandKitStore } from "@/lib/brand-kit/store";

function relativeTime(msAgo: number): string {
  const seconds = Math.floor(msAgo / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/**
 * Quiet "Saved locally" status for the builder masthead. Reflects the
 * localStorage-persisted store: bumps its timestamp whenever the working kit
 * changes. Timestamp is computed client-side after mount so there is no SSR
 * mismatch.
 */
export default function AutosaveIndicator() {
  const [mounted, setMounted] = useState(false);
  const [savedAt, setSavedAt] = useState<number>(0);
  const [, forceTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    setSavedAt(Date.now());
    // Every store write persists to localStorage; mirror that here.
    const unsubscribe = useBrandKitStore.subscribe(() => {
      setSavedAt(Date.now());
    });
    // Refresh the relative label periodically.
    const interval = window.setInterval(() => forceTick((n) => n + 1), 15000);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  // Render nothing on the server / first paint to avoid a hydration mismatch.
  if (!mounted) return null;

  return (
    <span
      className="hidden sm:inline-flex items-center gap-1.5 select-none"
      title="Your work is saved automatically in this browser"
      style={{
        fontFamily: "'Neue Montreal', 'Roboto', sans-serif",
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(240,230,224,0.5)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#A8C896",
          boxShadow: "0 0 6px rgba(168,200,150,0.55)",
        }}
      />
      Saved locally
      <span style={{ color: "rgba(240,230,224,0.28)" }}>
        · {relativeTime(Date.now() - savedAt)}
      </span>
    </span>
  );
}
