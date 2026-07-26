"use client";

import { Star, Download, Check, Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogApp } from "@/lib/appStoreCatalog";
import { useAppStoreStore } from "@/store/appStoreStore";

interface AppCardProps {
  app: CatalogApp;
  variant?: "grid" | "featured";
}

export function AppCard({ app, variant = "grid" }: AppCardProps) {
  const installedIds = useAppStoreStore((s) => s.installedIds);
  const updatesAvailable = useAppStoreStore((s) => s.updatesAvailable);
  const installingId = useAppStoreStore((s) => s.installingId);
  const install = useAppStoreStore((s) => s.install);
  const uninstall = useAppStoreStore((s) => s.uninstall);
  const applyUpdate = useAppStoreStore((s) => s.applyUpdate);

  const isInstalled = installedIds.includes(app.id);
  const isInstalling = installingId === app.id;
  const hasUpdate = updatesAvailable.includes(app.id);
  const Icon = app.icon;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-[var(--border-2)] bg-[var(--surface-1)] p-3",
        variant === "featured" && "w-64 shrink-0"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--surface-2)]">
          <Icon className="h-6 w-6 text-[var(--icon-accent)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-[var(--text-1)]">{app.name}</p>
          <p className="truncate text-[11px] text-[var(--text-4)]">{app.developer}</p>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--text-3)]">
            <Star className="h-3 w-3 fill-current text-amber-400" />
            {app.rating.toFixed(1)}
            <span className="text-[var(--text-4)]">· {app.sizeLabel}</span>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-[12px] leading-snug text-[var(--text-3)]">{app.description}</p>

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[var(--border-2)] px-2 py-0.5 text-[10px] text-[var(--text-4)]">
          {app.category}
        </span>

        {isInstalling ? (
          <div className="flex h-7 w-24 items-center justify-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/10 text-[10px] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Installing…
          </div>
        ) : hasUpdate ? (
          <button
            type="button"
            onClick={() => applyUpdate(app.id)}
            className="flex items-center gap-1 rounded-md bg-cyan-500/20 px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/30"
          >
            <RefreshCw className="h-3 w-3" />
            Update
          </button>
        ) : isInstalled ? (
          <button
            type="button"
            onClick={() => uninstall(app.id)}
            className="flex items-center gap-1 rounded-md border border-[var(--border-2)] px-2.5 py-1 text-[11px] text-[var(--text-2)] hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
            Uninstall
          </button>
        ) : (
          <button
            type="button"
            onClick={() => install(app.id)}
            className="flex items-center gap-1 rounded-md bg-[var(--surface-3)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-1)] hover:bg-cyan-500/20 hover:text-cyan-300"
          >
            <Download className="h-3 w-3" />
            Install
          </button>
        )}
      </div>

      {isInstalled && !hasUpdate && !isInstalling && (
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <Check className="h-3 w-3" />
          Installed
        </div>
      )}
    </div>
  );
}
