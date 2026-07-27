"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Save, FileWarning } from "lucide-react";
import { getNode, updateNode } from "@/lib/fsClient";
import type { FSNode } from "@/types/fs";

interface FileViewerAppProps {
  payload?: { fileId?: string };
}

/**
 * A plain-text viewer/editor. Opened contextually (from Explorer or the
 * Desktop double-clicking a file) via payload.fileId — never appears as a
 * standalone Desktop/Start Menu icon, see AppDefinition.hidden.
 *
 * Only text-ish content is editable. Anything with a mimeType that isn't
 * text/* is shown read-only with a notice, since there's no binary/image
 * rendering in the VFS yet.
 */
export function FileViewerApp({ payload }: FileViewerAppProps) {
  const fileId = payload?.fileId;
  const queryClient = useQueryClient();

  const [node, setNode] = useState<FSNode | null>(null);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setStatus("error");
      return;
    }
    let mounted = true;
    getNode(fileId)
      .then((fetched) => {
        if (!mounted) return;
        setNode(fetched);
        setContent(fetched.content ?? "");
        setStatus("ready");
      })
      .catch(() => {
        if (mounted) setStatus("error");
      });
    return () => {
      mounted = false;
    };
  }, [fileId]);

  const isEditable = !node?.mimeType || node.mimeType.startsWith("text/");

  async function handleSave() {
    if (!node || !isEditable) return;
    setIsSaving(true);
    try {
      const updated = await updateNode(node.id, { content });
      setNode(updated);
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ["fs", "children", node.parentId] });
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handleSave();
    }
  }

  if (status === "loading") {
    return <div className="flex h-full items-center justify-center text-sm text-[var(--text-3)]">Loading…</div>;
  }

  if (status === "error" || !node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--text-4)]">
        <FileWarning className="h-8 w-8 opacity-50" />
        <p className="text-sm">Couldn't open this file.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-1)] px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[var(--text-1)]">{node.name}</p>
          <p className="text-[11px] text-[var(--text-4)]">
            {isDirty ? "Unsaved changes" : "Saved"} · {node.mimeType ?? "text/plain"}
          </p>
        </div>

        {isEditable && (
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 rounded-md bg-[var(--surface-3)] px-3 py-1.5 text-[12px] font-medium text-[var(--text-1)] transition-colors hover:bg-cyan-500/20 hover:text-cyan-300 disabled:opacity-40 disabled:hover:bg-[var(--surface-3)] disabled:hover:text-[var(--text-1)]"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving…" : "Save"}
          </button>
        )}
      </div>

      {isEditable ? (
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsDirty(true);
          }}
          spellCheck={false}
          className="flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-[var(--text-1)] outline-none"
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[var(--text-4)]">
          <FileWarning className="h-8 w-8 opacity-50" />
          <p className="text-sm">This file type ({node.mimeType}) can't be previewed yet.</p>
        </div>
      )}
    </div>
  );
}
