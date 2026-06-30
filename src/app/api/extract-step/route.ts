import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { EXTRACTION_PROMPTS } from "@/lib/claude/extraction/prompts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { projectId, stepNumber } = await request.json();

    if (!projectId || !stepNumber) {
      return NextResponse.json({ error: "projectId et stepNumber requis." }, { status: 400 });
    }

    /* Auth */
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Session invalide." }, { status: 401 });

    /* Vérification ownership */
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    if (!project) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

    /* Pas de prompt d'extraction pour l'étape 7 (génération) */
    const extractionPrompt = EXTRACTION_PROMPTS[stepNumber];
    if (!extractionPrompt) {
      return NextResponse.json({ success: true, skipped: true });
    }

    /* Récupère l'historique de conversation de cette étape */
    const { data: history } = await supabase
      .from("conversations")
      .select("role, content")
      .eq("project_id", projectId)
      .eq("step_number", stepNumber)
      .order("created_at");

    if (!history || history.length === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: "Aucune conversation." });
    }

    /* Appel Claude pour extraction JSON */
    const response = await anthropic.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system:     extractionPrompt,
      messages:   history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    /* Parse le JSON extrait */
    let extracted: Record<string, unknown>;
    try {
      /* Nettoie les éventuels blocs ```json ... ``` */
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      extracted = JSON.parse(cleaned);
    } catch {
      console.error(`[extract-step] JSON parse error step ${stepNumber}:`, rawText.slice(0, 200));
      return NextResponse.json({ success: false, error: "Extraction JSON invalide." }, { status: 422 });
    }

    /* Sauvegarde selon l'étape */
    await saveExtractedData(supabase, projectId, stepNumber, extracted);

    return NextResponse.json({ success: true, extracted });

  } catch (err) {
    console.error("[/api/extract-step]", err);
    return NextResponse.json({ error: "Erreur lors de l'extraction." }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/*  Sauvegarde des données extraites selon l'étape                     */
/* ------------------------------------------------------------------ */
async function saveExtractedData(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
  stepNumber: number,
  data: Record<string, unknown>
) {
  switch (stepNumber) {

    /* Étape 1 — Concept : mise à jour de projects */
    case 1: {
      const update: Record<string, unknown> = {};
      if (data.title)          update.title          = data.title;
      if (data.domain)         update.domain         = data.domain;
      if (data.target_audience) update.target_audience = data.target_audience;
      if (data.concept_summary) update.concept_summary = data.concept_summary;
      if (Object.keys(update).length > 0) {
        await supabase.from("projects").update(update).eq("id", projectId);
      }
      break;
    }

    /* Étape 2 — Unicité : mise à jour de projects */
    case 2: {
      const update: Record<string, unknown> = {};
      if (data.uniqueness_score != null) update.uniqueness_score = data.uniqueness_score;
      if (data.uniqueness_analysis)      update.uniqueness_analysis = data.uniqueness_analysis;
      if (Object.keys(update).length > 0) {
        await supabase.from("projects").update(update).eq("id", projectId);
      }
      break;
    }

    /* Étape 3 — Activités + Compétences */
    case 3: {
      /* Supprime l'existant avant de réinsérer (idempotent) */
      await supabase.from("referentiel_competences").delete().eq("project_id", projectId);
      await supabase.from("referentiel_activites").delete().eq("project_id", projectId);

      /* Insère les activités */
      const activities = (data.activities as Array<Record<string, unknown>> | undefined) ?? [];
      const activityIdMap = new Map<number, string>();

      if (activities.length > 0) {
        const { data: insertedActivities } = await supabase
          .from("referentiel_activites")
          .insert(activities.map((a) => ({
            project_id:           projectId,
            activity_number:      Number(a.activity_number),
            activity_title:       String(a.activity_title ?? ""),
            activity_description: a.activity_description ? String(a.activity_description) : null,
          })))
          .select("id, activity_number");

        (insertedActivities ?? []).forEach((a: { id: string; activity_number: number }) => {
          activityIdMap.set(a.activity_number, a.id);
        });
      }

      /* Insère les compétences */
      const competences = (data.competences as Array<Record<string, unknown>> | undefined) ?? [];
      if (competences.length > 0) {
        await supabase.from("referentiel_competences").insert(
          competences.map((c) => ({
            project_id:             projectId,
            activity_id:            c.activity_number ? (activityIdMap.get(Number(c.activity_number)) ?? null) : null,
            competence_code:        String(c.competence_code ?? ""),
            competence_title:       String(c.competence_title ?? ""),
            competence_description: c.competence_description ? String(c.competence_description) : null,
          }))
        );
      }
      break;
    }

    /* Étape 4 — Référentiel d'évaluation */
    case 4: {
      const evaluations = (data.evaluations as Array<Record<string, unknown>> | undefined) ?? [];
      if (evaluations.length === 0) break;

      /* Résout les codes compétences → IDs */
      const { data: competences } = await supabase
        .from("referentiel_competences")
        .select("id, competence_code")
        .eq("project_id", projectId);

      const codeToId = new Map(
        (competences ?? []).map((c: { id: string; competence_code: string }) => [c.competence_code, c.id])
      );

      /* Supprime l'existant */
      await supabase.from("referentiel_evaluation").delete().eq("project_id", projectId);

      await supabase.from("referentiel_evaluation").insert(
        evaluations.map((ev) => ({
          project_id:             projectId,
          competence_id:          codeToId.get(String(ev.competence_code ?? "")) ?? null,
          evaluation_modality:    ev.evaluation_modality  ? String(ev.evaluation_modality)  : null,
          evaluation_criteria:    ev.evaluation_criteria  ? String(ev.evaluation_criteria)  : null,
          evaluation_indicators:  ev.evaluation_indicators ? String(ev.evaluation_indicators) : null,
        }))
      );
      break;
    }

    /* Étapes 5 et 6 — Contenu sauvé dans project_steps.content */
    case 5:
    case 6: {
      await supabase
        .from("project_steps")
        .update({ content: data })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber);
      break;
    }
  }
}
