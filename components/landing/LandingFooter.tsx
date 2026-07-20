export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-1)] px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
        <span className="text-sm font-medium text-[var(--text-2)]">LifeOS</span>
        <p className="text-xs text-[var(--text-4)]">
          A browser-based personal operating system. Built by a Hack Club member.
        </p>
      </div>
    </footer>
  );
}
