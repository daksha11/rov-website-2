"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID!);
    }
  }, []);

  return null;
}
