"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Wifi, BatteryFull, Check } from "lucide-react";
import { APP_REGISTRY } from "@/lib/appRegistry";

// Curated subset of the real app registry, in dock order — if an app is
// renamed or its icon changes in appRegistry.ts, this dock follows it
// automatically instead of drifting out of sync.
const DOCK_APP_IDS = [
  "tasks",
  "calendar",
  "journal",
  "terminal",
  "file-explorer",
  "app-store",
  "settings",
] as const;

const TASKS = [
  { label: "OS Development", done: true },
  { label: "Read Research Paper", done: true },
  { label: "Gym", done: true },
  { label: "Work on Project", done: false },
  { label: "Learn Cybersecurity", done: false },
];

const TERMINAL_LINES = [
  { prompt: true, text: "ls ~/projects" },
  { prompt: false, text: "LifeOS  QRForge  PhishGuard" },
  { prompt: true, text: "cat notes.md" },
  { prompt: false, text: "# Ship the file explorer today" },
];

/**
 * A styled illustration of the LifeOS desktop, not a live screenshot or
 * iframe. The dock icons and app names below are pulled straight from
 * lib/appRegistry.ts, so this stays honest about which apps actually
 * ship — but the window contents (task list, terminal lines, date) are
 * still illustrative sample data, not real app state. Swap this for an
 * actual screen recording or screenshot once you have a desktop state
 * you're happy freezing in time; that will outperform this illustration.
 */
export function OSPreviewMockup() {
  const completedCount = TASKS.filter((t) => t.done).length;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-5xl"
    >
      {/* Laptop bezel */}
      <div className="relative rounded-t-2xl border border-white/10 bg-[#0b0d12] p-3 pb-0 shadow-2xl">
        <div className="absolute left-1/2 top-3 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-black" />

        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-[#05060a]">
          <WavyBackdrop />

          {/* Top status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-3 px-6 py-4 text-xs text-white/70">
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-4 w-4" />
            <span>Mon 12:30</span>
          </div>

          {/* Sidebar icon dock — real apps from the registry */}
          <div className="absolute left-6 top-16 flex flex-col gap-3">
            {DOCK_APP_IDS.map((id) => {
              const Icon = APP_REGISTRY[id].icon;
              return (
                <div
                  key={id}
                  title={APP_REGISTRY[id].title}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
              );
            })}
          </div>

          {/* Terminal snippet card */}
          <div className="absolute bottom-6 left-6 w-64 rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/80" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
              <div className="h-2 w-2 rounded-full bg-green-500/80" />
            </div>
            <div className="space-y-1">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} className={line.prompt ? "text-violet-300" : "text-white/50"}>
                  {line.prompt ? "$ " : ""}
                  {line.text}
                </div>
              ))}
              <div className="text-violet-300">
                $ <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* Date card */}
          <div className="absolute right-6 top-16 w-56 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
            <p className="text-xs text-white/50">Monday</p>
            <p className="text-2xl font-bold text-white">Jul 22</p>
            <p className="mt-1 text-xs text-white/50">Stay consistent.</p>
          </div>

          {/* Tasks card */}
          <div className="absolute right-6 top-[168px] w-56 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-white/70">Today</p>
              <p className="text-xs text-white/55">
                {completedCount}/{TASKS.length}
              </p>
            </div>
            <div className="space-y-2">
              {TASKS.map((task) => (
                <div key={task.label} className="flex items-center gap-2">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      task.done ? "border-violet-400 bg-violet-500" : "border-white/25"
                    }`}
                  >
                    {task.done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-xs ${task.done ? "text-white/55 line-through" : "text-white/70"}`}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto h-3 w-[92%] rounded-b-2xl bg-gradient-to-b from-[#0b0d12] to-[#05060a]" />
    </motion.div>
  );
}

function WavyBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[#0a0c14]" />
      <div
        className="absolute -bottom-24 left-1/2 h-64 w-[140%] -translate-x-1/2 rounded-[100%] opacity-60 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.35), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-56 w-[120%] -translate-x-1/2 rounded-[100%] opacity-50 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(129,140,248,0.3), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-10 right-0 h-40 w-2/3 rounded-[100%] opacity-40 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.25), transparent 70%)" }}
      />
    </div>
  );
}
