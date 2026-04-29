"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastStore {
  toasts: Toast[];
  push: (message: string, tone?: ToastTone, durationMs?: number) => void;
  dismiss: (id: string) => void;
}

let seq = 0;
const nextId = () => `t${Date.now()}-${++seq}`;

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (message, tone = "success", durationMs = 2800) => {
    const id = nextId();
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    if (typeof window !== "undefined") {
      window.setTimeout(() => get().dismiss(id), durationMs);
    }
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
