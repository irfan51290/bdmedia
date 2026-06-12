"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendPasswordReset } from "@/app/(dashboard)/settings/actions";
import { createClient } from "@/lib/supabase/client";
import { Mail, LogOut, KeyRound, Check } from "lucide-react";

interface AccountSectionProps {
  email: string;
}

export function AccountSection({ email }: AccountSectionProps) {
  const [resetSent, setResetSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handlePasswordReset() {
    startTransition(async () => {
      await sendPasswordReset(email);
      setResetSent(true);
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="space-y-3">
      {/* Email */}
      <div className="flex items-center gap-3 p-3 rounded-sm border-[2px] border-black/10 bg-muted/30">
        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email
          </p>
          <p className="text-sm font-semibold truncate">{email}</p>
        </div>
      </div>

      {/* Change password */}
      <button
        onClick={handlePasswordReset}
        disabled={isPending || resetSent}
        className="w-full flex items-center gap-3 p-3 rounded-sm border-[2px] border-black/10 hover:border-black bg-card cursor-pointer transition-all duration-100 disabled:opacity-60 disabled:cursor-not-allowed text-left"
      >
        {resetSent ? (
          <Check className="w-4 h-4 text-green-600 shrink-0" />
        ) : (
          <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {resetSent ? "Reset link sent!" : "Change password"}
          </p>
          <p className="text-xs text-muted-foreground">
            {resetSent
              ? `Check ${email}`
              : "We'll email you a reset link"}
          </p>
        </div>
      </button>

      {/* Sign out */}
      <Button
        onClick={handleSignOut}
        className="w-full neu-btn bg-card text-foreground font-bold rounded-sm h-10 border-[2px] border-black cursor-pointer flex items-center gap-2 justify-start px-3 hover:bg-brand-coral hover:text-white transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </div>
  );
}
