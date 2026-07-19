"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-[#0A0E14] px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-xl font-semibold text-white">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-white/40">Sign in to your LifeOS</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/30"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/30"
          />

          {error && <p className="text-xs text-red-300/80">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 rounded-lg bg-cyan-400 py-2.5 text-sm font-medium text-[#0A0E14] transition-colors hover:bg-cyan-300 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
