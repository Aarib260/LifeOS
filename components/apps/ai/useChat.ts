"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ChatMessage } from "@/types/chat";

async function sendChatRequest(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to get a response");
  return data.reply;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useMutation({
    mutationFn: sendChatRequest,
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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
