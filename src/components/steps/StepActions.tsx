"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  projectId: string;
  stepNumber: number;
  isComplete: boolean;
  isLastStep: boolean;
}

export default function StepActions({ projectId, stepNumber, isComplete, isLastStep }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Enregistrement…");
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleValidate() {
    setConfirmOpen(false);
    setLoading(true);
    const supabase = createClient();

    /* Extraction des données structurées depuis la conversation (étapes 1-6) */
    if (stepNumber <= 6) {
      setLoadingLabel("Extraction des données…");
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await fetch("/api/extract-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ projectId, stepNumber }),
        }).catch(() => {/* extraction best-effort */});
      }
      setLoadingLabel("Enregistrement…");
    }

    /* Marque l'étape courante comme complète */
    await supabase
      .from("project_steps")
      .update({ status: "complete", completed_at: new Date().toISOString() })
      .eq("project_id", projectId)
      .eq("step_number", stepNumber);

    if (!isLastStep) {
      await supabase
        .from("project_steps")
        .update({ status: "in_progress" })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber + 1);

      await supabase
        .from("projects")
        .update({ current_step: stepNumber + 1, status: "in_progress" })
        .eq("id", projectId);

      toast({
        variant: "success",
        title: `Étape ${stepNumber} validée ✓`,
        description: `Passage à l'étape ${stepNumber + 1}…`,
      });

      router.push(`/projet/${projectId}/etape/${stepNumber + 1}`);
    } else {
      await supabase
        .from("projects")
        .update({ status: "complete" })
        .eq("id", projectId);

      toast({
        variant: "success",
        title: "Dossier RS finalisé ✓",
        description: "Vos 6 documents sont prêts à être générés.",
      });

      router.push(`/projet/${projectId}/documents`);
    }

    router.refresh();
    setLoading(false);
  }

  /* Étape déjà validée → lien vers la suivante */
  if (isComplete && !isLastStep) {
    return (
      <div
        className="px-6 py-3 border-t flex items-center justify-between"
        style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
      >
        <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-accent-green)" }}>
          <CheckCircle className="w-4 h-4" />
          Étape validée
        </p>
        <Button variant="default" size="sm" asChild>
          <a href={`/projet/${projectId}/etape/${stepNumber + 1}`}>
            Étape suivante <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="px-6 py-3 border-t flex items-center justify-between"
        style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Quand l&apos;assistant a validé cette étape avec vous, cliquez sur le bouton.
        </p>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={loading || isComplete}
          variant="default"
          size="sm"
          className="flex-shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {loadingLabel}
            </>
          ) : isLastStep ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Finaliser le dossier
            </>
          ) : (
            <>
              Valider et continuer
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Modal de confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isLastStep ? "Finaliser le dossier RS ?" : `Valider l'étape ${stepNumber} ?`}
            </DialogTitle>
            <DialogDescription>
              {isLastStep
                ? "Cette action marquera votre dossier comme complet et vous donnera accès à la génération des 6 documents officiels."
                : `L'étape ${stepNumber} sera marquée comme complète et les données extraites seront sauvegardées. Vous pourrez revenir la consulter mais pas la modifier.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="default" onClick={handleValidate}>
              {isLastStep ? "Finaliser" : "Valider l'étape"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
