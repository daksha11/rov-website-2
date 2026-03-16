"use client"

import { ComingSoonPlaceholder } from "../../_shared/components"
import type { NavSection } from "../../_shared/types"

export const NAV_SECTIONS: NavSection[] = []

export default function Design({ chartReady }: { chartReady: boolean }) {
  return <ComingSoonPlaceholder title="Design & Visuals" />
}
