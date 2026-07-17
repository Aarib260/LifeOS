export interface JournalEntry {
  id: string;
  title: string | null;
  /** HTML produced by the Tiptap editor */
  content: string;
  entryDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title?: string;
  content?: string;
  entryDate?: string;
}

export interface UpdateEntryInput {
  title?: string | null;
  content?: string;
}