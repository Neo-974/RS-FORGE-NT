"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
  documentType: string;
  title: string;
  description: string;
  icon: string;
}

export default function DocumentCard({ projectId, documentType, title, description, icon }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Session expirée."); setLoading(false); return; }

    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ projectId, documentType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur de génération.");
      }

      /* Déclenche le téléchargement */
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.href = url;
      a.download = match?.[1] ?? `${documentType}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="card-glass p-5 flex items-start gap-4 transition-all"
      style={{ borderColor: done ? "rgba(0, 230, 118, 0.4)" : undefined }}
    >
      {/* Icône */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        {icon}
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
            {title}
          </h3>
          {done && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,230,118,0.15)", color: "var(--color-accent-green)" }}>
              Téléchargé ✓
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {description}
        </p>
        <p className="text-xs mt-1 font-mono" style={{ color: "var(--color-text-muted)" }}>
          Format : .docx (Word)
        </p>
        {error && <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{error}</p>}
      </div>

      {/* Bouton téléchargement */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-secondary text-sm flex-shrink-0 flex items-center gap-2"
        style={done ? { borderColor: "var(--color-accent-green)", color: "var(--color-accent-green)" } : {}}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-accent-cyan)", borderTopColor: "transparent" }} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        {loading ? "Génération…" : done ? "Re-télécharger" : "Télécharger"}
      </button>
    </div>
  );
}
