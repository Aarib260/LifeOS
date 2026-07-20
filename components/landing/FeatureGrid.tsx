import { APP_LIST } from "@/lib/appRegistry";
import type { AppId } from "@/types";
import { DotPattern } from "./DotPattern";

/**
 * Marketing copy lives here, separate from AppDefinition in the shell's
 * registry — these descriptions are landing-page-specific, not shell
 * metadata, so they don't belong on the type every window-manager
 * component reads from.
 */
const FEATURE_DESCRIPTIONS: Record<AppId, string> = {
  tasks: "Create, organize, and track to-dos with priorities and due dates.",
  habits: "Build streaks that respect your actual schedule, not just a calendar grid.",
  goals: "Break big goals into milestones and watch progress add up.",
  calendar: "A real month view plus an upcoming-events sidebar, always in sync.",
  journal: "Rich-text daily entries — bold, italic, lists — autosaved as you type.",
  "ai-assistant": "Ask about your tasks, habits, goals, or events — it actually knows.",
  settings: "Wallpapers, icon sizes, glass effects — make it feel like yours.",
};

export function FeatureGrid() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      <DotPattern fadeDirection="none" className="top-0 h-64 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--landing-heading)] sm:text-3xl">
            Everything included. Nothing to configure.
          </h2>
          <p className="mt-2 text-sm text-[var(--text-4)]">
            Seven apps, one shell, all backed by a real database.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APP_LIST.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                className="rounded-xl border border-[var(--border-2)] bg-black/20 p-5 transition-colors hover:border-[var(--border-3)]"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-3)]">
                  <Icon className="h-4.5 w-4.5 text-[var(--landing-accent)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--text-1)]">{app.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-4)]">
                  {FEATURE_DESCRIPTIONS[app.id]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
