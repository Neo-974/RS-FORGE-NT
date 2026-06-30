import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const RESULT_LABELS: Record<string, string> = {
  certifie:            "Certifié",
  non_certifie:        "Non certifié",
  absent_justifie:     "Absent justifié",
  absent_non_justifie: "Absent non justifié",
};

const STATUS_LABELS: Record<string, string> = {
  salarie:          "Salarié",
  independant:      "Indépendant / Freelance",
  demandeur_emploi: "Demandeur d'emploi",
  etudiant:         "Étudiant",
  autre:            "Autre",
};

const EVOLUTION_LABELS: Record<string, string> = {
  promotion:          "Promotion / Changement de poste",
  augmentation:       "Augmentation de salaire",
  nouvelles_missions: "Nouvelles missions",
  creation_activite:  "Création d'activité",
  reconversion:       "Reconversion professionnelle",
  sans_changement:    "Sans changement notable",
  non_renseigne:      "Non renseigné",
};

function escapeCsv(val: string | null | undefined): string {
  if (!val) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId manquant." }, { status: 400 });

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
      .select("id, title")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    if (!project) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });

    /* Récupération des données */
    const { data: sessions } = await supabase
      .from("promotions_sessions")
      .select("*")
      .eq("project_id", projectId)
      .order("session_number");

    const sessionIds = (sessions ?? []).map((s: { id: string }) => s.id);

    const { data: titulaires } = await supabase
      .from("promotions_titulaires")
      .select("*")
      .in("session_id", sessionIds.length > 0 ? sessionIds : [""])
      .order("session_id, last_name");

    /* Construction du CSV — format tableur FC */
    const headers = [
      "N° Session",
      "Nom session",
      "Date évaluation",
      "Lieu",
      "Nom",
      "Prénom",
      "Résultat",
      "Poste avant",
      "Employeur avant",
      "Secteur avant",
      "Statut avant",
      "Poste après",
      "Employeur après",
      "Délai suivi",
      "Type d'évolution",
      "Détails évolution",
    ];

    const sessionMap = new Map((sessions ?? []).map((s: Record<string, unknown>) => [s.id as string, s]));

    const rows = (titulaires ?? []).map((t: Record<string, string | null>) => {
      const s = sessionMap.get(t.session_id as string) as Record<string, string | null> | undefined;
      return [
        s?.session_number ?? "",
        s?.session_name ?? "",
        s?.eval_date ? new Date(s.eval_date).toLocaleDateString("fr-FR") : "",
        s?.location ?? "",
        t.last_name ?? "",
        t.first_name ?? "",
        RESULT_LABELS[t.result ?? ""] ?? t.result ?? "",
        t.job_title_before ?? "",
        t.employer_before ?? "",
        t.sector_before ?? "",
        STATUS_LABELS[t.status_before ?? ""] ?? t.status_before ?? "",
        t.job_title_after ?? "",
        t.employer_after ?? "",
        t.follow_up_delay === "3_mois" ? "3 mois" : t.follow_up_delay === "6_mois" ? "6 mois" : "Non renseigné",
        EVOLUTION_LABELS[t.evolution_type ?? ""] ?? t.evolution_type ?? "",
        t.evolution_details ?? "",
      ].map((v) => escapeCsv(String(v)));
    });

    const csvLines = [
      `# Tableur Promotions de Titulaires — ${project.title}`,
      `# Critère 1 bis RS — Décret 2025-500 — Généré le ${new Date().toLocaleDateString("fr-FR")}`,
      "",
      headers.map(escapeCsv).join(","),
      ...rows.map((r) => r.join(",")),
    ];

    const csv = csvLines.join("\r\n");
    const bom = "﻿"; // BOM UTF-8 pour Excel

    return new Response(bom + csv, {
      headers: {
        "Content-Type":        "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="promotions-titulaires-FC.csv"`,
      },
    });
  } catch (err) {
    console.error("[/api/promotions/export]", err);
    return NextResponse.json({ error: "Erreur lors de l'export." }, { status: 500 });
  }
}
