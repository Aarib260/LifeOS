import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#EA7C5C]/[0.08] to-white/[0.03] p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[#F4EEE2] sm:text-3xl">
          Ready to organize your life?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
          Free forever. No credit card. Your desktop is one click away.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-full bg-[#EA7C5C] px-6 py-3 text-sm font-semibold text-[#0A0E14] transition-colors hover:bg-[#F0906F]"
        >
          Create your free account
        </Link>
      </div>
    </section>
  );
}