\"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FolderPlus, FilePlus, ClipboardPaste, RotateCw } from "lucide-react";
import { useFileSystem } from "@/hooks/useFileSystem";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useResizablePanel } from "@/hooks/useResizablePanel";
import { useClipboardStore } from "@/store/clipboardStore";
import { copyNode, updateNode } from "@/lib/fsClient";
import type { FSNode } from "@/types/fs";
import { ContextMenu } from "@/components/context-menu/ContextMenu";
import { ContextMenuItem, ContextMenuSeparator } from "@/components/context-menu/ContextMenuItem";
import { FileSystemContextMenu } from "@/components/context-menu/FileSystemContextMenu";
import { ExplorerSidebar } from "./ExplorerSidebar";
import { ExplorerToolbar } from "./ExplorerToolbar";
import { ExplorerGrid } from "./ExplorerGrid";
import { ExplorerList } from "./ExplorerList";
import { RecycleBinView } from "./RecycleBinView";
import { useExplorerNavigation } from "./useExplorerNavigation";
import type { ExplorerFilter, ExplorerSortBy, ExplorerSortDir, ExplorerViewMode } from "./types";

export function FileExplorerApp() {
  const nav = useExplorerNavigation();
  const isRecycleBin = nav.current === "recycle-bin";
  const folderId = isRecycleBin ? null : nav.current;

  const fs = useFileSystem(folderId);
  const queryClient = useQueryClient();
  const clipboard = useClipboardStore();

  const sidebarPanel = useResizablePanel({ initial: 180, min: 140, max: 320 });

  const [view, setView] = useState<ExplorerViewMode>("grid");
  const [sortBy, setSortBy] = useState<ExplorerSortBy>("name");
  const [sortDir, setSortDir] = useState<ExplorerSortDir>("asc");
  const [filter, setFilter] = useState<ExplorerFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const backgroundMenu = useContextMenu();
  const itemMenu = useContextMenu<FSNode>();

  const visibleItems = useMemo(() => {
    let items = fs.children;

    if (filter !== "all") {
      items = items.filter((n) => n.type === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((n) => n.name.toLowerCase().includes(q));
    }

    const sorted = [...items].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "type") cmp = a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
      else cmp = a.updatedAt.localeCompare(b.updatedAt);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [fs.children, filter, search, sortBy, sortDir]);

  function invalidate(parentId: string | null) {
    queryClient.invalidateQueries({ queryKey: ["fs", "children", parentId] });
  }

  function handleSelect(node: FSNode, e: React.MouseEvent) {
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    } else {
      setSelectedIds(new Set([node.id]));
    }
  }

  function handleOpen(node: FSNode) {
    if (node.type === "folder") {
      nav.navigateTo(node.id);
      setSelectedIds(new Set());
    }
    // Opening a file needs a viewer/editor app, which doesn't exist yet.
  }

  async function handleNewFolder() {
    if (!folderId) return;
    const created = await fs.createFolder.mutateAsync("New Folder");
    setRenamingId(created.id);
  }

  async function handleNewFile() {
    if (!folderId) return;
    const created = await fs.createFile.mutateAsync({ name: "New File.txt", content: "" });
    setRenamingId(created.id);
  }

  async function handlePaste() {
    if (!folderId || !clipboard.mode || !clipboard.nodeId) return;
    if (clipboard.mode === "copy") {
      await copyNode(clipboard.nodeId, folderId);
    } else {
      await updateNode(clipboard.nodeId, { parentId: folderId });
      clipboard.clear();
    }
    invalidate(folderId);
  }

  function handleCommitRename(node: FSNode, newName: string) {
    setRenamingId(null);
    const trimmed = newName.trim();
    if (trimmed && trimmed !== node.name) {
      fs.rename.mutate({ id: node.id, name: trimmed });
    }
  }

  function handleDeleteSelected() {
    selectedIds.forEach((id) => fs.remove.mutate(id));
    setSelectedIds(new Set());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isRecycleBin) return;
    if (e.key === "Delete" && selectedIds.size > 0) {
      handleDeleteSelected();
    } else if (e.key === "F2" && selectedIds.size === 1) {
      setRenamingId([...selectedIds][0]);
    }
  }

  const ViewComponent = view === "grid" ? ExplorerGrid : ExplorerList;

  return (
    <div
      className="flex h-full w-full outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => setSelectedIds(new Set())}
    >
      <ExplorerSidebar
        width={sidebarPanel.size}
        current={nav.current}
        onNavigate={nav.navigateTo}
        onResizePointerDown={sidebarPanel.onPointerDown}
        onResizePointerMove={sidebarPanel.onPointerMove}
        onResizePointerUp={sidebarPanel.onPointerUp}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ExplorerToolbar
          path={fs.path}
          canGoBack={nav.canGoBack}
          canGoForward={nav.canGoForward}
          onBack={nav.goBack}
          onForward={nav.goForward}
          onUp={() => {
            const parent = fs.path[fs.path.length - 2];
            if (parent) nav.navigateTo(parent.id);
          }}
          onNavigateToSegment={nav.navigateTo}
          search={search}
          onSearchChange={setSearch}
          view={view}
          onViewChange={setView}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={setSortBy}
          onToggleSortDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          filter={filter}
          onFilterChange={setFilter}
          onNewFolder={handleNewFolder}
          onNewFile={handleNewFile}
          disabled={isRecycleBin}
        />

        <div
          className="flex-1 overflow-auto"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            if (!isRecycleBin) backgroundMenu.open(e);
          }}
        >
          {isRecycleBin ? (
            <RecycleBinView />
          ) : fs.isLoading ? (
            <div className="p-6 text-sm text-[var(--text-3)]">Loading…</div>
          ) : visibleItems.length === 0 ? (
            <EmptyState hasSearch={search.trim().length > 0} />
          ) : (
            <ViewComponent
              items={visibleItems}
              selectedIds={selectedIds}
              renamingId={renamingId}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={(e, node) => {
                e.stopPropagation();
                setSelectedIds(new Set([node.id]));
                itemMenu.open(e, node);
              }}
              onCommitRename={handleCommitRename}
              onCancelRename={() => setRenamingId(null)}
            />
          )}
        </div>
      </div>

      <ContextMenu isOpen={backgroundMenu.isOpen} position={backgroundMenu.position} onClose={backgroundMenu.close}>
        <ContextMenuItem
          label="Refresh"
          icon={RotateCw}
          onClick={() => {
            invalidate(folderId);
            backgroundMenu.close();
          }}
        />
        <ContextMenuSeparator />
        <ContextMenuItem
          label="New Folder"
          icon={FolderPlus}
          onClick={() => {
            handleNewFolder();
            backgroundMenu.close();
          }}
        />
        <ContextMenuItem
          label="New File"
          icon={FilePlus}
          onClick={() => {
            handleNewFile();
            backgroundMenu.close();
          }}
        />
        <ContextMenuItem
          label="Paste"
          icon={ClipboardPaste}
          disabled={!clipboard.mode}
          onClick={() => {
            handlePaste();
            backgroundMenu.close();
          }}
        />
      </ContextMenu>

      <ContextMenu isOpen={itemMenu.isOpen} position={itemMenu.position} onClose={itemMenu.close}>
        {itemMenu.payload && (
          <FileSystemContextMenu
            node={itemMenu.payload}
            onClose={itemMenu.close}
            onOpen={handleOpen}
            onRenameRequest={(node) => setRenamingId(node.id)}
          />
        )}
      </ContextMenu>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-[var(--text-4)]">
      <p className="text-sm">{hasSearch ? "No matching items" : "This folder is empty"}</p>
    </div>
  );
}