"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-32">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,.18),transparent_65%)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-xl"
      >
        {/* Window */}
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,.45)]">

          {/* Window Bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />

            <span className="ml-4 text-sm text-white/50">
              Authentication
            </span>
          </div>

          {/* Content */}
          <div className="p-10">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/10 ring-1 ring-violet-500/20">
                <span className="text-3xl font-black text-violet-300">
                  L
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-bold text-white">
                Welcome Back
              </h2>

              <p className="mt-2 text-white/55">
                Sign in to continue to LifeOS.
              </p>

            </div>

            {/* Fake Inputs — purely decorative illustration of a login
                form, not real fields. aria-hidden so screen readers don't
                announce "Username: yourname" as if it were a real value. */}

            <div aria-hidden className="mt-10 space-y-5">

              <div>
                <p className="mb-2 text-sm text-white/55">
                  Username
                </p>

                <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white/70">
                  yourname
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-white/55">
                  Password
                </p>

                <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 tracking-[0.35em] text-white/60">
                  ••••••••••••
                </div>
              </div>

            </div>

            {/* Button */}

            <Link
              href="/login"
              className="group mt-8 flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Launch LifeOS

              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            {/* Bottom Status */}

            <div aria-hidden className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-400">

              <ShieldCheck className="h-4 w-4" />

              Secure connection • System Ready

            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}