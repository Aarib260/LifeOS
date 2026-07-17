import type { JournalEntry } from "@/types/journal";

interface JournalEntryRow {
  id: string;
  title: string | null;
  content: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export function mapRowToEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    entryDate: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}