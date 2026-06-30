const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Critère FC : Définissez le concept, l'intitulé conforme et le public visé de votre certification RS.",
  2: "Critère FC n°1 : Analyse d'unicité RS + étude d'opportunité + preuves de valeur d'usage.",
  3: "Critère FC n°2 : Construisez le référentiel de compétences au format officiel France Compétences.",
  4: "Critère FC n°2 : Construisez le référentiel d'évaluation avec modalités, critères et indicateurs.",
  5: "Critère FC n°3 : Définissez les procédures d'organisation du jury et des épreuves de certification.",
  6: "Critère FC n°4 : Contraintes légales + programme de formation certifiante.",
  7: "Audit de conformité complet + génération des 6 documents officiels prêts pour CERTIF PRO.",
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
