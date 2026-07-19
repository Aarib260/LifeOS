import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-1)] bg-[var(--landing-nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-[var(--landing-heading)]">
          LifeOS
        </span>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#EA7C5C]/15 px-4 py-2 text-sm font-medium text-[#EA7C5C] transition-colors hover:bg-[#EA7C5C]/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}