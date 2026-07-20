"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { DotPattern } from "@/components/landing/DotPattern";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    setIsPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/os");
  };

  return (
    <div className="flex min-h-screen bg-[var(--landing-bg)]">
      <div className="relative hidden w-[42%] shrink-0 overflow-hidden border-r border-[var(--border-1)] bg-[var(--landing-panel)] lg:block">
        <DotPattern fadeDirection="toRight" className="opacity-80" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <span className="text-sm font-semibold tracking-tight text-[var(--landing-heading)]">LifeOS</span>
          <div>
            <p className="max-w-xs text-2xl font-semibold leading-snug text-[var(--landing-heading)]">
              Welcome back to your desktop.
            </p>
          </div>
          <span className="text-xs text-[var(--text-5)]">Built by a Hack Club member.</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--landing-accent)]/80">
            Sign In
          </p>
          <h1 className="mb-1 text-2xl font-semibold text-[var(--landing-heading)]">Welcome back</h1>
          <p className="mb-8 text-sm text-[var(--text-4)]">Sign in to your LifeOS</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">
                Email Address
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
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-3)]">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] px-3 py-2.5">
                <Lock className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
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
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--text-4)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--landing-accent)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
