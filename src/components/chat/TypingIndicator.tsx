"use client";

import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row">
      {/* Avatar assistant — identique à ChatBubble */}
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ background: "var(--gradient-neotechno)" }}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      {/* Trois points animés */}
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-1"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-accent-cyan)",
          boxShadow: "var(--glow-cyan)",
          borderBottomLeftRadius: "4px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: "var(--color-accent-cyan)",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
