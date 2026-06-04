const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Définissez avec l'assistant le concept précis de votre certification RS.",
  2: "L'assistant analyse les certifications RS existantes pour évaluer l'unicité de votre projet.",
  3: "Construisez ensemble les activités-types du métier ciblé (3 à 5 activités).",
  4: "Rédigez les compétences au format France Compétences : verbe d'action + moyens + finalité.",
  5: "Définissez les modalités, critères et indicateurs d'évaluation pour chaque compétence.",
  6: "Structurez le programme de formation : durée, séquences, modalités pédagogiques.",
  7: "Validez le dossier complet et téléchargez les documents prêts pour CERTIF PRO.",
};

interface Props {
  projectTitle: string;
  stepNumber: number;
  stepName: string;
  isComplete: boolean;
}

export default function StepHeader({ projectTitle, stepNumber, stepName, isComplete }: Props) {
  return (
    <div
      className="px-6 py-3 flex items-center justify-between border-b"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Numéro de l'étape */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
          style={{ background: isComplete ? "var(--color-accent-green)" : "var(--gradient-neotechno)", color: isComplete ? "#0a0a0a" : "white" }}
        >
          {isComplete ? "✓" : stepNumber}
        </div>

        {/* Titre + description */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
              {stepName}
            </h2>
            {isComplete && (
              <span
                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(0, 230, 118, 0.15)", color: "var(--color-accent-green)" }}
              >
                Validée
              </span>
            )}
          </div>
          <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
            {projectTitle} — {STEP_DESCRIPTIONS[stepNumber]}
          </p>
        </div>
      </div>
    </div>
  );
}
