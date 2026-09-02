"use client";

// Mounted once in the CTRL-A layout. Keeps the local profile and progress
// in step with the account whenever there is one. Renders nothing.

import { useCtrlASync } from "@/lib/ctrla/sync";

export default function CtrlAPathSync() {
  useCtrlASync();
  return null;
}
