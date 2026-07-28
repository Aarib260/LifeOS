"use client";

import { X } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { APP_REGISTRY } from "@/lib/appRegistry";

/** Deterministic per-window fake memory figure — stable across renders, not random flicker. */
function fakeMemoryMB(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return 40 + (hash % 260);
}

function fakePid(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 17 + seed.charCodeAt(i)) >>> 0;
  return 1000 + (hash % 8000);
}

export function ProcessList() {
  const windows = useWindowStore((s) => s.windows);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  if (windows.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-1)] bg-[var(--surface-1)] p-6 text-center text-sm text-[var(--text-4)]">
        No apps are currently running.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-1)]">
      <table className="w-full border-collapse text-[13px]">
        <thead className="bg-[var(--surface-1)] text-xs text-[var(--text-4)]">
          <tr className="border-b border-[var(--border-1)]">
            <th className="px-3 py-2 text-left font-medium">Process</th>
            <th className="px-3 py-2 text-left font-medium">PID</th>
            <th className="px-3 py-2 text-left font-medium">Memory</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {windows.map((win) => {
            const app = APP_REGISTRY[win.appId];
            const Icon = app?.icon;
            return (
              <tr key={win.id} className="border-b border-[var(--border-1)] last:border-0 hover:bg-[var(--surface-1)]">
                <td className="flex items-center gap-2 px-3 py-2">
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-[var(--icon-accent)]" />}
                  <span className="truncate text-[var(--text-1)]">{win.title}</span>
                  {win.isMinimized && (
                    <span className="rounded-full bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] text-[var(--text-4)]">
                      minimized
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-[var(--text-3)]">{fakePid(win.id)}</td>
                <td className="px-3 py-2 text-[var(--text-3)]">
                  {fakeMemoryMB(win.id)} MB
                  <span className="ml-1 text-[10px] text-[var(--text-4)]">(simulated)</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => closeWindow(win.id)}
                    title="End Task"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" />
                    End Task
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
