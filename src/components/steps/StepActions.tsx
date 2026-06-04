"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
  stepNumber: number;
  isComplete: boolean;
  isLastStep: boolean;
}

export default function StepActions({ projectId, stepNumber, isComplete, isLastStep }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    setLoading(true);
    const supabase = createClient();

    /* Marque l'étape courante comme complète */
    await supabase
      .from("project_steps")
      .update({ status: "complete", completed_at: new Date().toISOString() })
      .eq("project_id", projectId)
      .eq("step_number", stepNumber);

    if (!isLastStep) {
      /* Active l'étape suivante */
      await supabase
        .from("project_steps")
        .update({ status: "in_progress" })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber + 1);

      /* Met à jour current_step sur le projet */
      await supabase
        .from("projects")
        .update({ current_step: stepNumber + 1, status: "in_progress" })
        .eq("id", projectId);

      router.push(`/projet/${projectId}/etape/${stepNumber + 1}`);
    } else {
      /* Dernière étape : marque le projet comme complet */
      await supabase
        .from("projects")
        .update({ status: "complete" })
        .eq("id", projectId);

      router.push(`/projet/${projectId}/documents`);
    }

    router.refresh();
    setLoading(false);
  }

  if (isComplete && !isLastStep) {
    return (
      <div
        className="px-6 py-3 border-t flex items-center justify-between"
        style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--color-accent-green)" }}>
          ✓ Étape validée
        </p>
        <a
          href={`/projet/${projectId}/etape/${stepNumber + 1}`}
          className="btn-primary text-sm"
        >
          Étape suivante →
        </a>
      </div>
    );
  }

  return (
    <div
      className="px-6 py-3 border-t flex items-center justify-between"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        Quand l&apos;assistant a validé cette étape avec vous, cliquez sur le bouton.
      </p>
      <button
        onClick={handleValidate}
        disabled={loading || isComplete}
        className="btn-primary text-sm flex-shrink-0"
      >
        {loading
          ? "Enregistrement…"
          : isLastStep
          ? "Finaliser le dossier ✓"
          : "Valider et continuer →"}
      </button>
    </div>
  );
}
