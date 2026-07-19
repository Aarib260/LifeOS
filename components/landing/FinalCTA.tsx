import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/[0.06] to-indigo-400/[0.06] p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ready to organize your life?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
          Free forever. No credit card. Your desktop is one click away.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-lg bg-cyan-400 px-6 py-2.5 text-sm font-medium text-[#0A0E14] transition-colors hover:bg-cyan-300"
        >
          Create your free account
        </Link>
      </div>
    </section>
  );
}