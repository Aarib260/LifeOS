import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border-2)] bg-gradient-to-br from-[var(--landing-accent)]/[0.08] to-[var(--text-1)]/[0.03] p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--landing-heading)] sm:text-3xl">
          Ready to organize your life?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-3)]">
          Free forever. No credit card. Your desktop is one click away.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-full bg-[var(--landing-accent)] px-6 py-3 text-sm font-semibold text-[var(--landing-accent-text)] transition-colors hover:bg-[var(--landing-accent-hover)]"
        >
          Create your free account
        </Link>
      </div>
    </section>
  );
}