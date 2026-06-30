"use client";

import { Message } from "@/lib/claude/useChat";
import { Sparkles } from "lucide-react";

interface Props {
  message: Message;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar assistant */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: "var(--gradient-neotechno)" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Contenu */}
      <div
        className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
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
                border: "1px solid rgba(0,188,212,0.4)",
                boxShadow: "var(--glow-cyan)",
                color: "var(--color-text-primary)",
                borderBottomLeftRadius: "4px",
              }
        }
      >
        <MarkdownContent text={message.content} />
      </div>
    </div>
  );
}

/* Rendu markdown : titres, listes, gras, italique, code inline */
function MarkdownContent({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Titre h3 ### */
    if (line.startsWith("### ")) {
      elements.push(
        <p key={i} className="font-semibold mt-3 mb-1" style={{ color: "var(--color-accent-cyan)", fontSize: "0.85rem" }}>
          {renderInline(line.slice(4))}
        </p>
      );
      i++;
      continue;
    }

    /* Titre h2 ## */
    if (line.startsWith("## ")) {
      elements.push(
        <p key={i} className="font-bold mt-4 mb-1" style={{ color: "var(--color-accent-cyan)" }}>
          {renderInline(line.slice(3))}
        </p>
      );
      i++;
      continue;
    }

    /* Titre h1 # */
    if (line.startsWith("# ")) {
      elements.push(
        <p key={i} className="font-bold text-base mt-4 mb-2" style={{ color: "var(--color-accent-cyan)" }}>
          {renderInline(line.slice(2))}
        </p>
      );
      i++;
      continue;
    }

    /* Liste non ordonnée (- ou *) */
    if (line.match(/^[-*] /)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push(
          <li key={i} className="flex gap-2">
            <span style={{ color: "var(--color-accent-cyan)", flexShrink: 0 }}>•</span>
            <span>{renderInline(lines[i].slice(2))}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-0.5 my-1 ml-1">
          {listItems}
        </ul>
      );
      continue;
    }

    /* Liste ordonnée (1. 2. etc.) */
    if (line.match(/^\d+\. /)) {
      const listItems: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        const content = lines[i].replace(/^\d+\. /, "");
        listItems.push(
          <li key={i} className="flex gap-2">
            <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "var(--color-accent-cyan)", minWidth: "1.2rem" }}>{num}.</span>
            <span>{renderInline(content)}</span>
          </li>
        );
        i++;
        num++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-0.5 my-1 ml-1">
          {listItems}
        </ol>
      );
      continue;
    }

    /* Ligne vide = espacement */
    if (line.trim() === "") {
      if (elements.length > 0) {
        elements.push(<div key={i} className="h-1" />);
      }
      i++;
      continue;
    }

    /* Paragraphe normal */
    elements.push(
      <p key={i} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

/* Rendu inline : **gras**, *italique*, `code` */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded text-xs font-mono"
          style={{ background: "var(--color-bg-elevated)", color: "var(--color-accent-cyan)" }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
