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

        /* Composition du jury */
        new Paragraph({ text: "3. Composition et règles du jury", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 120 } }),
        ...(data.step5?.jury
          ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "Taille du jury : ", font: "Calibri", size: 20, bold: true }),
                  new TextRun({ text: data.step5.jury.taille != null ? `${data.step5.jury.taille} membre(s)` : "Non renseigné", font: "Calibri", size: 20 }),
                ],
                spacing: { after: 80 },
              }),
              ...(data.step5.jury.membres_exterieurs
                ? [new Paragraph({ children: [new TextRun({ text: `Membres extérieurs : ${data.step5.jury.membres_exterieurs}`, font: "Calibri", size: 20 })], spacing: { after: 80 } })]
                : []
              ),
              ...(data.step5.jury.college_employeurs
                ? [new Paragraph({ children: [new TextRun({ text: `Collège employeurs : ${data.step5.jury.college_employeurs}`, font: "Calibri", size: 20 })], spacing: { after: 80 } })]
                : []
              ),
              ...(data.step5.jury.college_salaries
                ? [new Paragraph({ children: [new TextRun({ text: `Collège salariés / praticiens : ${data.step5.jury.college_salaries}`, font: "Calibri", size: 20 })], spacing: { after: 80 } })]
                : []
              ),
              ...(data.step5.jury.habilitation
                ? [new Paragraph({ children: [new TextRun({ text: `Procédure d'habilitation : ${data.step5.jury.habilitation}`, font: "Calibri", size: 20 })], spacing: { after: 80 } })]
                : []
              ),
            ]
          : [new Paragraph({ children: [new TextRun({ text: "Composition du jury non renseignée. Compléter l'étape 5.", font: "Calibri", size: 20, italics: true, color: "999999" })], spacing: { after: 80 } })]
        ),

        /* Règle majorité externe — obligatoire RS */
        new Paragraph({
          children: [new TextRun({ text: "Règle de majorité externe (décret 2025-500) :", font: "Calibri", size: 20, bold: true })],
          spacing: { before: 160, after: 60 },
        }),
        ...[
          "La majorité des membres du jury (strictement >50 %) doit être externe à l'organisme de formation.",
          "Les formateurs ayant assuré la formation des candidats évalués sont exclus du jury.",
          "Jury de 2 membres : les 2 doivent être externes. Jury de 3 membres (recommandé) : 2 externes minimum.",
          "Le PV d'évaluation mentionne tous les candidats (certifiés et non certifiés).",
        ].map((rule) =>
          new Paragraph({
            children: [new TextRun({ text: rule, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        ),

        /* Organisation */
        new Paragraph({ text: "4. Organisation des épreuves", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }),
        ...(data.step5?.organisation
          ? Object.entries({
              "Responsable organisateur": data.step5.organisation.responsable,
              "Modalités de convocation": data.step5.organisation.convocation,
              "Déroulement de l'épreuve": data.step5.organisation.deroulement,
              "Gestion des dysfonctionnements": data.step5.organisation.dysfonctionnements,
              "Communication des résultats": data.step5.organisation.resultats,
              "Conditions de rattrapage": data.step5.organisation.rattrapage,
              "Format du certificat": data.step5.organisation.delivrance,
              "Voies de recours": data.step5.organisation.recours,
            })
              .filter(([, v]) => v != null)
              .map(([label, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${label} : `, font: "Calibri", size: 20, bold: true }),
                    new TextRun({ text: String(value), font: "Calibri", size: 20 }),
                  ],
                  spacing: { after: 80 },
                })
              )
          : [new Paragraph({ children: [new TextRun({ text: "Organisation non renseignée. Compléter l'étape 5.", font: "Calibri", size: 20, italics: true, color: "999999" })], spacing: { after: 80 } })]
        ),

        /* Validation et durée de validité */
        new Paragraph({ text: "5. Validation et durée de validité", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }),
        new Paragraph({
          children: [
            new TextRun({ text: "Type de validation : ", font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: data.step5?.validation ?? "totale", font: "Calibri", size: 20 }),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Durée de validité : ", font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: data.step5?.duree_validite ?? "à vie", font: "Calibri", size: 20 }),
          ],
          spacing: { after: 80 },
        }),

        /* PSH */
        new Paragraph({ text: "6. Accessibilité — Personnes en situation de handicap (PSH)", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }),
        new Paragraph({
          children: [new TextRun({
            text: data.step5?.psh_amenagements
              ?? "Les aménagements d'évaluation pour les personnes en situation de handicap sont définis de manière contextualisée selon la nature de chaque épreuve. Contacter le référent handicap de l'organisme.",
            font: "Calibri", size: 20,
          })],
          spacing: { after: 80 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Règles générales */
        new Paragraph({ text: "7. Règles générales d'évaluation", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }),
        ...[
          "Toutes les compétences doivent être évaluées pour l'obtention de la certification.",
          "En cas d'échec sur une compétence, le candidat peut repasser l'évaluation de cette compétence uniquement.",
          "Les évaluations sont réalisées en langue française.",
          "Les résultats sont communiqués au candidat dans les délais fixés au point 4.",
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
