"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NouveauProjetPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title: title.trim(),
        domain: domain.trim() || null,
        status: "draft",
        current_step: 1,
      })
      .select("id")
      .single();

    if (insertError || !project) {
      setError("Impossible de créer le projet. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    /* Pré-crée les 7 étapes avec statut pending */
    const stepNames = [
      "Concept & intitulé RS",
      "Opportunité & valeur d'usage",
      "Référentiel de compétences",
      "Référentiel d'évaluation",
      "Procédures d'organisation",
      "Contraintes légales & programme",
      "Validation & génération du dossier",
    ];

    await supabase.from("project_steps").insert(
      stepNames.map((name, i) => ({
        project_id: project.id,
        step_number: i + 1,
        step_name: name,
        status: i === 0 ? "in_progress" : "pending",
      }))
    );

    router.push(`/projet/${project.id}/etape/1`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-bg)" }}>
      <div className="w-full max-w-lg">

        {/* En-tête */}
        <div className="mb-8">
          <a href="/dashboard" className="text-sm mb-4 inline-flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
            ← Retour au tableau de bord
          </a>
          <h1 className="font-display text-2xl font-bold text-gradient mt-2">
            Nouveau projet RS
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Donnez un nom à votre projet pour commencer. L&apos;assistant vous guidera ensuite étape par étape.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
          <div>
            <label className="form-label" htmlFor="title">
              Nom du projet <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Ex : Certification IA Générative pour Formateurs"
              maxLength={150}
            />
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Il s&apos;agit d&apos;un titre provisoire, vous pourrez le modifier plus tard.
            </p>
          </div>

          <div>
            <label className="form-label" htmlFor="domain">
              Domaine professionnel <span style={{ color: "var(--color-text-muted)" }}>(optionnel)</span>
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="input-field"
              placeholder="Ex : Intelligence Artificielle, Modélisation 3D, Numérique…"
              maxLength={100}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {/* Aperçu des 7 étapes */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--color-bg-elevated)" }}>
            <p className="text-xs font-medium mb-3" style={{ color: "var(--color-text-secondary)" }}>
              Votre parcours en 7 étapes :
            </p>
            {[
              { name: "Concept & intitulé RS", hint: "Critère FC — Intitulé conforme, public, prérequis" },
              { name: "Opportunité & valeur d'usage", hint: "Critère FC n°1 — Analyse RS + preuves marché" },
              { name: "Référentiel de compétences", hint: "Critère FC n°2 — Format verbe + quoi + finalité" },
              { name: "Référentiel d'évaluation", hint: "Critère FC n°2 — Modalités, critères, indicateurs" },
              { name: "Procédures d'organisation", hint: "Critère FC n°3 — Jury 50% externe, règlement" },
              { name: "Contraintes légales & programme", hint: "Critère FC n°4 — Légal + formation certifiante" },
              { name: "Validation & génération du dossier", hint: "Audit de conformité + 6 documents officiels" },
            ].map(({ name, hint }, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: i === 0 ? "var(--gradient-neotechno)" : "var(--color-bg-card)",
                    color: i === 0 ? "white" : "var(--color-text-muted)",
                    border: i === 0 ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-xs font-medium" style={{ color: i === 0 ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                    {name}
                  </span>
                  <span className="block text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
                    {hint}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading || !title.trim()} className="btn-primary w-full">
            {loading ? "Création en cours…" : "Commencer le projet →"}
          </button>
        </form>
      </div>
    </div>
  );
}
