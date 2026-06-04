import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, BorderStyle, HeadingLevel, AlignmentType, Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK, COLOR_GREEN } from "../styles";

export async function generateReglementEvaluation(data: ProjectData): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        new Paragraph({
          children: [new TextRun({ text: "RÈGLEMENT D'ÉVALUATION", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
          heading: HeadingLevel.TITLE,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.title, font: "Calibri", size: 22, bold: true, color: COLOR_ACCENT })],
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `${data.organisation_name ?? "NéoTechno Formation"} — ${data.generated_date}`, font: "Calibri", size: 18, color: "666666" })],
          spacing: { after: 400 },
        }),

        /* Objet */
        new Paragraph({ text: "1. Objet et champ d'application", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 120 } }),
        new Paragraph({
          children: [new TextRun({
            text: `Le présent règlement d'évaluation définit les modalités, critères et indicateurs de réussite pour l'obtention de la certification "${data.title}" enregistrée au Répertoire Spécifique de France Compétences.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Tableau des évaluations */
        new Paragraph({ text: "2. Tableau des évaluations par compétence", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Code", "Compétence évaluée", "Modalité d'évaluation", "Critères", "Indicateurs de réussite"].map((h) =>
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLOR_DARK },
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: "Calibri", size: 16, bold: true, color: "FFFFFF" })] })],
                })
              ),
            }),
            ...data.evaluations.map((ev, i) =>
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.competence_code, font: "Calibri", size: 16, bold: true, color: COLOR_GREEN })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.competence_title, font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_modality ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_criteria ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_indicators ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        /* Règles générales */
        new Paragraph({ text: "3. Règles générales d'évaluation", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 120 } }),
        ...[
          "Toutes les compétences doivent être évaluées pour l'obtention de la certification.",
          "En cas d'échec sur une compétence, le candidat peut repasser l'évaluation de cette compétence uniquement.",
          "Les évaluations sont réalisées en langue française.",
          "Le jury d'évaluation est composé d'au moins un évaluateur externe à l'organisme de formation.",
          "Les résultats sont communiqués au candidat dans un délai de 15 jours ouvrés.",
        ].map((rule) =>
          new Paragraph({
            children: [new TextRun({ text: rule, font: "Calibri", size: 20 })],
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
