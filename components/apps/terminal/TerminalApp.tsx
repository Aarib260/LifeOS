"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTerminal } from "./useTerminal";

export function TerminalApp() {
  const { lines, inputValue, setInputValue, handleKeyDown, isRunning } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <div
      className="flex h-full flex-col bg-black/85 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "whitespace-pre-wrap break-words",
              line.kind === "input" && "text-cyan-300/90",
              line.kind === "error" && "text-red-400/90",
              line.kind === "output" && "text-[var(--text-2)]"
            )}
          >
            {line.kind === "input" ? `$ ${line.text}` : line.text}
          </div>
        ))}

        <div className="flex items-center gap-2 text-cyan-300/90">
          <span>$</span>
          <input
            ref={inputRef}
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}