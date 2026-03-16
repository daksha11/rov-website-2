"use client"

import { ComingSoonPlaceholder } from "../../_shared/components"
import type { NavSection } from "../../_shared/types"

export const NAV_SECTIONS: NavSection[] = []

export default function VCInvestors({ chartReady }: { chartReady: boolean }) {
  return <ComingSoonPlaceholder title="VC & Investors" />
}
