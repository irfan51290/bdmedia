"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const passwordStrength = getPasswordStrength(password);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    });
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="neu-card rounded-sm bg-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <span className="w-12 h-12 bg-brand-mint border-[3px] border-black rounded-sm shadow-[3px_3px_0_#000] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-black" />
            </span>
          </div>
          <h2 className="text-xl font-extrabold">Confirm your email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a confirmation link to{" "}
            <strong className="text-foreground">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-sm font-extrabold underline underline-offset-2 hover:text-brand-teal transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="neu-card rounded-sm bg-card p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Free forever. No credit card needed.
          </p>
        </div>

        {error && (
          <div className="neu-card-sm rounded-sm bg-brand-coral/10 border-brand-coral p-3 flex items-start gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
            <p className="text-sm text-brand-coral font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs font-bold uppercase tracking-widest">
              Full name
            </Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="border-[3px] border-black rounded-sm shadow-[2px_2px_0_#000] focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all duration-100 h-11"
            />
          </div>

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
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full border border-black transition-colors duration-200 ${
                      passwordStrength.score >= level
                        ? passwordStrength.color
                        : "bg-muted"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1 font-medium">
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 neu-btn bg-brand-teal text-white font-extrabold rounded-sm text-sm border-black mt-2 cursor-pointer"
          >
            {isPending ? (
              "Creating account…"
            ) : (
              <>
                Get started
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm mt-5 font-medium">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-extrabold underline underline-offset-2 hover:text-brand-teal transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (password.length === 0) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak",   color: "bg-brand-coral" },
    { label: "Fair",   color: "bg-brand-orange" },
    { label: "Good",   color: "bg-brand-yellow" },
    { label: "Strong", color: "bg-brand-mint" },
  ];

  return { score, ...levels[score - 1] ?? levels[0] };
}
