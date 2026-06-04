"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/claude/useChat";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  streaming: boolean;
}

export default function ChatWindow({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Scroll automatique vers le dernier message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      style={{ background: "var(--color-bg-primary)" }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            La conversation démarre ici…
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}

      {/* Indicateur de frappe pendant le streaming */}
      {streaming && messages[messages.length - 1]?.role !== "assistant" && (
        <TypingIndicator />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
