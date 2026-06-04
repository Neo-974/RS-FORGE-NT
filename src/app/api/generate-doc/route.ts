import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { assembleProjectData } from "@/lib/documents/assembler";
import { generateReferentiel } from "@/lib/documents/generators/generate-referentiel";
import { generateFicheSynthese } from "@/lib/documents/generators/generate-fiche-synthese";
import { generateEtudeOpportunite } from "@/lib/documents/generators/generate-etude-opportunite";
import { generateReglementEvaluation } from "@/lib/documents/generators/generate-reglement-evaluation";
import { generateProgramme } from "@/lib/documents/generators/generate-programme";
import { generateLettreSoutien } from "@/lib/documents/generators/generate-lettre-soutien";

const GENERATORS = {
  referentiel_complet:  { fn: generateReferentiel,        filename: "referentiel-complet.docx" },
  fiche_synthese:       { fn: generateFicheSynthese,       filename: "fiche-synthese.docx" },
  etude_opportunite:    { fn: generateEtudeOpportunite,    filename: "etude-opportunite.docx" },
  reglement_evaluation: { fn: generateReglementEvaluation, filename: "reglement-evaluation.docx" },
  programme_formation:  { fn: generateProgramme,           filename: "programme-formation.docx" },
  lettre_soutien:       { fn: generateLettreSoutien,       filename: "lettre-de-soutien.docx" },
} as const;

type DocType = keyof typeof GENERATORS;

export async function POST(request: NextRequest) {
  try {
    const { projectId, documentType } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "projectId manquant." }, { status: 400 });
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

    /* Assemble les données */
    const projectData = await assembleProjectData(supabase, projectId);

    /* Génération d'un document unique */
    if (documentType && documentType !== "all") {
      const gen = GENERATORS[documentType as DocType];
      if (!gen) return NextResponse.json({ error: "Type de document inconnu." }, { status: 400 });

      const buffer = await gen.fn(projectData);

      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${gen.filename}"`,
        },
      });
    }

    /* Génération de tous les documents en ZIP */
    const zip = new JSZip();
    const folderName = projectData.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    const folder = zip.folder(folderName)!;

    await Promise.all(
      Object.entries(GENERATORS).map(async ([, gen]) => {
        const buffer = await gen.fn(projectData);
        folder.file(gen.filename, buffer);
      })
    );

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    /* Sauvegarde en Supabase Storage */
    const storagePath = `${user.id}/${projectId}/dossier-rs-complet.zip`;
    await supabase.storage
      .from("generated-documents")
      .upload(storagePath, zipBuffer, {
        contentType: "application/zip",
        upsert: true,
      });

    return new Response(new Uint8Array(zipBuffer as Buffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="dossier-rs-${folderName}.zip"`,
      },
    });
  } catch (err) {
    console.error("[/api/generate-doc]", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération du document. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
