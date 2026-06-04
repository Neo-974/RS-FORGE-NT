"use client";

import { Message } from "@/lib/claude/useChat";

interface Props {
  message: Message;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold font-display"
          style={{ background: "var(--gradient-neotechno)", color: "white" }}
        >
          RS
        </div>
      )}

      {/* Contenu */}
      <div
        className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-accent-purple)",
                color: "var(--color-text-primary)",
                borderBottomRightRadius: "4px",
              }
            : {
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-accent-cyan)",
                boxShadow: "var(--glow-cyan)",
                color: "var(--color-text-primary)",
                borderBottomLeftRadius: "4px",
              }
        }
      >
        {/* Rendu markdown simple : sauts de ligne et gras */}
        <div className="whitespace-pre-wrap">{formatMessage(message.content)}</div>
      </div>
    </div>
  );
}

/* Mise en forme légère : **gras** et sauts de ligne */
function formatMessage(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}
