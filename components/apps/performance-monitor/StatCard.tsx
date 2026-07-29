"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import type { MetricSeries } from "./usePerformanceStats";

interface StatCardProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  metric: MetricSeries;
  unit?: string;
  unsupportedMessage?: string;
  colorClassName?: string;
}

export function StatCard({
  label,
  icon: Icon,
  metric,
  unit = "%",
  unsupportedMessage = "Not exposed by this browser",
  colorClassName = "stroke-cyan-400/80",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border-1)] bg-[var(--surface-1)] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-3)]">
          <Icon className="h-3.5 w-3.5" />
          {label}
          {metric.isSimulated && (
            <span className="rounded-full bg-[var(--surface-3)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--text-4)]">
              simulated
            </span>
          )}
        </div>
      </div>

      {metric.isSupported ? (
        <>
          <p className="mt-1 text-2xl font-semibold text-[var(--text-1)]">
            {metric.current}
            <span className="ml-0.5 text-sm font-normal text-[var(--text-4)]">{unit}</span>
          </p>
          <Sparkline
            data={metric.history}
            className={cn("mt-2 h-8 w-full", colorClassName === "stroke-cyan-400/80" ? "" : "")}
            strokeClassName={colorClassName}
          />
        </>
      ) : (
        <p className="mt-2 text-xs text-[var(--text-4)]">{unsupportedMessage}</p>
      )}
    </div>
  );
}
