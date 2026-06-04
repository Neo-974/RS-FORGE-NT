"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DownloadAllButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleDownloadAll() {
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
        body: JSON.stringify({ projectId, documentType: "all" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur de génération.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.href = url;
      a.download = match?.[1] ?? "dossier-rs-complet.zip";
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
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDownloadAll}
        disabled={loading}
        className="btn-primary flex items-center gap-3 text-sm px-6 py-3"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        {loading ? "Génération en cours…" : done ? "Re-télécharger le dossier complet" : "Télécharger le dossier complet (.zip)"}
      </button>
      {done && <p className="text-xs" style={{ color: "var(--color-accent-green)" }}>6 documents générés et archivés dans Supabase Storage ✓</p>}
      {error && <p className="text-xs" style={{ color: "var(--color-error)" }}>{error}</p>}
    </div>
  );
}
