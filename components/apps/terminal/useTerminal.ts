"use client";

import { useCallback, useRef, useState } from "react";
import { DEFAULT_ROOT_FOLDER_IDS } from "@/types/fs";
import { useWindowStore } from "@/store/windowStore";
import { executeCommand } from "./commands";

export interface TerminalLine {
  id: string;
  kind: "input" | "output" | "error";
  text: string;
}

interface TerminalPayload {
  cwdId?: string;
  history?: string[];
}

let lineCounter = 0;
function nextLineId(): string {
  lineCounter += 1;
  return `line-${lineCounter}`;
}

/**
 * `windowId` + `payload` let this restore cwd and command history from a
 * previous session (payload is what got persisted into windowStore before
 * refresh). The visible scroll buffer (`lines`) is intentionally NOT
 * restored — replaying old command output on every refresh would be
 * noisy and doesn't carry the same "I was in the middle of something"
 * value that cwd/history do. A short "restored" notice stands in for it.
 */
export function useTerminal(windowId: string, payload?: TerminalPayload) {
  const updateWindowPayload = useWindowStore((s) => s.updatePayload);

  const hasRestoredState = Boolean(payload?.cwdId || (payload?.history && payload.history.length > 0));

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: nextLineId(), kind: "output", text: "LifeOS Terminal — type `help` to get started." },
    ...(hasRestoredState
      ? [{ id: nextLineId(), kind: "output" as const, text: "(Session restored — cwd and history carried over.)" }]
      : []),
  ]);
  const [cwdId, setCwdId] = useState<string>(payload?.cwdId ?? DEFAULT_ROOT_FOLDER_IDS.desktop);
  const [inputValue, setInputValue] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const historyRef = useRef<string[]>(payload?.history ?? []);
  const historyIndexRef = useRef<number | null>(null);

  const appendLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const submit = useCallback(async () => {
    const raw = inputValue;
    if (!raw.trim() || isRunning) return;

    historyRef.current = [...historyRef.current, raw];
    historyIndexRef.current = null;
    setInputValue("");

    appendLines([{ id: nextLineId(), kind: "input", text: raw }]);
    setIsRunning(true);

    const result = await executeCommand(raw, {
      cwdId,
      history: historyRef.current,
    });

    if (result.clear) {
      setLines([]);
    } else if (result.lines.length > 0) {
      appendLines(
        result.lines.map((text) => ({
          id: nextLineId(),
          kind: result.isError ? "error" : "output",
          text,
        }))
      );
    }

    const finalCwd = result.newCwdId ?? cwdId;
    if (result.newCwdId) {
      setCwdId(result.newCwdId);
    }

    updateWindowPayload(windowId, { cwdId: finalCwd, history: historyRef.current });

    setIsRunning(false);
  }, [inputValue, isRunning, cwdId, appendLines, updateWindowPayload, windowId]);

  const navigateHistory = useCallback((direction: "up" | "down") => {
    const history = historyRef.current;
    if (history.length === 0) return;

    const currentIndex = historyIndexRef.current;

    if (direction === "up") {
      const nextIndex = currentIndex === null ? history.length - 1 : Math.max(0, currentIndex - 1);
      historyIndexRef.current = nextIndex;
      setInputValue(history[nextIndex]);
    } else {
      if (currentIndex === null) return;
      const nextIndex = currentIndex + 1;
      if (nextIndex >= history.length) {
        historyIndexRef.current = null;
        setInputValue("");
      } else {
        historyIndexRef.current = nextIndex;
        setInputValue(history[nextIndex]);
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateHistory("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateHistory("down");
      }
    },
    [submit, navigateHistory]
  );

  return {
    lines,
    inputValue,
    setInputValue,
    handleKeyDown,
    isRunning,
    cwdId,
  };
}
