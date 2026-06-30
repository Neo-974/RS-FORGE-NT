"use client";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STEP_TOOLTIPS = [
  "Critères FC — Intitulé conforme, public visé, prérequis, VAE",
  "Critères 1, 1bis, 1ter — Unicité RS, promotions de titulaires, objectifs L.6313-3",
  "Critère 2 — Référentiel d'activités-types et compétences au format FC",
  "Critère 2 — Modalités d'évaluation, critères et indicateurs de réussite",
  "Critère 3 — Jury (majorité externe), organisation des épreuves, archivage",
  "Critères 1quater, 1quiquies, 4 — Moyens techniques, pédagogiques, programme",
  "Audit de conformité 9 critères + génération des 6 documents officiels",
];

const STEP_NAMES = [
  "Concept",
  "Opportunité",
  "Compétences",
  "Évaluation",
  "Procédures",
  "Programme",
  "Dossier",
];

interface Step {
  step_number: number;
  step_name: string;
  status: "pending" | "in_progress" | "complete";
}

interface Props {
  projectId: string;
  steps: Step[];
  currentStep: number;
}

export default function StepProgressBar({ projectId, steps, currentStep }: Props) {
  return (
    <div
      className="px-6 py-4 border-b"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-0 overflow-x-auto">
        {STEP_NAMES.map((shortName, i) => {
          const num = i + 1;
          const step = steps.find((s) => s.step_number === num);
          const status = step?.status ?? "pending";
          const isCurrent = num === currentStep;
          const isComplete = status === "complete";
          const isClickable = isComplete || isCurrent;

          return (
            <div key={num} className="flex items-center flex-shrink-0">
              {/* Connecteur */}
              {num > 1 && (
                <div
                  className="w-8 h-px flex-shrink-0"
                  style={{
                    background: isComplete
                      ? "var(--color-accent-green)"
                      : isCurrent
                      ? "var(--gradient-neotechno)"
                      : "var(--color-border)",
                  }}
                />
              )}

              {/* Étape */}
              <Tooltip>
                <TooltipTrigger asChild>
                  {isClickable ? (
                    <Link href={`/projet/${projectId}/etape/${num}`} className="flex flex-col items-center gap-1 group">
                      <StepCircle num={num} status={status} isCurrent={isCurrent} />
                      <span
                        className="text-xs whitespace-nowrap transition-colors"
                        style={{
                          color: isCurrent
                            ? "var(--color-accent-cyan)"
                            : isComplete
                            ? "var(--color-accent-green)"
                            : "var(--color-text-muted)",
                          fontWeight: isCurrent ? 600 : 400,
                        }}
                      >
                        {shortName}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
                      <StepCircle num={num} status={status} isCurrent={false} />
                      <span className="text-xs whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                        {shortName}
                      </span>
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px] text-center">
                  {STEP_TOOLTIPS[i]}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCircle({ num, status, isCurrent }: { num: number; status: string; isCurrent: boolean }) {
  if (status === "complete") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: "var(--color-accent-green)", color: "#0a0a0a", boxShadow: "var(--glow-green)" }}
      >
        ✓
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: "var(--gradient-neotechno)",
          color: "white",
          boxShadow: "var(--glow-cyan)",
        }}
      >
        {num}
      </div>
    );
  }

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
    >
      {num}
    </div>
  );
}
