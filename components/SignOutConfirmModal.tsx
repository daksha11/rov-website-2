"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SignOutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SignOutConfirmModal({ onConfirm, onCancel }: SignOutConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    // Move focus into modal when it opens
    cancelRef.current?.focus();
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-[16px] animate-in fade-in duration-200"
    >
      <style>{`
        @keyframes navConfirmCardIn {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sign-out-card {
          animation: navConfirmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-title"
        className="sign-out-card bg-[rgba(18,18,18,0.95)] border border-[rgba(255,244,227,0.1)] rounded-[20px] p-10 max-w-[380px] w-[90%] text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.25em] text-[rgba(255,244,227,0.35)] mb-3">
          Confirm
        </p>
        <h2
          id="signout-title"
          className="text-[22px] font-bold italic text-[#FFF4E3] mb-2"
          style={{ fontFamily: "Norwige, sans-serif" }}
        >
          Sign out?
        </h2>
        <p className="text-sm text-[rgba(255,244,227,0.4)] mb-8 font-[Roboto,sans-serif]">
          You will need to sign in again to access your account.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            ref={cancelRef}
            onClick={onCancel}
            type="button"
            className="flex-1 py-3 px-5 rounded-full border border-[rgba(255,244,227,0.12)] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[rgba(255,244,227,0.2)] text-[#FFF4E3] text-[13px] font-medium tracking-[0.05em] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="flex-1 py-3 px-5 rounded-full border border-[rgba(234,154,97,0.3)] bg-[rgba(234,154,97,0.12)] hover:bg-[rgba(234,154,97,0.2)] hover:border-[rgba(234,154,97,0.5)] text-[#EA9A61] text-[13px] font-semibold tracking-[0.05em] transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
