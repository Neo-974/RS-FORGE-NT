"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Critère FC — Intitulé conforme, public visé, prérequis, voies d'accès, VAE",
  2: "Critères 1, 1bis, 1ter — Unicité RS, promotions de titulaires, objectifs L.6313-3",
  3: "Critère 2 — Référentiel d'activités-types et compétences au format FC",
  4: "Critère 2b — Modalités d'évaluation, critères et indicateurs de réussite",
  5: "Critère 3 — Jury (majorité externe), organisation des épreuves, archivage",
  6: "Critères 1quater, 1quiquies, 4 — Moyens techniques, pédagogiques, programme",
  7: "Audit de conformité 9 critères + génération des 6 documents officiels",
};

interface Props {
  projectTitle: string;
  stepNumber: number;
  stepName: string;
  isComplete: boolean;
  projectId?: string;
}

export default function StepHeader({ projectTitle, stepNumber, stepName, isComplete }: Props) {
  return (
    <div
      className="px-4 py-3 flex items-center gap-4 border-b"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      {/* Bouton retour tableau de bord */}
      <Button variant="ghost" size="icon" asChild className="flex-shrink-0 h-8 w-8">
        <Link href="/dashboard" aria-label="Retour au tableau de bord">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </Button>

      {/* Numéro de l'étape */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
        style={{
          background: isComplete ? "var(--color-accent-green)" : "var(--gradient-neotechno)",
          color: isComplete ? "#0a0a0a" : "white",
        }}
      >
        {isComplete ? <CheckCircle className="w-4 h-4" /> : stepNumber}
      </div>

      {/* Titre + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h2 className="font-display text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
            {stepName}
          </h2>
          {isComplete && <Badge variant="default">Validée</Badge>}
        </div>
        <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>{projectTitle}</span>
          {" — "}
          {STEP_DESCRIPTIONS[stepNumber]}
        </p>
      </div>
    </div>
  );
}
