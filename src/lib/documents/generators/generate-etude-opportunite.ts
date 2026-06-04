import {
  Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK } from "../styles";

export async function generateEtudeOpportunite(data: ProjectData): Promise<Buffer> {
  const analysis = data.uniqueness_analysis as Record<string, unknown> | null;

  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        new Paragraph({
          children: [new TextRun({ text: "ÉTUDE D'OPPORTUNITÉ", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
          heading: HeadingLevel.TITLE,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.title, font: "Calibri", size: 22, bold: true, color: COLOR_ACCENT })],
          spacing: { after: 400 },
        }),

        /* 1. Contexte */
        new Paragraph({ text: "1. Contexte et justification du projet", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 160 } }),
        new Paragraph({
          children: [new TextRun({ text: data.concept_summary ?? "—", font: "Calibri", size: 20 })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* 2. Analyse du marché */
        new Paragraph({ text: "2. Analyse du marché de la certification", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        new Paragraph({
          children: [new TextRun({
            text: `Domaine professionnel ciblé : ${data.domain ?? "—"}`,
            font: "Calibri", size: 20, bold: true,
          })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Public visé : ${data.target_audience ?? "—"}`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 200 },
        }),

        /* 3. Analyse d'unicité */
        new Paragraph({ text: "3. Analyse d'unicité RS", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        new Paragraph({
          children: [
            new TextRun({ text: "Score d'unicité estimé : ", font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: data.uniqueness_score != null ? `${data.uniqueness_score}/100` : "Non évalué", font: "Calibri", size: 20, color: COLOR_ACCENT }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: analysis
              ? JSON.stringify(analysis, null, 2)
              : "Aucune analyse d'unicité disponible. L'étape 2 doit être complétée avant la génération de ce document.",
            font: "Calibri", size: 18,
          })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* 4. Valeur ajoutée */
        new Paragraph({ text: "4. Valeur ajoutée et différenciation", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        new Paragraph({
          children: [new TextRun({
            text: "La présente certification se distingue des certifications RS existantes par les éléments suivants :",
            font: "Calibri", size: 20,
          })],
          spacing: { after: 120 },
        }),
        ...data.competences.slice(0, 3).map((c) =>
          new Paragraph({
            children: [new TextRun({ text: `${c.competence_code} — ${c.competence_title}`, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        ),

        /* 5. Modalités d'accès */
        new Paragraph({ text: "5. Modalités d'accès à la certification", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        ...[
          "Accès direct après formation",
          "Validation des Acquis de l'Expérience (VAE) possible",
          "Accessibilité aux personnes en situation de handicap (PSH) — modalités adaptées sur demande",
        ].map((item) =>
          new Paragraph({
            children: [new TextRun({ text: item, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        ),

        new Paragraph({
          children: [new TextRun({ text: `Document généré par RS-Builder — NéoTechno Formation — ${data.generated_date}`, font: "Calibri", size: 16, color: "999999", italics: true })],
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}
