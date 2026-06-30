/* Assemble toutes les données d'un projet depuis Supabase pour la génération de documents */
import { SupabaseClient } from "@supabase/supabase-js";
import { ProjectData, EvaluationData, CompetenceData, Step5Content, Step6Content, ProgrammeModule } from "./types";

export async function assembleProjectData(
  supabase: SupabaseClient,
  projectId: string
): Promise<ProjectData> {

  const [
    { data: project },
    { data: profile },
    { data: activities },
    { data: competences },
    { data: evaluations },
    { data: steps },
  ] = await Promise.all([
    supabase.from("projects").select("title,domain,target_audience,concept_summary,uniqueness_score,uniqueness_analysis,user_id").eq("id", projectId).single(),
    supabase.from("user_profiles").select("full_name,organisation_name"),
    supabase.from("referentiel_activites").select("activity_number,activity_title,activity_description").eq("project_id", projectId).order("activity_number"),
    supabase.from("referentiel_competences").select("competence_code,competence_title,competence_description,activity_id").eq("project_id", projectId).order("competence_code"),
    supabase.from("referentiel_evaluation").select("competence_id,evaluation_modality,evaluation_criteria,evaluation_indicators").eq("project_id", projectId),
    supabase.from("project_steps").select("step_number,content").eq("project_id", projectId),
  ]);

  /* Résout activity_id → activity_number via les compétences */
  const { data: activitiesById } = await supabase
    .from("referentiel_activites")
    .select("id,activity_number")
    .eq("project_id", projectId);

  const activityIdToNumber = new Map((activitiesById ?? []).map((a: { id: string; activity_number: number }) => [a.id, a.activity_number]));

  const enrichedCompetences: CompetenceData[] = (competences ?? []).map((c) => ({
    competence_code: c.competence_code,
    competence_title: c.competence_title,
    competence_description: c.competence_description,
    activity_number: c.activity_id ? activityIdToNumber.get(c.activity_id) : undefined,
  }));

  /* Résout competence_id → code + titre pour les évaluations */
  const { data: competencesById } = await supabase
    .from("referentiel_competences")
    .select("id,competence_code,competence_title")
    .eq("project_id", projectId);

  const compIdToData = new Map((competencesById ?? []).map((c: { id: string; competence_code: string; competence_title: string }) => [c.id, c]));

  const enrichedEvaluations: EvaluationData[] = (evaluations ?? []).map((ev) => {
    const comp = ev.competence_id ? compIdToData.get(ev.competence_id) : null;
    return {
      competence_code: comp?.competence_code ?? "—",
      competence_title: comp?.competence_title ?? "—",
      evaluation_modality: ev.evaluation_modality,
      evaluation_criteria: ev.evaluation_criteria,
      evaluation_indicators: ev.evaluation_indicators,
    };
  });

  const step5Raw = steps?.find((s) => s.step_number === 5)?.content ?? null;
  const step6Raw = steps?.find((s) => s.step_number === 6)?.content ?? null;

  const step5 = step5Raw as Step5Content | null;
  const step6 = step6Raw as Step6Content | null;

  /* Modules depuis step6 (structure imbriquée ou root-level pour compat) */
  const programme =
    step6?.programme?.modules ??
    ((step6Raw as Record<string, unknown> | null)?.modules as ProgrammeModule[] | undefined) ??
    null;

  const userProfile = profile ? (Array.isArray(profile) ? profile[0] : profile) : null;

  return {
    title: project?.title ?? "Sans titre",
    domain: project?.domain ?? null,
    target_audience: project?.target_audience ?? null,
    concept_summary: project?.concept_summary ?? null,
    uniqueness_score: project?.uniqueness_score ?? null,
    uniqueness_analysis: project?.uniqueness_analysis ?? null,
    activities: activities ?? [],
    competences: enrichedCompetences,
    evaluations: enrichedEvaluations,
    programme,
    step5,
    step6,
    author_name: userProfile?.full_name ?? null,
    organisation_name: userProfile?.organisation_name ?? "NéoTechno Formation",
    generated_date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
  };
}
