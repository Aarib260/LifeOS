"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ChatMessage } from "@/types/chat";
import type { AppId } from "@/types";
import { useWindowStore } from "@/store/windowStore";

interface ChatAction {
  type: "open_app";
  appId: string;
}

interface ChatResponse {
  reply: string;
  actions?: ChatAction[];
}

async function sendChatRequest(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to get a response");
  return data;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const openApp = useWindowStore((s) => s.openApp);

  const sendMessage = useMutation({
    mutationFn: sendChatRequest,
    onSuccess: ({ reply, actions }) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // open_app is non-destructive (worst case: wrong window opens), so
      // it runs immediately with no confirmation step — unlike any future
      // data-mutating tool, which would need the user to approve first.
      for (const action of actions ?? []) {
        if (action.type === "open_app") {
          openApp(action.appId as AppId);
        }
      }
    },
  });

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    sendMessage.mutate(nextMessages);
  };

  return {
    messages,
    send,
    isPending: sendMessage.isPending,
    isError: sendMessage.isError,
  };
}
