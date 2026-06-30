"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(244, 67, 54, 0.15)", border: "1px solid rgba(244, 67, 54, 0.4)" }}
        >
          <AlertTriangle className="w-8 h-8" style={{ color: "var(--color-error)" }} />
        </div>

        <h1 className="font-display text-xl font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Une erreur est survenue
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir au tableau de bord.
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
          <Button asChild>
            <a href="/dashboard">Tableau de bord</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
