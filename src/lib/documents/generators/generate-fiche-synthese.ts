import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, AlignmentType, BorderStyle, HeadingLevel,
  Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK, COLOR_GREEN } from "../styles";

const B = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } as const;
const TABLE_BORDERS = { top: B, bottom: B, left: B, right: B, insideHorizontal: B, insideVertical: B };

function infoRow(label: string, value: string, index: number) {
  const bg = index % 2 === 0 ? "F0EAF8" : "FAFAFA";
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: bg },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: "Calibri", size: 18, bold: true, color: COLOR_DARK })] })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: bg },
        children: [new Paragraph({ children: [new TextRun({ text: value, font: "Calibri", size: 18 })] })],
      }),
    ],
  });
}

export async function generateFicheSynthese(data: ProjectData): Promise<Buffer> {
  const analysis = data.uniqueness_analysis as Record<string, unknown> | null;
  const recommandation = analysis?.recommandation as string | null;
  const objectifs = analysis?.objectifs_L6313_3 as string[] | null;
  const axesDiff = analysis?.axes_differenciation as string[] | null;

  const dureeTotal = data.step6?.programme?.duree_totale ?? "—";
  const modalites = data.step6?.programme?.modalites?.join(", ") ?? "—";
  const validation = data.step5?.validation ?? "totale";
  const dureeValidite = data.step5?.duree_validite ?? "à vie";

  const scoreColor = data.uniqueness_score != null
    ? data.uniqueness_score >= 70 ? COLOR_GREEN
    : data.uniqueness_score >= 50 ? "FF8800"
    : "CC0000"
    : "999999";

  const infoRows: [string, string][] = [
    ["Intitulé de la certification", data.title],
    ["Organisme certificateur", data.organisation_name ?? "NéoTechno Formation"],
    ["Responsable du dossier", data.author_name ?? "—"],
    ["Domaine professionnel", data.domain ?? "—"],
    ["Public visé", data.target_audience ?? "—"],
    ["Durée totale de formation", dureeTotal],
    ["Modalités pédagogiques", modalites],
    ["Nombre d'activités-types", String(data.activities.length || "—")],
    ["Nombre de compétences", String(data.competences.length || "—")],
    ["Type de validation", validation],
    ["Durée de validité", dureeValidite],
    ["Date de génération", data.generated_date],
  ];

  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        new Paragraph({
          children: [new TextRun({ text: "FICHE DESCRIPTIVE SYNTHÉTIQUE", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
          heading: HeadingLevel.TITLE,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Répertoire Spécifique — France Compétences", font: "Calibri", size: 20, color: COLOR_ACCENT, italics: true })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Décret n°2025-500 du 6 juin 2025 — Vademecum FC janvier 2026`, font: "Calibri", size: 16, color: "888888", italics: true })],
          spacing: { after: 320 },
        }),

        /* Score d'unicité — mis en avant */
        new Paragraph({ text: "Analyse d'unicité", heading: HeadingLevel.HEADING_2, spacing: { before: 0, after: 100 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 35, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.SOLID, color: "F0EAF8" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Score d'unicité estimé", font: "Calibri", size: 18, bold: true, color: COLOR_DARK })] })],
                }),
                new TableCell({
                  width: { size: 65, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.SOLID, color: "F0EAF8" },
                  children: [new Paragraph({ children: [new TextRun({ text: data.uniqueness_score != null ? `${data.uniqueness_score}/100` : "Non évalué", font: "Calibri", size: 18, bold: true, color: scoreColor })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "FAFAFA" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Recommandation FC", font: "Calibri", size: 18, bold: true, color: COLOR_DARK })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "FAFAFA" },
                  children: [new Paragraph({ children: [new TextRun({ text: recommandation ?? "—", font: "Calibri", size: 18, bold: true, color: recommandation?.startsWith("GO") ? COLOR_GREEN : recommandation === "STOP" ? "CC0000" : "333333" })] })],
                }),
              ],
            }),
          ],
        }),

        /* Tableau de synthèse principal */
        new Paragraph({ text: "Informations générales", heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          rows: infoRows.map(([label, value], i) => infoRow(label, value, i)),
        }),

        /* Concept */
        new Paragraph({ text: "Concept de la certification", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
        new Paragraph({
          children: [new TextRun({ text: data.concept_summary ?? "—", font: "Calibri", size: 20 })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Objectifs L.6313-3 */
        new Paragraph({ text: "Objectifs poursuivis — art. L.6313-3 (critère 1 ter)", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        ...(objectifs && objectifs.length > 0
          ? objectifs.map((o) =>
              new Paragraph({
                children: [new TextRun({ text: o, font: "Calibri", size: 20 })],
                bullet: { level: 0 },
                spacing: { after: 60 },
              })
            )
          : [new Paragraph({ children: [new TextRun({ text: "Non renseigné. Compléter l'étape 2.", font: "Calibri", size: 20, italics: true, color: "999999" })], spacing: { after: 80 } })]
        ),

        /* Axes de différenciation */
        ...(axesDiff && axesDiff.length > 0
          ? [
              new Paragraph({ text: "Axes de différenciation", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
              ...axesDiff.map((a) =>
                new Paragraph({
                  children: [new TextRun({ text: a, font: "Calibri", size: 20 })],
                  bullet: { level: 0 },
                  spacing: { after: 60 },
                })
              ),
            ]
          : []
        ),

        /* Compétences certifiées */
        new Paragraph({ text: "Compétences certifiées", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        ...data.competences.map((c) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${c.competence_code} — `, font: "Calibri", size: 20, bold: true, color: COLOR_ACCENT }),
              new TextRun({ text: c.competence_title, font: "Calibri", size: 20 }),
            ],
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        ),

        /* Voies d'accès */
        new Paragraph({ text: "Voies d'accès à la certification", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        ...([
          "Accès direct après formation préparatoire",
          "Validation des Acquis de l'Expérience (VAE) — voie d'accès obligatoire (Fiche 27 FC)",
          "Accessibilité PSH : modalités d'évaluation adaptées sur demande auprès du référent handicap",
        ]).map((item) =>
          new Paragraph({
            children: [new TextRun({ text: item, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 60 },
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
