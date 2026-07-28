"use client";

import { useEffect, useRef, useState } from "react";

const HISTORY_LENGTH = 30;

export interface MetricSeries {
  current: number;
  history: number[];
  isSimulated: boolean;
  isSupported: boolean;
}

export interface NetworkInfo {
  effectiveType: string | null;
  downlinkMbps: number | null;
  rttMs: number | null;
  isSupported: boolean;
}

export interface StorageInfo {
  usageBytes: number;
  quotaBytes: number;
  isSupported: boolean;
}

export interface PerformanceStats {
  fps: MetricSeries;
  mainThreadLoad: MetricSeries;
  jsHeap: MetricSeries & { usedMB: number; totalMB: number };
  gpuLoad: MetricSeries;
  networkThroughput: MetricSeries;
  network: NetworkInfo;
  storage: StorageInfo;
}

function pushHistory(history: number[], value: number): number[] {
  const next = [...history, value];
  return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
}

/**
 * Real metrics: FPS (measured directly), main-thread load (Long Tasks API
 * when supported, else derived from FPS dips — both are genuine signals,
 * not fabricated), JS heap (Chrome's non-standard performance.memory),
 * browser storage (navigator.storage.estimate), and network connection
 * info (Network Information API, Chrome/Edge only).
 *
 * Simulated: GPU load (no browser API exposes this at all) and network
 * *throughput* specifically (real bandwidth usage isn't observable from
 * a page) — both are smooth random walks, clearly flagged via
 * `isSimulated` so the UI can label them rather than presenting fake
 * numbers as real telemetry.
 */
export function usePerformanceStats(): PerformanceStats {
  const [fps, setFps] = useState<MetricSeries>({ current: 60, history: [], isSimulated: false, isSupported: true });
  const [mainThreadLoad, setMainThreadLoad] = useState<MetricSeries>({
    current: 0,
    history: [],
    isSimulated: false,
    isSupported: true,
  });
  const [jsHeap, setJsHeap] = useState<PerformanceStats["jsHeap"]>({
    current: 0,
    history: [],
    isSimulated: false,
    isSupported: typeof performance !== "undefined" && "memory" in performance,
    usedMB: 0,
    totalMB: 0,
  });
  const [gpuLoad, setGpuLoad] = useState<MetricSeries>({ current: 20, history: [], isSimulated: true, isSupported: true });
  const [networkThroughput, setNetworkThroughput] = useState<MetricSeries>({
    current: 0,
    history: [],
    isSimulated: true,
    isSupported: true,
  });
  const [network, setNetwork] = useState<NetworkInfo>({
    effectiveType: null,
    downlinkMbps: null,
    rttMs: null,
    isSupported: false,
  });
  const [storage, setStorage] = useState<StorageInfo>({ usageBytes: 0, quotaBytes: 0, isSupported: false });

  // --- FPS + long-task-derived main thread load, via rAF loop ---
  useEffect(() => {
    let frameCount = 0;
    let lastSampleTime = performance.now();
    let rafId: number;
    let longTaskBusyMs = 0;

    let longTaskObserver: PerformanceObserver | null = null;
    try {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTaskBusyMs += entry.duration;
        }
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    } catch {
      // Long Tasks API unsupported (Firefox, Safari) — fall back to
      // FPS-derived load estimate below, which works everywhere.
      longTaskObserver = null;
    }

    function tick() {
      frameCount += 1;
      const now = performance.now();
      const elapsed = now - lastSampleTime;

      if (elapsed >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / elapsed);
        setFps((s) => ({ ...s, current: measuredFps, history: pushHistory(s.history, measuredFps) }));

        const load = longTaskObserver
          ? Math.min(100, Math.round((longTaskBusyMs / elapsed) * 100))
          : Math.max(0, Math.round(((60 - Math.min(measuredFps, 60)) / 60) * 100));

        setMainThreadLoad((s) => ({
          ...s,
          current: load,
          isSimulated: false,
          history: pushHistory(s.history, load),
        }));

        frameCount = 0;
        longTaskBusyMs = 0;
        lastSampleTime = now;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      longTaskObserver?.disconnect();
    };
  }, []);

  // --- JS heap (Chrome-only) ---
  useEffect(() => {
    if (!("memory" in performance)) return;

    const interval = setInterval(() => {
      const mem = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      const usedMB = mem.usedJSHeapSize / (1024 * 1024);
      const totalMB = mem.totalJSHeapSize / (1024 * 1024);
      const pct = totalMB > 0 ? Math.round((usedMB / totalMB) * 100) : 0;
      setJsHeap((s) => ({
        ...s,
        current: pct,
        usedMB,
        totalMB,
        history: pushHistory(s.history, pct),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Network Information API (Chrome/Edge only) ---
  useEffect(() => {
    const conn = (navigator as unknown as { connection?: EventTarget & Record<string, unknown> }).connection;
    if (!conn) return;

    function readConnection() {
      const c = conn as unknown as { effectiveType?: string; downlink?: number; rtt?: number };
      setNetwork({
        effectiveType: c.effectiveType ?? null,
        downlinkMbps: c.downlink ?? null,
        rttMs: c.rtt ?? null,
        isSupported: true,
      });
    }

    readConnection();
    conn.addEventListener("change", readConnection);
    return () => conn.removeEventListener("change", readConnection);
  }, []);

  // --- Storage estimate (widely supported) ---
  useEffect(() => {
    if (!navigator.storage?.estimate) return;

    let cancelled = false;
    async function poll() {
      const estimate = await navigator.storage.estimate();
      if (cancelled) return;
      setStorage({
        usageBytes: estimate.usage ?? 0,
        quotaBytes: estimate.quota ?? 0,
        isSupported: true,
      });
    }

    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // --- Simulated GPU load + network throughput (smooth random walk) ---
  const gpuRef = useRef(20);
  const netRef = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      gpuRef.current = Math.max(2, Math.min(95, gpuRef.current + (Math.random() - 0.5) * 14));
      netRef.current = Math.max(0, Math.min(100, netRef.current + (Math.random() - 0.45) * 30));

      const gpuVal = Math.round(gpuRef.current);
      const netVal = Math.round(netRef.current);

      setGpuLoad((s) => ({ ...s, current: gpuVal, history: pushHistory(s.history, gpuVal) }));
      setNetworkThroughput((s) => ({ ...s, current: netVal, history: pushHistory(s.history, netVal) }));
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return { fps, mainThreadLoad, jsHeap, gpuLoad, networkThroughput, network, storage };
}
