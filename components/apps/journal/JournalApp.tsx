"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EntryList } from "./EntryList";
import { EntryEditor } from "./EntryEditor";
import { useJournal } from "./useJournal";
import { useElementWidth } from "@/hooks/useElementWidth";

/** Same reasoning as CalendarApp — measured against this component's own
 * rendered width, not the browser viewport, since it lives inside a
 * resizable OS window. */
const NARROW_BREAKPOINT = 480;

export function JournalApp() {
  const { entries, isLoading, isError, createEntry, updateEntry, deleteEntry } = useJournal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { ref, width } = useElementWidth<HTMLDivElement>();
  const isNarrow = width > 0 && width < NARROW_BREAKPOINT;

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  const handleNew = async () => {
    const created = await createEntry.mutateAsync({});
    setSelectedId(created.id);
    if (isNarrow) setIsDrawerOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isNarrow) setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEntry.mutate(id);
    if (selectedId === id) setSelectedId(null);
  };

  const list = (
    <EntryList
      entries={entries}
      selectedId={selectedId}
      onSelect={handleSelect}
      onNew={handleNew}
      isLoading={isLoading}
      isError={isError}
    />
  );

  return (
    <div ref={ref} className="relative flex h-full">
      {!isNarrow && list}

      <div className="relative flex flex-1 flex-col">
        {isNarrow && (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open entry list"
            className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {selectedEntry ? (
          <EntryEditor
            key={selectedEntry.id}
            entry={selectedEntry}
            onSave={(input) => updateEntry.mutate({ id: selectedEntry.id, input })}
            onDelete={() => handleDelete(selectedEntry.id)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-[var(--text-4)]">
            Select an entry or create a new one.
          </div>
        )}
      </div>

      {isNarrow && (
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                className="absolute inset-0 z-10 bg-black/40"
                onClick={() => setIsDrawerOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute left-0 top-0 z-20 h-full"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
              >
                <div className="relative h-full bg-[var(--bg-panel)]">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close entry list"
                    className="absolute -right-8 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--bg-panel)] text-[var(--text-3)] hover:text-[var(--text-1)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {list}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
