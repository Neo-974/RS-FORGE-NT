import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FolderOpen, Clock, CheckCircle, Archive, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProjectActions from "@/components/dashboard/ProjectActions";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "warning" | "info" | "outline" }> = {
  draft:       { label: "Brouillon",  variant: "outline" },
  in_progress: { label: "En cours",   variant: "warning" },
  complete:    { label: "Terminé",    variant: "default" },
  archived:    { label: "Archivé",    variant: "secondary" },
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  draft:       FileText,
  in_progress: Clock,
  complete:    CheckCircle,
  archived:    Archive,
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, current_step, updated_at")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  const firstName = user?.email?.split("@")[0] ?? "David";

  return (
    <div className="p-8 max-w-5xl">
      {/* En-tête */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-gradient mb-1">
            Tableau de bord
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Bienvenue, <span style={{ color: "var(--color-text-secondary)" }}>{firstName}</span> — Gérez vos dossiers RS en cours.
          </p>
        </div>
        <Button asChild>
          <Link href="/projet/nouveau">
            <Plus className="w-4 h-4" />
            Nouveau projet RS
          </Link>
        </Button>
      </div>

      {/* Stats rapides */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total",      count: projects.length,                                       color: "var(--color-text-secondary)" },
            { label: "En cours",   count: projects.filter(p => p.status === "in_progress").length, color: "var(--color-accent-orange)" },
            { label: "Terminés",   count: projects.filter(p => p.status === "complete").length,    color: "var(--color-accent-green)" },
            { label: "Brouillons", count: projects.filter(p => p.status === "draft").length,       color: "var(--color-text-muted)" },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              <p className="text-2xl font-bold font-display" style={{ color }}>{count}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Liste des projets */}
      {!projects || projects.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center flex flex-col items-center gap-4"
          style={{ background: "var(--color-bg-card)", border: "1px dashed var(--color-border)" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--color-bg-elevated)" }}
          >
            <FolderOpen className="w-8 h-8" style={{ color: "var(--color-text-muted)" }} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold mb-1" style={{ color: "var(--color-text-secondary)" }}>
              Aucun projet pour l&apos;instant
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Commencez par créer votre premier dossier RS.
            </p>
          </div>
          <Button asChild className="mt-2">
            <Link href="/projet/nouveau">
              <Plus className="w-4 h-4" />
              Créer mon premier projet
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const { label, variant } = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft;
            const StatusIcon = STATUS_ICONS[project.status] ?? FileText;
            const progressPct = Math.round(((project.current_step - 1) / 7) * 100);

            return (
              <Link
                key={project.id}
                href={`/projet/${project.id}`}
                className="group rounded-xl p-5 flex items-center gap-5 transition-all hover:scale-[1.005]"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                }}
              >
                {/* Icône statut */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <StatusIcon className="w-5 h-5" style={{ color: "var(--color-accent-cyan)" }} />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
                      {project.title}
                    </h3>
                    <Badge variant={variant}>{label}</Badge>
                  </div>

                  {/* Barre de progression */}
                  <div className="flex items-center gap-3">
                    <Progress value={progressPct} className="h-1.5 flex-1" />
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
                      Étape {project.current_step}/7
                    </span>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs flex-shrink-0 hidden sm:block" style={{ color: "var(--color-text-muted)" }}>
                  {new Date(project.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </p>

                {/* Actions (stoppe la propagation du Link) */}
                <ProjectActions
                  projectId={project.id}
                  projectTitle={project.title}
                  status={project.status}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
