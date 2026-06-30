import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DocumentCard from "@/components/documents/DocumentCard";
import DownloadAllButton from "@/components/documents/DownloadAllButton";
import StepProgressBar from "@/components/steps/StepProgressBar";
import { Progress } from "@/components/ui/progress";

const DOCUMENTS = [
  {
    type: "referentiel_complet",
    title: "Référentiel complet",
    description: "Référentiel d'activités (RA) + référentiel de compétences (RC) + référentiel d'évaluation (RE). Document principal du dossier RS.",
    icon: "📋",
  },
  {
    type: "fiche_synthese",
    title: "Fiche descriptive synthétique",
    description: "Vue d'ensemble de la certification : intitulé, organisme, compétences, public visé. À joindre en première page du dossier.",
    icon: "📄",
  },
  {
    type: "etude_opportunite",
    title: "Étude d'opportunité",
    description: "Justification du projet, analyse du marché, unicité RS, valeur ajoutée et modalités d'accès.",
    icon: "🔍",
  },
  {
    type: "reglement_evaluation",
    title: "Règlement d'évaluation",
    description: "Modalités, critères et indicateurs de réussite pour chaque compétence. Règles générales du jury.",
    icon: "⚖️",
  },
  {
    type: "programme_formation",
    title: "Programme de formation",
    description: "Séquencement pédagogique, durée, modalités, objectifs par module et accessibilité PSH.",
    icon: "📚",
  },
  {
    type: "lettre_soutien",
    title: "Lettre de soutien",
    description: "Modèle de lettre officielle adressée à France Compétences pour accompagner le dépôt du dossier RS.",
    icon: "✉️",
  },
];

export default async function DocumentsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, status, current_step")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!project) notFound();

  const { data: steps } = await supabase
    .from("project_steps")
    .select("step_number, step_name, status")
    .eq("project_id", project.id)
    .order("step_number");

  /* Avertissement si les étapes ne sont pas toutes complètes */
  const completedSteps = (steps ?? []).filter((s) => s.status === "complete").length;
  const allComplete = completedSteps === 7;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-bg-primary)" }}>

      {/* Barre de progression */}
      <StepProgressBar projectId={project.id} steps={steps ?? []} currentStep={7} />

      <div className="flex-1 p-8 max-w-4xl w-full mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl font-bold text-gradient mb-1">
                Dossier RS — Documents
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {project.title}
              </p>
            </div>
            <DownloadAllButton projectId={project.id} />
          </div>
        </div>

        {/* Avertissement si dossier incomplet */}
        {!allComplete && (
          <div
            className="mb-6 px-5 py-4 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(255, 109, 0, 0.1)", border: "1px solid rgba(255, 109, 0, 0.3)" }}
          >
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-accent-orange)" }}>
                Dossier incomplet — {completedSteps}/7 étapes validées
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                Les documents peuvent être générés à tout moment, mais certaines sections seront incomplètes tant que toutes les étapes ne sont pas validées.
              </p>
            </div>
          </div>
        )}

        {/* Progression */}
        <div className="mb-6 flex items-center gap-3">
          <Progress value={Math.round((completedSteps / 7) * 100)} className="flex-1 h-2" />
          <span className="text-sm font-mono flex-shrink-0" style={{ color: "var(--color-text-secondary)" }}>
            {completedSteps}/7 étapes
          </span>
        </div>

        {/* Grille de documents */}
        <div className="space-y-4">
          {DOCUMENTS.map((doc) => (
            <DocumentCard
              key={doc.type}
              projectId={project.id}
              documentType={doc.type}
              title={doc.title}
              description={doc.description}
              icon={doc.icon}
            />
          ))}
        </div>

        {/* Instructions CERTIF PRO */}
        <div
          className="mt-8 p-6 rounded-xl"
          style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
        >
          <h3 className="font-display text-sm font-semibold mb-3" style={{ color: "var(--color-accent-cyan)" }}>
            Prochaines étapes — Soumission sur CERTIF PRO
          </h3>
          <ol className="space-y-2">
            {[
              "Téléchargez le dossier complet (.zip) contenant les 6 documents",
              "Connectez-vous sur certifpro.francecompetences.fr",
              "Créez un nouveau dossier RS et complétez le formulaire en ligne",
              "Importez chaque document Word dans la section correspondante",
              "Soumettez votre dossier et attendez la validation de France Compétences (délai : 4 à 9 mois)",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "var(--color-bg-elevated)", color: "var(--color-accent-cyan)" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
