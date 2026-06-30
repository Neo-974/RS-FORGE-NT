"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div
      className="px-4 py-3 border-t flex gap-3 items-end"
      style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={
          disabled
            ? "L'assistant répond…"
            : "Votre réponse… (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)"
        }
        className="input-field resize-none overflow-hidden flex-1"
        style={{ minHeight: "44px", maxHeight: "160px" }}
      />

      <Button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        size="icon"
        aria-label="Envoyer"
        className="flex-shrink-0 h-11 w-11"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
