"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Is LifeOS free and open source?",
    answer:
      "Yes. The full source is on GitHub under the MIT license, so you're free to read, fork, or self-host it.",
  },
  {
    question: "Where does my data live?",
    answer:
      "LifeOS stores your data in Neon Postgres and handles authentication with Auth.js. If you self-host, that's your own database — nothing routes through a third party you don't control.",
  },
  {
    question: "What's it built with?",
    answer:
      "Next.js, TypeScript, Tailwind CSS and Framer Motion on the front end, with Zustand and TanStack Query for state, backed by Neon Postgres.",
  },
  {
    question: "Can I run this myself instead of using a hosted version?",
    answer:
      "Yes. Clone the repository, set your own environment variables, and deploy it to Vercel or run it locally.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
      >
        <span className="text-base font-medium text-white sm:text-lg">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 leading-7 text-white/55">{answer}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative bg-black px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            FAQ
          </span>

          <h2 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Questions, answered.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
