"use client";

import { useEffect } from "react";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#EA9A61] mb-4"
          style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
        >
          Something went wrong
        </h2>
        <p
          className="text-[#FFF4E3]/60 text-sm md:text-base mb-8"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-full border-2 border-[#EA9A61] text-[#EA9A61] font-mono text-sm tracking-widest uppercase hover:bg-[#EA9A61]/10 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
