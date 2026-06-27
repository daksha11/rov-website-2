"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/brand-kit/ui/button";
import { MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1B0E2E] border-[rgba(240,230,224,0.15)] text-[#F0E6E0]">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-16 h-16 rounded-full bg-[rgba(227,194,74,0.1)] flex items-center justify-center border border-[rgba(227,194,74,0.2)]">
            <AlertCircle className="size-8 text-[#E3C24A]" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-[#F0E6E0]">
              Point Limit Reached
            </DialogTitle>
            <DialogDescription className="text-[#F0E6E0]/70 text-base leading-relaxed">
              {`You've used all your points. To continue generating premium brand kits, please contact our support team to refill your credits.`}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 border-[rgba(240,230,224,0.2)] text-[#F0E6E0] hover:bg-[rgba(240,230,224,0.05)]"
          >
            Cancel
          </Button>
          <Button asChild className="w-full sm:flex-1 shadow-[0_4px_20px_rgba(36,18,58,0.5)]">
            <Link href="/contact">
              <MessageSquare className="size-4" />
              Contact Support
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
