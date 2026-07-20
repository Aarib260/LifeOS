"use client";

import { useWindowStore } from "@/store/windowStore";
import { APP_REGISTRY } from "@/lib/appRegistry";
import type { AppId } from "@/types";

interface RecentAppsProps {
  onLaunch: (appId: AppId) => void;
}

export function RecentApps({ onLaunch }: RecentAppsProps) {
  const recentAppIds = useWindowStore((s) => s.recentAppIds);

  if (recentAppIds.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-4)]">
        Recent
      </p>
      <div className="flex gap-1">
        {recentAppIds.slice(0, 6).map((appId) => {
          const meta = APP_REGISTRY[appId];
          if (!meta) return null;
          const Icon = meta.icon;
          return (
            <button
              key={appId}
              type="button"
              title={meta.title}
              onClick={() => onLaunch(appId)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-1)] bg-[var(--surface-1)] text-[var(--icon-accent)] transition-colors hover:bg-[var(--surface-3)]"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
