"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Folder, File as FileIcon } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { useIsRevealed } from "./OSBootSequence";
import { ContextMenu } from "@/components/context-menu/ContextMenu";
import { DesktopContextMenu } from "@/components/context-menu/DesktopContextMenu";
import { FileSystemContextMenu } from "@/components/context-menu/FileSystemContextMenu";
import { useWindowStore } from "@/store/windowStore";
import { useClipboardStore } from "@/store/clipboardStore";
import { useDesktopIconStore } from "@/store/desktopIconStore";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useFileSystem } from "@/hooks/useFileSystem";
import { updateNode, copyNode } from "@/lib/fsClient";
import { toast } from "@/store/toastStore";
import { VISIBLE_APP_LIST, APP_REGISTRY, getOpenAppOptions } from "@/lib/appRegistry";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import type { FSNode } from "@/types/fs";
import {
  DESKTOP_ICON_CELL_WIDTH as CELL_WIDTH,
  DESKTOP_ICON_CELL_HEIGHT as CELL_HEIGHT,
  DESKTOP_ICON_GRID_ROWS as ROWS,
} from "@/lib/constants";

interface DesktopIconDescriptor {
  id: string;
  kind: "app" | "fs";
  label: string;
  icon: ComponentType<{ className?: string }>;
  node?: FSNode;
}

export type DesktopSortBy = "name" | "type" | "modified";

const DESKTOP_ID = DEFAULT_ROOT_FOLDER_IDS.desktop;

export function DesktopIconGrid() {
  const openApp = useWindowStore((s) => s.openApp);
  const isRevealed = useIsRevealed();
  const clipboard = useClipboardStore();
  const { positions, ensurePosition, moveIcon, setPositions } = useDesktopIconStore();
  const { children: desktopFiles } = useFileSystem(DESKTOP_ID);
  const queryClient = useQueryClient();

  function invalidateDesktop() {
    queryClient.invalidateQueries({ queryKey: ["fs", "children", DESKTOP_ID] });
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef(new Map<string, HTMLDivElement>());

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const marqueeStart = useRef<{ x: number; y: number; additive: boolean } | null>(null);

  const backgroundMenu = useContextMenu();
  const itemMenu = useContextMenu<DesktopIconDescriptor>();

  const icons: DesktopIconDescriptor[] = useMemo(() => {
    const appIcons: DesktopIconDescriptor[] = VISIBLE_APP_LIST.map((app) => ({
      id: app.id,
      kind: "app",
      label: app.title,
      icon: app.icon,
    }));
    const fsIcons: DesktopIconDescriptor[] = desktopFiles.map((node) => ({
      id: node.id,
      kind: "fs",
      label: node.name,
      icon: node.type === "folder" ? Folder : FileIcon,
      node,
    }));
    return [...appIcons, ...fsIcons];
  }, [desktopFiles]);

  // Assign a default grid slot to any icon that doesn't have one yet
  // (new icons only — dragged icons keep whatever position they were
  // moved to, since ensurePosition is a no-op if one already exists).
  //
  // Previously this used the icon's array index directly as (col, row),
  // which collided with icons that had been dragged to a custom spot —
  // e.g. creating a new file could land it right on top of an existing
  // dragged icon. Now it scans for the first genuinely unoccupied cell.
  useEffect(() => {
    const occupied = new Set(
      Object.values(positions).map((p) => `${p.col}:${p.row}`)
    );

    icons.forEach((icon) => {
      if (positions[icon.id]) return;

      let placed = false;
      for (let col = 0; !placed && col < 1000; col++) {
        for (let row = 0; row < ROWS; row++) {
          const key = `${col}:${row}`;
          if (!occupied.has(key)) {
            occupied.add(key);
            ensurePosition(icon.id, { col, row });
            placed = true;
            break;
          }
        }
      }
    });
  }, [icons, positions, ensurePosition]);

  function handleOpen(icon: DesktopIconDescriptor) {
    if (icon.kind === "app") {
      const app = APP_REGISTRY[icon.id as keyof typeof APP_REGISTRY];
      openApp(app.id, getOpenAppOptions(app.id));
    } else if (icon.node?.type === "folder") {
      openApp(
        "file-explorer",
        getOpenAppOptions("file-explorer", {
          title: icon.node.name,
          payload: { initialFolderId: icon.node.id },
        })
      );
    } else if (icon.node?.type === "file") {
      openApp(
        "file-viewer",
        getOpenAppOptions("file-viewer", {
          title: icon.node.name,
          payload: { fileId: icon.node.id },
        })
      );
    }
  }

  function handleIconClick(icon: DesktopIconDescriptor, e: React.MouseEvent) {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(icon.id)) next.delete(icon.id);
        else next.add(icon.id);
        return next;
      });
    } else {
      setSelectedIds(new Set([icon.id]));
    }
  }

  function handleCommitRename(icon: DesktopIconDescriptor, newName: string) {
    setRenamingId(null);
    const trimmed = newName.trim();
    if (icon.node && trimmed && trimmed !== icon.node.name) {
      updateNode(icon.node.id, { name: trimmed }).then(invalidateDesktop);
    }
  }

  function selectedFsNodes(): FSNode[] {
    return icons.filter((i) => i.kind === "fs" && selectedIds.has(i.id)).map((i) => i.node!);
  }

  async function handleDeleteSelected() {
    for (const node of selectedFsNodes()) {
      await updateNode(node.id, { isDeleted: true });
    }
    invalidateDesktop();
    setSelectedIds(new Set());
  }

  async function handlePaste() {
    if (!clipboard.mode || clipboard.nodeIds.length === 0) return;
    for (const id of clipboard.nodeIds) {
      if (clipboard.mode === "copy") {
        await copyNode(id, DESKTOP_ID);
      } else {
        await updateNode(id, { parentId: DESKTOP_ID });
      }
    }
    if (clipboard.mode === "cut") clipboard.clear();
    invalidateDesktop();
  }

  /**
   * Re-lays-out every icon (apps and files alike) top-to-bottom, column by
   * column, by the chosen criterion. Apps have no meaningful "modified"
   * date, so for that mode they sort first as a stable group, then files
   * newest-first — keeping app launchers predictably in the same corner
   * rather than scattered among files by an arbitrary tiebreak.
   */
  function handleSort(by: DesktopSortBy) {
    const rank = (icon: DesktopIconDescriptor) => {
      if (icon.kind === "app") return 0;
      return icon.node?.type === "folder" ? 1 : 2;
    };

    const sorted = [...icons].sort((a, b) => {
      if (by === "name") return a.label.localeCompare(b.label);
      if (by === "type") return rank(a) - rank(b) || a.label.localeCompare(b.label);

      // modified: apps stay grouped first (stable order), files sort newest first
      if (a.kind === "app" && b.kind === "app") return 0;
      if (a.kind === "app") return -1;
      if (b.kind === "app") return 1;
      return (b.node?.updatedAt ?? "").localeCompare(a.node?.updatedAt ?? "");
    });

    const next: Record<string, { col: number; row: number }> = {};
    sorted.forEach((icon, index) => {
      next[icon.id] = { col: Math.floor(index / ROWS), row: index % ROWS };
    });
    setPositions(next);
    toast.success(`Sorted by ${by === "modified" ? "date modified" : by}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const isMod = e.ctrlKey || e.metaKey;
    const fsSelected = selectedFsNodes();

    if (e.key === "Delete" && fsSelected.length > 0) {
      handleDeleteSelected();
    } else if (e.key === "F2" && fsSelected.length === 1) {
      setRenamingId(fsSelected[0].id);
    } else if (isMod && e.key.toLowerCase() === "c" && fsSelected.length > 0) {
      clipboard.setClipboard("copy", fsSelected.map((n) => n.id), DESKTOP_ID);
    } else if (isMod && e.key.toLowerCase() === "x" && fsSelected.length > 0) {
      clipboard.setClipboard("cut", fsSelected.map((n) => n.id), DESKTOP_ID);
    } else if (isMod && e.key.toLowerCase() === "v") {
      handlePaste();
    } else if (isMod && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setSelectedIds(new Set(icons.map((i) => i.id)));
    }
  }

  // --- Drag to reorder (native HTML5 DnD) ---

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const rect = containerRef.current?.getBoundingClientRect();
    if (!id || !rect) return;

    const col = Math.max(0, Math.floor((e.clientX - rect.left) / CELL_WIDTH));
    const row = Math.max(0, Math.min(ROWS - 1, Math.floor((e.clientY - rect.top) / CELL_HEIGHT)));
    moveIcon(id, { col, row });
  }

  // --- Selection box (marquee) ---

  function handleContainerPointerDown(e: React.PointerEvent) {
    if (e.target !== containerRef.current) return;
    marqueeStart.current = { x: e.clientX, y: e.clientY, additive: e.shiftKey };
    setMarquee({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
  }

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (!marqueeStart.current) return;
      const { x: startX, y: startY } = marqueeStart.current;
      setMarquee({
        x: Math.min(startX, e.clientX),
        y: Math.min(startY, e.clientY),
        w: Math.abs(e.clientX - startX),
        h: Math.abs(e.clientY - startY),
      });
    }

    function handleUp() {
      if (!marqueeStart.current) return;
      const start = marqueeStart.current;
      marqueeStart.current = null;

      setMarquee((rect) => {
        if (!rect || (rect.w < 4 && rect.h < 4)) {
          if (!start.additive) setSelectedIds(new Set());
          return null;
        }

        const hits = new Set<string>();
        iconRefs.current.forEach((el, id) => {
          const r = el.getBoundingClientRect();
          const intersects =
            r.left < rect.x + rect.w && r.right > rect.x && r.top < rect.y + rect.h && r.bottom > rect.y;
          if (intersects) hits.add(id);
        });

        setSelectedIds((prev) => (start.additive ? new Set([...prev, ...hits]) : hits));
        return null;
      });
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handleContainerPointerDown}
      onContextMenu={(e) => backgroundMenu.open(e)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="absolute inset-0 z-10 outline-none"
    >
      {icons.map((icon, index) => {
        const pos = positions[icon.id] ?? { col: Math.floor(index / ROWS), row: index % ROWS };

        return (
          <motion.div
            key={icon.id}
            ref={(el) => {
              if (el) iconRefs.current.set(icon.id, el);
              else iconRefs.current.delete(icon.id);
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, icon.id)}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: pos.col * CELL_WIDTH + 16,
              top: pos.row * CELL_HEIGHT + 16,
              width: CELL_WIDTH,
              height: CELL_HEIGHT,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 + index * 0.03 }}
          >
            <DesktopIcon
              label={icon.label}
              icon={icon.icon}
              onOpen={() => handleOpen(icon)}
              isSelected={selectedIds.has(icon.id)}
              isRenaming={renamingId === icon.id}
              onRenameCommit={(name) => handleCommitRename(icon, name)}
              onRenameCancel={() => setRenamingId(null)}
              onClick={(e) => handleIconClick(icon, e)}
              onContextMenu={(e) => {
                e.stopPropagation();
                setSelectedIds(new Set([icon.id]));
                itemMenu.open(e, icon);
              }}
            />
          </motion.div>
        );
      })}

      {marquee && (
        <div
          style={{ position: "fixed", left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }}
          className="pointer-events-none z-50 rounded-sm border border-cyan-400/60 bg-cyan-400/10"
        />
      )}

      <ContextMenu isOpen={backgroundMenu.isOpen} position={backgroundMenu.position} onClose={backgroundMenu.close}>
        <DesktopContextMenu
          onClose={backgroundMenu.close}
          onOpenPersonalize={() =>
            handleOpen({ id: "settings", kind: "app", label: "Settings", icon: Folder })
          }
          onSort={handleSort}
        />
      </ContextMenu>

      <ContextMenu isOpen={itemMenu.isOpen} position={itemMenu.position} onClose={itemMenu.close}>
        {itemMenu.payload?.node && (
          <FileSystemContextMenu
            node={itemMenu.payload.node}
            onClose={itemMenu.close}
            onOpen={() => handleOpen(itemMenu.payload!)}
            onRenameRequest={(node) => setRenamingId(node.id)}
          />
        )}
      </ContextMenu>
    </div>
  );
}
