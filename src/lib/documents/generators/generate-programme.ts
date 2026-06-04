import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, BorderStyle, HeadingLevel, AlignmentType, Packer,
} from "docx";
import { ProjectData, ProgrammeModule } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK } from "../styles";

export async function generateProgramme(data: ProjectData): Promise<Buffer> {
  /* Essaie de parser les modules depuis project_steps content si disponible */
  const modules: ProgrammeModule[] = data.programme ?? data.competences.map((c, i) => ({
    title: `Module ${i + 1} — ${c.competence_title}`,
    duration: "7h",
    modality: "Présentiel / Distanciel synchrone",
    competences: c.competence_code,
    content: c.competence_description ?? c.competence_title,
  }));

  const totalHours = modules.length * 7;

  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        new Paragraph({
          children: [new TextRun({ text: "PROGRAMME DE FORMATION", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
          heading: HeadingLevel.TITLE,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.title, font: "Calibri", size: 22, bold: true, color: COLOR_ACCENT })],
          spacing: { after: 400 },
        }),

        /* Informations générales */
        new Paragraph({ text: "1. Informations générales", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 120 } }),
        ...([
          ["Intitulé", data.title],
          ["Organisme", data.organisation_name ?? "NéoTechno Formation"],
          ["Domaine", data.domain ?? "—"],
          ["Public visé", data.target_audience ?? "—"],
          ["Durée totale estimée", `${totalHours}h`],
          ["Prérequis", "Maîtrise des bases du domaine professionnel ciblé"],
        ] as [string, string][]).map(([label, value]) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${label} : `, font: "Calibri", size: 20, bold: true }),
              new TextRun({ text: value, font: "Calibri", size: 20 }),
            ],
            spacing: { after: 80 },
          })
        ),

        /* Objectifs de formation */
        new Paragraph({ text: "2. Objectifs de formation", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } }),
        new Paragraph({
          children: [new TextRun({ text: "À l'issue de la formation, le stagiaire sera capable de :", font: "Calibri", size: 20 })],
          spacing: { after: 100 },
        }),
        ...data.competences.map((c) =>
          new Paragraph({
            children: [new TextRun({ text: c.competence_title, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        ),

        /* Programme détaillé */
        new Paragraph({ text: "3. Programme détaillé", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
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
              children: ["Module", "Contenu", "Durée", "Modalité", "Compétences"].map((h) =>
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLOR_DARK },
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: "Calibri", size: 16, bold: true, color: "FFFFFF" })] })],
                })
              ),
            }),
            ...modules.map((m, i) =>
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: m.title, font: "Calibri", size: 16, bold: true, color: COLOR_ACCENT })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: m.content, font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: m.duration, font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: m.modality, font: "Calibri", size: 16 })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: i % 2 === 0 ? "F0EAF8" : "FFFFFF" },
                    children: [new Paragraph({ children: [new TextRun({ text: m.competences, font: "Calibri", size: 16 })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        /* Modalités d'accès */
        new Paragraph({ text: "4. Modalités d'accès et accessibilité", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 120 } }),
        ...([
          "Délai d'accès : selon les sessions planifiées, généralement sous 4 semaines.",
          "Accessibilité PSH : modalités adaptées sur demande auprès du référent handicap.",
          "Modalités pédagogiques : présentiel, distanciel synchrone ou mixte selon les sessions.",
          "Évaluation en cours de formation et évaluation finale certificative.",
        ]).map((item) =>
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
