import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, current_step, updated_at")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gradient mb-1">
          Tableau de bord
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Bonjour, {user?.email} — Gérez vos dossiers RS en cours.
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <a href="/projet/nouveau" className="btn-primary inline-block">
          + Nouveau projet RS
        </a>
      </div>

      {/* Liste des projets */}
      {!projects || projects.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="font-display text-lg mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Aucun projet pour l&apos;instant
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Commencez par créer votre premier dossier RS.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/projet/${project.id}`}
              className="card-glass p-5 flex items-center justify-between hover:border-opacity-60 transition-all block"
              style={{ borderColor: "rgba(107, 63, 160, 0.5)" }}
            >
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
                  {project.title}
                </h3>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Modifié le {new Date(project.updated_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StepBadge step={project.current_step} />
                <StatusBadge status={project.status} />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StepBadge({ step }: { step: number }) {
  return (
    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: "var(--color-bg-elevated)", color: "var(--color-accent-cyan)" }}>
      Étape {step}/7
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    draft:       { label: "Brouillon",   color: "var(--color-text-muted)" },
    in_progress: { label: "En cours",    color: "var(--color-accent-orange)" },
    complete:    { label: "Terminé",     color: "var(--color-accent-green)" },
    archived:    { label: "Archivé",     color: "var(--color-text-muted)" },
  };
  const { label, color } = map[status] ?? map.draft;
  return (
    <span className="text-xs font-medium" style={{ color }}>
      {label}
    </span>
  );
}
