"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Toolbar } from "./Toolbar";
import type { JournalEntry, UpdateEntryInput } from "@/types/journal";

interface EntryEditorProps {
  entry: JournalEntry;
  onSave: (input: UpdateEntryInput) => void;
  onDelete: () => void;
}

const AUTOSAVE_DELAY = 700;

/**
 * The parent renders this with `key={entry.id}`, so switching entries
 * remounts it fresh — all local state below just initializes from the
 * new entry, no manual resync logic needed for entry-switching.
 */
export function EntryEditor({ entry, onSave, onDelete }: EntryEditorProps) {
  const [title, setTitle] = useState(entry.title ?? "");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<UpdateEntryInput | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: entry.content,
    onUpdate: ({ editor }) => {
      scheduleSave({ content: editor.getHTML() });
    },
  });

  function scheduleSave(partial: UpdateEntryInput) {
    pendingRef.current = { ...pendingRef.current, ...partial };
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (pendingRef.current) onSave(pendingRef.current);
      pendingRef.current = null;
    }, AUTOSAVE_DELAY);
  }

  // Flush any not-yet-fired autosave immediately if this entry is closed
  // or switched away from before the debounce timer completes.
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (pendingRef.current) onSave(pendingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    scheduleSave({ title: value });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-white/[0.06] p-3">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="flex-1 bg-transparent text-sm font-medium text-white/90 outline-none placeholder:text-white/30"
        />
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete entry"
          className="rounded-md p-1 text-white/40 transition-colors hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <Toolbar editor={editor} />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <EditorContent
          editor={editor}
          className={[
            "text-sm text-white/85",
            "[&_.ProseMirror]:outline-none",
            "[&_ul]:list-disc [&_ul]:pl-5",
            "[&_ol]:list-decimal [&_ol]:pl-5",
            "[&_strong]:font-semibold",
            "[&_em]:italic",
            "[&_p]:mb-2",
          ].join(" ")}
        />
      </div>
    </div>
  );
}