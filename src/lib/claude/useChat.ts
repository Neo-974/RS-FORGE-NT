"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useChat(projectId: string, stepNumber: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || streaming) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setStreaming(true);
    setError(null);

    /* Récupère le token de session */
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setStreaming(false);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          projectId,
          stepNumber,
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Erreur réseau.");
      }

      /* Lecture du stream */
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      /* Ajoute un message assistant vide pour l'animer */
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(msg);
      /* Supprime le message assistant vide en cas d'erreur */
      setMessages((prev) =>
        prev[prev.length - 1]?.content === "" ? prev.slice(0, -1) : prev
      );
    } finally {
      setStreaming(false);
    }
  }, [messages, projectId, stepNumber, streaming]);

  return { messages, setMessages, streaming, error, sendMessage };
}
