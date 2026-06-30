"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react";

const STEPS = [
  { name: "Concept & intitulé RS",           hint: "Critère FC — Intitulé conforme, public, prérequis, VAE" },
  { name: "Opportunité & valeur d'usage",     hint: "Critères 1, 1bis, 1ter — Unicité RS, promotions, L.6313-3" },
  { name: "Référentiel de compétences",       hint: "Critère 2 — Activités-types + compétences format FC" },
  { name: "Référentiel d'évaluation",         hint: "Critère 2b — Modalités, critères, indicateurs" },
  { name: "Procédures d'organisation",        hint: "Critère 3 — Jury >50% externe, épreuves, archivage" },
  { name: "Contraintes légales & programme",  hint: "Critères 1quater, 1quiquies, 4 — Légal + formation certifiante" },
  { name: "Validation & génération du dossier", hint: "Audit de conformité 9 critères + 6 documents officiels" },
];

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

    await supabase.from("project_steps").insert(
      STEPS.map((s, i) => ({
        project_id: project.id,
        step_number: i + 1,
        step_name: s.name,
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
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold text-gradient mt-2">
            Nouveau projet RS
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Donnez un nom à votre projet pour commencer. L&apos;assistant vous guidera ensuite étape par étape selon les 9 critères France Compétences.
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
              Titre provisoire — vous pourrez le préciser lors de l&apos;étape 1.
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

          {/* Aperçu du parcours */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-bg-elevated)" }}>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Votre parcours en 7 étapes (9 critères FC)
            </p>
            {STEPS.map(({ name, hint }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: i === 0 ? "var(--gradient-neotechno)" : "var(--color-bg-card)",
                    color: i === 0 ? "white" : "var(--color-text-muted)",
                    border: i === 0 ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-xs font-medium" style={{ color: i === 0 ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                    {name}
                  </span>
                  <span className="block text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {hint}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading || !title.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création en cours…
              </>
            ) : (
              <>
                Commencer le projet
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
