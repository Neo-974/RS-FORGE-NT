"use client";

import { useEffect, useRef } from "react";
import { useChat, Message } from "@/lib/claude/useChat";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

interface Props {
  projectId: string;
  stepNumber: number;
  initialMessages?: Message[];
}

export default function ChatInterface({ projectId, stepNumber, initialMessages = [] }: Props) {
  const { messages, streaming, error, sendMessage, setMessages } = useChat(projectId, stepNumber);
  const initialized = useRef(false);

  /* Charge les messages existants depuis la DB au premier rendu */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else {
      /* Conversation vide : l'assistant ouvre avec la première question */
      sendMessage("__init__");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ChatWindow messages={messages} streaming={streaming} />

      {error && (
        <div
          className="mx-4 mb-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: "rgba(244, 67, 54, 0.1)", border: "1px solid var(--color-error)", color: "var(--color-error)" }}
        >
          {error}
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={streaming} />
    </div>
  );
}
