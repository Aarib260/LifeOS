"use client";

import { useState } from "react";
import { EntryList } from "./EntryList";
import { EntryEditor } from "./EntryEditor";
import { useJournal } from "./useJournal";

export function JournalApp() {
  const { entries, isLoading, isError, createEntry, updateEntry, deleteEntry } = useJournal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  const handleNew = async () => {
    const created = await createEntry.mutateAsync({});
    setSelectedId(created.id);
  };

  const handleDelete = (id: string) => {
    deleteEntry.mutate(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex h-full">
      <EntryList
        entries={entries}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
        isLoading={isLoading}
        isError={isError}
      />

      {selectedEntry ? (
        <EntryEditor
          key={selectedEntry.id}
          entry={selectedEntry}
          onSave={(input) => updateEntry.mutate({ id: selectedEntry.id, input })}
          onDelete={() => handleDelete(selectedEntry.id)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-xs text-white/30">
          Select an entry or create a new one.
        </div>
      )}
    </div>
  );
}