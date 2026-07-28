import type { Metadata } from "next";
import LicenseContent from "./LicenseContent";

// CTRL-A · The Reel — license terms for the free Atlanta b-roll pack.
// Utility/legal page: noindex until the offer leaves draft, and NOT legal
// advice as written. Every bracketed [BLANK] must be filled with real business
// facts, and a licensed Georgia media/IP attorney should review the whole thing
// before this goes public. The on-page copy links here from the ATL "Reel"
// section; keep the two in sync if the deal terms change.

export const metadata: Metadata = {
  title: "The Reel — B-Roll License Terms | CTRL-A",
  description:
    "License terms for the free Atlanta b-roll pack from CTRL-A by Range of View Studios.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.rovstudios.com/ctrla/atl/license" },
};

export default function LicensePage() {
  return <LicenseContent />;
}
