import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, AlignmentType, BorderStyle, HeadingLevel,
  Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK, COLOR_GREEN } from "../styles";

export async function generateReferentiel(data: ProjectData): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        /* ---- EN-TÊTE ---- */
        new Paragraph({
          children: [new TextRun({ text: "RÉFÉRENTIEL DE CERTIFICATION", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
          heading: HeadingLevel.TITLE,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.title, font: "Calibri", size: 26, bold: true, color: COLOR_ACCENT })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Organisme : ${data.organisation_name ?? "NéoTechno Formation"}   |   `, font: "Calibri", size: 18, color: "666666" }),
            new TextRun({ text: `Date : ${data.generated_date}`, font: "Calibri", size: 18, color: "666666" }),
          ],
          spacing: { after: 400 },
        }),

        /* ---- INFORMATIONS GÉNÉRALES ---- */
        new Paragraph({ text: "1. INFORMATIONS GÉNÉRALES", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 160 } }),
        ...[
          ["Intitulé de la certification", data.title],
          ["Domaine professionnel", data.domain ?? "—"],
          ["Public visé", data.target_audience ?? "—"],
          ["Organisme certificateur", data.organisation_name ?? "NéoTechno Formation"],
        ].map(([label, value]) => new Paragraph({
          children: [
            new TextRun({ text: `${label} : `, font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: value, font: "Calibri", size: 20 }),
          ],
          spacing: { after: 80 },
        })),

        /* ---- CONCEPT ---- */
        new Paragraph({ text: "2. CONCEPT ET OBJECTIFS", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        new Paragraph({
          children: [new TextRun({ text: data.concept_summary ?? "—", font: "Calibri", size: 20 })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* ---- RÉFÉRENTIEL D'ACTIVITÉS ---- */
        new Paragraph({ text: "3. RÉFÉRENTIEL D'ACTIVITÉS (RA)", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
        ...data.activities.flatMap((act) => [
          new Paragraph({
            children: [new TextRun({ text: `Activité ${act.activity_number} — ${act.activity_title}`, font: "Calibri", size: 22, bold: true, color: COLOR_ACCENT })],
            spacing: { before: 160, after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: act.activity_description ?? "—", font: "Calibri", size: 20 })],
            spacing: { after: 120 },
            alignment: AlignmentType.JUSTIFIED,
          }),
        ]),

        /* ---- RÉFÉRENTIEL DE COMPÉTENCES ---- */
        new Paragraph({ text: "4. RÉFÉRENTIEL DE COMPÉTENCES (RC)", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
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
            /* En-tête */
            new TableRow({
              tableHeader: true,
              children: ["Code", "Intitulé de la compétence", "Activité"].map((h) =>
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLOR_DARK },
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: "Calibri", size: 18, bold: true, color: "FFFFFF" })] })],
                })
              ),
            }),
            /* Lignes */
            ...data.competences.map((c, i) =>
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: c.competence_code, font: "Calibri", size: 18, bold: true, color: COLOR_ACCENT })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: c.competence_title, font: "Calibri", size: 18 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: c.activity_number ? `A${c.activity_number}` : "—", font: "Calibri", size: 18 })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        /* ---- RÉFÉRENTIEL D'ÉVALUATION ---- */
        new Paragraph({ text: "5. RÉFÉRENTIEL D'ÉVALUATION (RE)", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } }),
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
              children: ["Compétence", "Modalité", "Critères", "Indicateurs"].map((h) =>
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLOR_DARK },
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: "Calibri", size: 18, bold: true, color: "FFFFFF" })] })],
                })
              ),
            }),
            ...data.evaluations.map((ev, i) =>
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: `${ev.competence_code}`, font: "Calibri", size: 16, bold: true, color: COLOR_GREEN })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_modality ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_criteria ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F8F4FC" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: ev.evaluation_indicators ?? "—", font: "Calibri", size: 16 })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        /* ---- PIED DE PAGE ---- */
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
