"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { DotPattern } from "@/components/landing/DotPattern";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create account");
      setIsPending(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setIsPending(false);

    if (result?.error) {
      setError("Account created, but sign-in failed. Try logging in.");
      return;
    }

    router.push("/os");
  };

  return (
    <div className="flex min-h-screen bg-[var(--landing-bg)]">
      {/* Decorative dot panel — hidden on small screens */}
      <div className="relative hidden w-[42%] shrink-0 overflow-hidden border-r border-[var(--border-1)] bg-[var(--landing-panel)] lg:block">
        <DotPattern fadeDirection="toRight" className="opacity-80" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <span className="text-sm font-semibold tracking-tight text-[var(--landing-heading)]">LifeOS</span>
          <div>
            <p className="max-w-xs text-2xl font-semibold leading-snug text-[var(--landing-heading)]">
              Your life, organized like an operating system.
            </p>
            <p className="mt-3 max-w-xs text-sm text-[var(--text-4)]">
              Tasks, habits, goals, calendar, journal, and AI — one shell, free forever.
            </p>
          </div>
          <span className="text-xs text-[var(--text-5)]">Built by a Hack Club member.</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--landing-accent)]/80">
            Account Info
          </p>
          <h1 className="mb-1 text-2xl font-semibold text-[var(--landing-heading)]">Create your account</h1>
          <p className="mb-8 text-sm text-[var(--text-4)]">Free forever. No credit card.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Name</label>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2.5">
                <User className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-5)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">
                Email Address <span className="text-[var(--landing-accent)]">*</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-5)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">
                Password <span className="text-[var(--landing-accent)]">*</span>
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2.5">
                <Lock className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-transparent text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-5)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="shrink-0 text-[var(--text-4)] hover:text-[var(--text-3)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-300/80">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 rounded-full bg-[var(--landing-accent)] py-3 text-sm font-semibold text-[var(--landing-accent-text)] transition-colors hover:bg-[var(--landing-accent-hover)] disabled:opacity-50"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--text-4)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--landing-accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
