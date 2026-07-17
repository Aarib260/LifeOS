"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "./useChat";
import { ChatMessage } from "./ChatMessage";

export function AIAssistantApp() {
  const { messages, send, isPending, isError } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    send(input);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/30">
            <Sparkles className="h-6 w-6" />
            <p className="max-w-[220px] text-xs">
              Ask about your tasks, habits, goals, or upcoming events.
            </p>
          </div>
        )}

        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-white/[0.05] px-3 py-2 text-sm text-white/40">
              Thinking...
            </div>
          </div>
        )}

        {isError && (
          <p className="text-center text-xs text-red-300/70">
            Something went wrong. Check your OPENROUTER_API_KEY.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-cyan-400/30"
        />
        <button
          type="submit"
          disabled={!input.trim() || isPending}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            input.trim() && !isPending
              ? "bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
              : "text-white/20"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}