"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Instagram, X } from "lucide-react";
// "book" points at the paid Studio Session, the thing people actually book.
// The generic 15-minute BOOKING_URL is shared with the studios side and isn't
// attached to anything we sell here.
import { CAL_LINKS, CONTACT_EMAIL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";

// Minimal floating dock for rovmusic.com. Deliberately trimmed vs the studios
// NavigationDock: no CTRL A, no B2B services menu, no account login. Structured
// so more items (About, Works, Pricing) can slot in as the music site grows.

export function MusicNav({ className }: { className?: string }) {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!contactOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [contactOpen]);

  return (
    <>
      <div
        className={`nav-dock-font fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 sm:px-6 md:px-8 py-1 md:py-2.5 rounded-full border border-white/10 z-[999] max-w-[95%] md:max-w-none ${className || ""}`}
      >
        <nav className="flex items-center gap-1 md:gap-2.5 justify-center relative z-10 flex-nowrap">
          <Link
            href="/"
            className="px-2 min-h-[44px] flex items-center text-white/80 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            home
          </Link>

          <span className="hidden sm:inline text-white/30 text-[10px] md:text-base mx-0.5">|</span>
          {/* Root-relative so it works from /sam-suen too, not just the home page. */}
          <Link
            href="/#audit"
            className="px-2 min-h-[44px] flex items-center text-white/80 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            audit
          </Link>

          <span className="hidden sm:inline text-white/30 text-[10px] md:text-base mx-0.5">|</span>
          <CalBookButton
            calLink={CAL_LINKS.hourlySession}
            className="px-2 min-h-[44px] flex items-center text-white/80 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            book
          </CalBookButton>

          <span className="hidden sm:inline text-white/30 text-[10px] md:text-base mx-0.5">|</span>
          <button
            onClick={() => setContactOpen(true)}
            className="px-2 min-h-[44px] flex items-center text-white/80 hover:text-white transition-colors text-[12px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
          >
            contact
          </button>
        </nav>
      </div>

      {contactOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="nav-dock-font bg-black/50 backdrop-blur-md text-white p-8 rounded-3xl shadow-lg text-center w-96 max-w-[90%] relative border border-white/10">
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              onClick={() => setContactOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white/90">Get in touch</h3>
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
              >
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white/80">Send stems</span>
              </a>
              <a
                href="https://www.instagram.com/rangeofviewstudios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="text-white/80">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
