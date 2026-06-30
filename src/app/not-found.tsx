import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--gradient-neotechno)" }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 className="font-display text-6xl font-bold text-gradient mb-2">404</h1>
        <h2 className="font-display text-xl font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Page introuvable
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
        </Button>
      </div>
    </div>
  );
}
