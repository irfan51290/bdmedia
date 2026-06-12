"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError ? "Authentication failed. Please try again." : null
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="neu-card rounded-sm bg-card p-8">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your FreelanceOS account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="neu-card-sm rounded-sm bg-brand-coral/10 border-brand-coral p-3 flex items-start gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
            <p className="text-sm text-brand-coral font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border-[3px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold underline underline-offset-2 hover:text-brand-teal transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="border-[3px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 neu-btn bg-brand-yellow text-black font-extrabold rounded-sm text-sm border-black mt-2 cursor-pointer"
          >
            {isPending ? (
              "Signing in…"
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[2px] bg-black" />
          <span className="text-xs font-bold text-muted-foreground">OR</span>
          <div className="flex-1 h-[2px] bg-black" />
        </div>

        {/* Magic link */}
        <MagicLinkForm email={email} setEmail={setEmail} setError={setError} />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm mt-5 font-medium">
        No account?{" "}
        <Link
          href="/signup"
          className="font-extrabold underline underline-offset-2 hover:text-brand-teal transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}

// ── Magic link form ────────────────────────────────────────────
function MagicLinkForm({
  email,
  setEmail,
  setError,
}: {
  email: string;
  setEmail: (v: string) => void;
  setError: (v: string | null) => void;
}) {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="neu-card-sm rounded-sm bg-brand-mint/20 p-3 text-center">
        <p className="text-sm font-bold">Check your email</p>
        <p className="text-xs text-muted-foreground mt-1">
          Magic link sent to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleMagicLink} className="flex gap-2">
      <Input
        type="email"
        placeholder="Email for magic link"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border-[2px] border-black rounded-sm h-10 text-sm flex-1"
      />
      <Button
        type="submit"
        disabled={isPending}
        className="neu-btn h-10 bg-card text-foreground font-bold rounded-sm text-xs border-black cursor-pointer px-3 shrink-0"
      >
        {isPending ? "…" : "Magic link"}
      </Button>
    </form>
  );
}
