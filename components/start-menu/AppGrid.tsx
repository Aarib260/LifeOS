"use client";

import type { AppDefinition, AppId } from "@/types";

interface AppGridProps {
  apps: AppDefinition[];
  onLaunch: (appId: AppId) => void;
}

export function AppGrid({ apps, onLaunch }: AppGridProps) {
  if (apps.length === 0) {
    return (
      <p className="py-8 text-center text-xs text-[var(--text-4)]">No apps match your search</p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-1">
      {apps.map((app) => {
        const Icon = app.icon;
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onLaunch(app.id)}
            className="flex flex-col items-center gap-1.5 rounded-lg p-2.5 text-center transition-colors hover:bg-[var(--surface-2)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--surface-2)]">
              <Icon className="h-5 w-5 text-cyan-100/90" />
            </div>
            <span className="line-clamp-2 text-[11px] leading-tight text-[var(--text-2)]">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
