"use client";

import { Activity, Cpu, MemoryStick, MonitorSmartphone, Wifi, HardDrive, ListTree } from "lucide-react";
import { usePerformanceStats } from "./usePerformanceStats";
import { StatCard } from "./StatCard";
import { ProcessList } from "./ProcessList";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function PerformanceMonitorApp() {
  const stats = usePerformanceStats();
  const storagePct =
    stats.storage.isSupported && stats.storage.quotaBytes > 0
      ? Math.min(100, Math.round((stats.storage.usageBytes / stats.storage.quotaBytes) * 100))
      : 0;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="FPS" icon={Activity} metric={stats.fps} unit="fps" colorClassName="stroke-emerald-400/80" />
        <StatCard
          label="Main Thread"
          icon={Cpu}
          metric={stats.mainThreadLoad}
          unsupportedMessage="Not available"
          colorClassName="stroke-orange-400/80"
        />
        <StatCard
          label="JS Heap"
          icon={MemoryStick}
          metric={stats.jsHeap}
          unsupportedMessage="Chrome/Edge only"
          colorClassName="stroke-purple-400/80"
        />
        <StatCard
          label="GPU"
          icon={MonitorSmartphone}
          metric={stats.gpuLoad}
          unsupportedMessage="Not available"
          colorClassName="stroke-pink-400/80"
        />
        <StatCard
          label="Network Activity"
          icon={Wifi}
          metric={stats.networkThroughput}
          unsupportedMessage="Not available"
          colorClassName="stroke-cyan-400/80"
        />

        {/* Storage isn't a rolling metric like the others (no sparkline-worthy
            history — usage doesn't fluctuate second to second), so it gets
            its own simple layout instead of forcing it into StatCard. */}
        <div className="rounded-xl border border-[var(--border-1)] bg-[var(--surface-1)] p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-3)]">
            <HardDrive className="h-3.5 w-3.5" />
            Browser Storage
          </div>
          {stats.storage.isSupported ? (
            <>
              <p className="mt-1 text-2xl font-semibold text-[var(--text-1)]">
                {storagePct}
                <span className="ml-0.5 text-sm font-normal text-[var(--text-4)]">%</span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
                <div className="h-full rounded-full bg-cyan-400/70" style={{ width: `${storagePct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-[var(--text-4)]">
                {formatBytes(stats.storage.usageBytes)} of {formatBytes(stats.storage.quotaBytes)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-xs text-[var(--text-4)]">Not available</p>
          )}
        </div>
      </div>

      {/* Network Information API details — separate from the simulated
          throughput sparkline above, since this part is genuinely real
          connection metadata when the browser exposes it. */}
      <div className="rounded-xl border border-[var(--border-1)] bg-[var(--surface-1)] p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-3)]">
          <Wifi className="h-3.5 w-3.5" />
          Connection
        </div>
        {stats.network.isSupported ? (
          <div className="mt-2 flex gap-6 text-xs text-[var(--text-2)]">
            <span>Type: {stats.network.effectiveType ?? "—"}</span>
            <span>Downlink: {stats.network.downlinkMbps ?? "—"} Mbps</span>
            <span>RTT: {stats.network.rttMs ?? "—"} ms</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-[var(--text-4)]">
            Connection details aren't exposed by this browser (Chrome/Edge only).
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-3)]">
          <ListTree className="h-3.5 w-3.5" />
          Running Processes
        </div>
        <ProcessList />
      </div>

      <p className="mt-auto pt-2 text-center text-[10px] text-[var(--text-4)]">
        FPS, Main Thread, JS Heap, Storage, Connection, and Processes reflect real browser data.
        GPU and Network Activity are simulated — browsers don't expose real telemetry for either.
      </p>
    </div>
  );
}
