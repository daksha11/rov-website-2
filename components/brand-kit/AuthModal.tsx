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
import { LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1F0F08] border-[rgba(208,190,165,0.15)] text-[#FFF4E3]">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-16 h-16 rounded-full bg-[rgba(208,190,165,0.1)] flex items-center justify-center border border-[rgba(208,190,165,0.2)]">
            <LogIn className="size-8 text-[#D0BEA5]" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-[#FFF4E3]">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="text-[#D0BEA5]/70 text-base leading-relaxed">
              Please sign in with Google to download your brand kit and manage your credits.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 border-[rgba(208,190,165,0.2)] text-[#D0BEA5] hover:bg-[rgba(208,190,165,0.05)]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGoogleLogin}
            className="w-full sm:flex-1 shadow-[0_4px_20px_rgba(59,33,20,0.5)] bg-[#D0BEA5] text-[#3B2114] hover:bg-[#FFF4E3]"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
