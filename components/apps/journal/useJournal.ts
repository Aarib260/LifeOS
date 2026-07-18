"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEntryInput, JournalEntry, UpdateEntryInput } from "@/types/journal";

const JOURNAL_KEY = ["journal"] as const;

async function fetchEntries(): Promise<JournalEntry[]> {
  const res = await fetch("/api/journal");
  if (!res.ok) throw new Error("Failed to load journal entries");
  return res.json();
}

async function createEntryRequest(input: CreateEntryInput): Promise<JournalEntry> {
  const res = await fetch("/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

async function updateEntryRequest(id: string, input: UpdateEntryInput): Promise<JournalEntry> {
  const res = await fetch(`/api/journal/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

async function deleteEntryRequest(id: string): Promise<void> {
  const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete entry");
}

export function useJournal() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: JOURNAL_KEY, queryFn: fetchEntries });

  const createEntry = useMutation({
    mutationFn: createEntryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: JOURNAL_KEY }),
  });

  // Patches the cache directly with the server's response rather than
  // invalidating (which would refetch the whole list and could fight with
  // what's currently being typed). This keeps the sidebar's title/preview
  // in sync with each autosave without a network round trip.
  const updateEntry = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEntryInput }) =>
      updateEntryRequest(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<JournalEntry[]>(JOURNAL_KEY, (old) =>
        old?.map((e) => (e.id === updated.id ? updated : e))
      );
    },
  });

  const deleteEntry = useMutation({
    mutationFn: deleteEntryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: JOURNAL_KEY }),
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
