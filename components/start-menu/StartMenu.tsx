"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { AppGrid } from "./AppGrid";
import { RecentApps } from "./RecentApps";
import { useWindowStore } from "@/store/windowStore";
import { APP_LIST } from "@/lib/appRegistry";
import { TASKBAR_HEIGHT, START_MENU_Z } from "@/lib/constants";
import type { AppId } from "@/types";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [query, setQuery] = useState("");
  const openApp = useWindowStore((s) => s.openApp);

  const filteredApps = useMemo(() => {
    if (!query.trim()) return APP_LIST;
    const q = query.toLowerCase();
    return APP_LIST.filter((app) => app.title.toLowerCase().includes(q));
  }, [query]);

  const handleLaunch = (appId: AppId) => {
    const app = APP_LIST.find((a) => a.id === appId);
    openApp(appId, { title: app?.title ?? appId, size: app?.defaultSize, minSize: app?.minSize });
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
            className="fixed left-1/2 flex w-[420px] max-w-[92vw] -translate-x-1/2 flex-col rounded-2xl border border-white/[0.08] bg-[#12161F]/95 p-4 shadow-2xl backdrop-blur-xl"
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

            <AppGrid apps={filteredApps} onLaunch={handleLaunch} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}