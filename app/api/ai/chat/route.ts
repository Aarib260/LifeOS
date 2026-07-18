import { NextResponse } from "next/server";
import { AI_TOOLS, executeTool } from "@/lib/aiTools";
import type { ChatMessage } from "@/types/chat";

// Hack Club's free AI proxy — OpenAI-compatible, get a key at
// https://ai.hackclub.com/dashboard (sign in with your Hack Club account).
const CHAT_URL = "https://ai.hackclub.com/proxy/v1/chat/completions";
const MODEL = process.env.HACKCLUB_AI_MODEL ?? "google/gemini-2.5-flash";

const SYSTEM_PROMPT = `You are the AI Assistant built into LifeOS, a personal operating system.
You have read-only access to the user's Tasks, Habits, Goals, and Calendar via tools —
use them whenever a question needs current data instead of guessing. You cannot create,
edit, or delete anything yet. Be concise and conversational, not a wall of bullet points.`;

interface ProxyMessage {
  role: string;
  content: string | null;
  tool_calls?: {
    id: string;
    function: { name: string; arguments: string };
  }[];
  tool_call_id?: string;
}

async function callChatProxy(messages: ProxyMessage[]) {
  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HACKCLUB_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: AI_TOOLS,
      tool_choice: "auto",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hack Club AI proxy error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function POST(request: Request) {
  if (!process.env.HACKCLUB_AI_API_KEY) {
    return NextResponse.json(
      { error: "HACKCLUB_AI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    const conversation: ProxyMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const first = await callChatProxy(conversation);
    const firstMessage = first.choices[0].message as ProxyMessage;

    // No tool calls — the model answered directly.
    if (!firstMessage.tool_calls || firstMessage.tool_calls.length === 0) {
      return NextResponse.json({ reply: firstMessage.content ?? "" });
    }

    // Execute each requested tool, then give the model the results so it
    // can produce a final natural-language answer. One round of tool use
    // is enough for the read-only lookups this assistant currently supports.
    conversation.push(firstMessage);

    for (const toolCall of firstMessage.tool_calls) {
      const result = await executeTool(toolCall.function.name);
      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    const second = await callChatProxy(conversation);
    const finalMessage = second.choices[0].message as ProxyMessage;

    return NextResponse.json({ reply: finalMessage.content ?? "" });
  } catch (error) {
    console.error("[POST /api/ai/chat]", error);
    return NextResponse.json({ error: "Failed to get a response" }, { status: 500 });
  }
}
