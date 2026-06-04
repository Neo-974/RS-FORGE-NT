"use client";

import { useEffect } from "react";
import { useChat } from "@/lib/claude/useChat";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

interface Props {
  projectId: string;
  stepNumber: number;
  initialMessages?: Array<{ role: "user" | "assistant"; content: string }>;
  welcomeMessage?: string;
}

export default function ChatInterface({ projectId, stepNumber, initialMessages = [], welcomeMessage }: Props) {
  const { messages, streaming, error, sendMessage } = useChat(projectId, stepNumber);

  /* Charge les messages existants au montage */
  useEffect(() => {
    if (initialMessages.length > 0) {
      /* Les messages initiaux sont déjà chargés via props — le hook les intègre */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Message de bienvenue automatique si conversation vide */
  useEffect(() => {
    if (messages.length === 0 && welcomeMessage && !streaming) {
      /* Déclenche l'assistant pour ouvrir la conversation */
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
