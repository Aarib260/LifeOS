import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0A0E14]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-white">LifeOS</span>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/60 transition-colors hover:text-white/90"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-400/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}