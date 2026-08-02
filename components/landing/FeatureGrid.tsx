"use client";

import { APP_LIST } from "@/lib/appRegistry";
import type { AppId } from "@/types";
import { DotPattern } from "./DotPattern";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import { useRef } from "react";

const FEATURE_DESCRIPTIONS: Record<AppId, string> = {
  tasks:
    "Create, organize and complete work with priorities, due dates and categories.",

  habits:
    "Build routines that fit your schedule while keeping your streaks alive.",

  goals:
    "Turn ambitious goals into achievable milestones and monitor progress.",

  calendar:
    "Keep events, deadlines and reminders synchronized across LifeOS.",

  journal:
    "Capture thoughts with a beautiful markdown editor that saves instantly.",

  "ai-assistant":
    "An assistant that understands your tasks, habits, goals and calendar.",

  settings:
    "Personalize wallpapers, glass effects, icons and every part of LifeOS.",

  terminal:
    "A real shell in your browser — navigate, run commands and script your way around the OS.",

  "file-explorer":
    "Browse, move and organize files in a virtual file system with a familiar drag-and-drop explorer.",

  "app-store":
    "Discover and install new apps as LifeOS grows past what ships on day one.",

  "file-viewer": "",

  "performance-monitor":
    "Keep an eye on how your OS is running under the hood, in real time.",
};

const APP_MAP = Object.fromEntries(APP_LIST.map((app) => [app.id, app])) as Record<
  AppId,
  (typeof APP_LIST)[number]
>;

const SECTIONS = [
  {
    title: "Stay Productive",
    subtitle:
      "Everything you need to plan your day without switching between apps.",

    apps: ["tasks", "calendar"] as AppId[],
  },

  {
    title: "Build Better Habits",
    subtitle:
      "Track routines, celebrate streaks and make meaningful progress.",

    apps: ["habits", "goals"] as AppId[],
  },

  {
    title: "Capture Everything",
    subtitle:
      "Write ideas, keep notes and let AI organize your digital life.",

    apps: ["journal", "ai-assistant"] as AppId[],
  },

  {
    title: "Command Your System",
    subtitle:
      "A real virtual file system and shell, right in the browser — not just app windows.",

    apps: ["terminal", "file-explorer"] as AppId[],
  },
  {
    title: "Make It Yours",
    subtitle:
      "Customize the OS and grow it over time with more apps.",

    apps: ["settings", "app-store"] as AppId[],
  },
];

type CardProps = {
  section: (typeof SECTIONS)[number];
  index: number;
};

function FeatureCard({ section, index }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [0.9, 1, 1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [0.2, 1, 1, 0.3]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [120, -120]
  );

  return (
    <div
      ref={ref}
      className="relative h-[120vh] md:h-[150vh]"
    >
      <motion.div
        style={{
          scale,
          opacity,
          y,
        }}
        className="sticky top-20 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-[0_40px_120px_rgba(0,0,0,.45)] md:top-28 md:rounded-[36px]"
      ><div className="grid min-h-[85vh] grid-cols-1 gap-10 p-8 sm:p-14 lg:grid-cols-2 lg:gap-16 lg:p-20">

  {/* LEFT */}

  <div className="flex flex-col justify-center">

    <span className="mb-6 w-fit rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-violet-300">
      {String(index + 1).padStart(2, "0")}
    </span>

    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .6 }}
      className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
    >
      {section.title}
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: .1 }}
      viewport={{ once: true }}
      className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:mt-8 sm:text-lg sm:leading-8"
    >
      {section.subtitle}
    </motion.p>

    <div className="mt-12 space-y-5">

      {section.apps.map((id) => {

        const app = APP_MAP[id];

        const Icon = app.icon;

        return (

          <motion.div
            key={id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .45 }}
            viewport={{ once: true }}
            className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]"
          >

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

              <Icon className="h-6 w-6 text-violet-300"/>

            </div>

            <div>

              <h3 className="text-lg font-semibold text-white">

                {app.title}

              </h3>

              <p className="mt-2 text-sm leading-7 text-white/50">

                {FEATURE_DESCRIPTIONS[id]}

              </p>

            </div>

          </motion.div>

        );

      })}

    </div>

  </div>

  {/* RIGHT */}

  <motion.div

    initial={{ opacity: 0, scale: .95 }}

    whileInView={{ opacity: 1, scale: 1 }}

    viewport={{ once: true }}

    transition={{ duration: .6 }}

    className="relative flex items-center justify-center"

  >

    <div className="relative h-[340px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#111] via-[#0b0b0b] to-black shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:h-[420px] lg:h-[520px]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,.18),transparent_60%)]" />

      <div className="absolute left-6 right-6 top-6 flex items-center gap-2">

        <div className="h-3 w-3 rounded-full bg-red-500" />

        <div className="h-3 w-3 rounded-full bg-yellow-500" />

        <div className="h-3 w-3 rounded-full bg-green-500" />

      </div>

      {section.title === "Command Your System" ? (
        <div className="absolute left-8 right-8 top-24 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-[13px]">
            <div className="mb-3 flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-white/55">terminal</span>
            </div>
            <div className="space-y-1.5">
              <div className="text-violet-300">$ cd ~/projects/lifeos</div>
              <div className="text-violet-300">$ ls -la</div>
              <div className="text-white/55">drwxr-xr-x  app</div>
              <div className="text-white/55">drwxr-xr-x  components</div>
              <div className="text-white/55">-rw-r--r--  package.json</div>
              <div className="text-violet-300">
                $ <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-2 text-xs uppercase tracking-widest text-white/55">
              File Explorer
            </div>
            <div className="space-y-1.5 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="text-violet-300">📁</span> Documents
              </div>
              <div className="ml-4 flex items-center gap-2">
                <span className="text-white/55">📄</span> resume.md
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-300">📁</span> Projects
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute left-8 right-8 top-24 space-y-5">

        {section.apps.map((id) => {

          const app = APP_MAP[id];

          const Icon = app.icon;

          return (

            <motion.div

              key={id}

              whileHover={{ scale: 1.02 }}

              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"

            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">

                <Icon className="h-6 w-6 text-violet-300"/>

              </div>

              <div>

                <div className="text-lg font-semibold text-white">

                  {app.title}

                </div>

                <div className="mt-1 text-sm text-white/55">

                  Ready to launch

                </div>

              </div>

            </motion.div>

          );

        })}

        </div>
      )}

    </div>

  </motion.div>

</div>      </motion.div>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-black px-6 py-32"
    >
      <DotPattern
        fadeDirection="none"
        className="pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mx-auto mb-28 max-w-3xl text-center"
        >

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">

            Features

          </span>

          <h2 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">

            Everything you need.

            <br />

            Nothing you don't.

          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/55">

            LifeOS combines productivity, organization,
            journaling, planning and AI into one beautiful
            operating system experience.

          </p>

        </motion.div>

        {/* Sections */}

        <div className="space-y-56">

          {SECTIONS.map((section, index) => (

            <FeatureCard

              key={section.title}

              section={section}

              index={index}

            />

          ))}

        </div>

      </div>
    </section>
  );
}
      