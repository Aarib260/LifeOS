"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { AppGrid } from "./AppGrid";
import { RecentApps } from "./RecentApps";
import { useWindowStore } from "@/store/windowStore";
import { useSearchHistoryStore } from "@/store/searchHistoryStore";
import { APP_LIST, VISIBLE_APP_LIST, getOpenAppOptions } from "@/lib/appRegistry";
import { TASKBAR_HEIGHT, START_MENU_Z } from "@/lib/constants";
import type { AppId } from "@/types";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [query, setQuery] = useState("");
  const openApp = useWindowStore((s) => s.openApp);
  const recentQueries = useSearchHistoryStore((s) => s.recentQueries);
  const addQuery = useSearchHistoryStore((s) => s.addQuery);

  const filteredApps = useMemo(() => {
    if (!query.trim()) return VISIBLE_APP_LIST;
    const q = query.toLowerCase();
    return VISIBLE_APP_LIST.filter((app) => app.title.toLowerCase().includes(q));
  }, [query]);

  const handleLaunch = (appId: AppId) => {
    if (query.trim()) addQuery(query);
    const app = APP_LIST.find((a) => a.id === appId);
    openApp(appId, app ? getOpenAppOptions(appId) : { title: appId });
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click outside to close */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: START_MENU_Z - 1 }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed left-1/2 flex w-[420px] max-w-[92vw] -translate-x-1/2 flex-col rounded-2xl border border-[var(--border-2)] bg-[var(--bg-panel-95)] p-4 shadow-2xl backdrop-blur-xl"
            style={{ bottom: TASKBAR_HEIGHT + 12, zIndex: START_MENU_Z }}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            <div className="mb-3">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            {!query && <RecentApps onLaunch={handleLaunch} />}

            {!query && recentQueries.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-4)]">
                  Recent searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {recentQueries.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuery(q)}
                      className="rounded-full border border-[var(--border-1)] bg-[var(--surface-1)] px-2.5 py-1 text-[11px] text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AppGrid apps={filteredApps} onLaunch={handleLaunch} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
