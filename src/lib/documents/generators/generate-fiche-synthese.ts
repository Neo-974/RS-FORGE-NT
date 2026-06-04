import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, AlignmentType, BorderStyle, HeadingLevel,
  Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK } from "../styles";

export async function generateFicheSynthese(data: ProjectData): Promise<Buffer> {
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
          spacing: { after: 400 },
        }),

        /* Tableau de synthèse principal */
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
            ...([
              ["Intitulé de la certification", data.title],
              ["Organisme certificateur", data.organisation_name ?? "NéoTechno Formation"],
              ["Responsable du dossier", data.author_name ?? "—"],
              ["Domaine professionnel", data.domain ?? "—"],
              ["Public visé", data.target_audience ?? "—"],
              ["Nombre de compétences", String(data.competences.length)],
              ["Nombre d'activités", String(data.activities.length)],
              ["Score d'unicité estimé", data.uniqueness_score != null ? `${data.uniqueness_score}/100` : "—"],
              ["Date de génération", data.generated_date],
            ] as [string, string][]).map(([label, value], i) =>
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FAFAFA" },
                    children: [new Paragraph({ children: [new TextRun({ text: label, font: "Calibri", size: 18, bold: true, color: COLOR_DARK })] })],
                  }),
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FAFAFA" },
                    children: [new Paragraph({ children: [new TextRun({ text: value, font: "Calibri", size: 18 })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        /* Résumé du concept */
        new Paragraph({ text: "Résumé du concept", heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 } }),
        new Paragraph({
          children: [new TextRun({ text: data.concept_summary ?? "—", font: "Calibri", size: 20 })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Liste des compétences */
        new Paragraph({ text: "Compétences certifiées", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 } }),
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
