import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, AlignmentType, BorderStyle, HeadingLevel,
  Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK, COLOR_GREEN } from "../styles";

const B = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } as const;
const TABLE_BORDERS = { top: B, bottom: B, left: B, right: B, insideHorizontal: B, insideVertical: B };

function headerCell(text: string) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: COLOR_DARK },
    children: [new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 16, bold: true, color: "FFFFFF" })] })],
  });
}

function dataCell(text: string, rowIndex: number, opts?: { color?: string; bold?: boolean }) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: rowIndex % 2 === 0 ? "F8F4FC" : "FFFFFF" },
    children: [new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 16, bold: opts?.bold, color: opts?.color })] })],
  });
}

function labelPara(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label} : `, font: "Calibri", size: 20, bold: true }),
      new TextRun({ text: value, font: "Calibri", size: 20 }),
    ],
    spacing: { after: 80 },
  });
}

export async function generateReferentiel(data: ProjectData): Promise<Buffer> {
  const analysis = data.uniqueness_analysis as Record<string, unknown> | null;
  const objectifs = analysis?.objectifs_L6313_3 as string[] | null;

  const children = [

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

    /* ---- 1. INFORMATIONS GÉNÉRALES ---- */
    new Paragraph({ text: "1. INFORMATIONS GÉNÉRALES", heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 160 } }),
    ...[
      ["Intitulé de la certification", data.title],
      ["Domaine professionnel", data.domain ?? "—"],
      ["Public visé", data.target_audience ?? "—"],
      ["Organisme certificateur", data.organisation_name ?? "NéoTechno Formation"],
      ["Durée totale de formation", data.step6?.programme?.duree_totale ?? "—"],
      ["Type de validation", data.step5?.validation ?? "totale"],
      ["Durée de validité", data.step5?.duree_validite ?? "à vie"],
    ].map(([label, value]) => labelPara(label, value)),

    /* ---- 2. CONCEPT ET OBJECTIFS ---- */
    new Paragraph({ text: "2. CONCEPT ET OBJECTIFS", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 } }),
    new Paragraph({
      children: [new TextRun({ text: data.concept_summary ?? "—", font: "Calibri", size: 20 })],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),

    /* Objectifs L.6313-3 — critère 1ter */
    new Paragraph({ text: "Objectifs poursuivis (art. L.6313-3) — Critère 1 ter", heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 100 } }),
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

    /* Voies d'accès — VAE obligatoire */
    new Paragraph({ text: "Voies d'accès à la certification", heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 100 } }),
    ...([
      "Accès direct après formation préparatoire",
      "Validation des Acquis de l'Expérience (VAE) — voie obligatoire conformément à la Fiche 27 FC",
      "Accessibilité PSH : modalités d'évaluation contextualisées adaptées à la nature de chaque épreuve",
    ]).map((item) =>
      new Paragraph({
        children: [new TextRun({ text: item, font: "Calibri", size: 20 })],
        bullet: { level: 0 },
        spacing: { after: 60 },
      })
    ),

    /* ---- 3. RÉFÉRENTIEL D'ACTIVITÉS (RA) ---- */
    new Paragraph({ text: "3. RÉFÉRENTIEL D'ACTIVITÉS (RA)", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 160 } }),
    ...(data.activities.length > 0
      ? data.activities.flatMap((act) => [
          new Paragraph({
            children: [new TextRun({ text: `Activité ${act.activity_number} — ${act.activity_title}`, font: "Calibri", size: 22, bold: true, color: COLOR_ACCENT })],
            spacing: { before: 160, after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: act.activity_description ?? "—", font: "Calibri", size: 20 })],
            spacing: { after: 120 },
            alignment: AlignmentType.JUSTIFIED,
          }),
        ])
      : [new Paragraph({ children: [new TextRun({ text: "Aucune activité-type renseignée. Compléter l'étape 3.", font: "Calibri", size: 20, italics: true, color: "999999" })], spacing: { after: 80 } })]
    ),

    /* ---- 4. RÉFÉRENTIEL DE COMPÉTENCES (RC) ---- */
    new Paragraph({ text: "4. RÉFÉRENTIEL DE COMPÉTENCES (RC)", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 160 } }),

    /* Table synthétique code + titre + activité */
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: TABLE_BORDERS,
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Code", "Intitulé de la compétence", "Activité parente"].map(headerCell),
        }),
        ...data.competences.map((c, i) =>
          new TableRow({
            children: [
              dataCell(c.competence_code, i, { color: COLOR_ACCENT, bold: true }),
              dataCell(c.competence_title, i),
              dataCell(c.activity_number ? `A${c.activity_number}` : "—", i),
            ],
          })
        ),
      ],
    }),

    /* Descriptions complètes des compétences (format FC) */
    new Paragraph({ text: "Formulation complète des compétences (format FC)", heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 } }),
    ...data.competences.flatMap((c) => [
      new Paragraph({
        children: [
          new TextRun({ text: `${c.competence_code} — `, font: "Calibri", size: 20, bold: true, color: COLOR_GREEN }),
          new TextRun({ text: c.competence_title, font: "Calibri", size: 20, bold: true }),
        ],
        spacing: { before: 140, after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: c.competence_description ?? "—", font: "Calibri", size: 20 })],
        spacing: { after: 100 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    ]),

    /* ---- 5. RÉFÉRENTIEL D'ÉVALUATION (RE) ---- */
    new Paragraph({ text: "5. RÉFÉRENTIEL D'ÉVALUATION (RE)", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } }),
    ...(data.evaluations.length > 0
      ? [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: TABLE_BORDERS,
            rows: [
              new TableRow({
                tableHeader: true,
                children: ["Code", "Compétence évaluée", "Modalité d'évaluation", "Critères", "Indicateurs de réussite"].map(headerCell),
              }),
              ...data.evaluations.map((ev, i) =>
                new TableRow({
                  children: [
                    dataCell(ev.competence_code, i, { color: COLOR_GREEN, bold: true }),
                    dataCell(ev.competence_title, i),
                    dataCell(ev.evaluation_modality ?? "—", i),
                    dataCell(ev.evaluation_criteria ?? "—", i),
                    dataCell(ev.evaluation_indicators ?? "—", i),
                  ],
                })
              ),
            ],
          }),
        ]
      : [new Paragraph({ children: [new TextRun({ text: "Référentiel d'évaluation non renseigné. Compléter l'étape 4.", font: "Calibri", size: 20, italics: true, color: "999999" })], spacing: { after: 80 } })]
    ),

    /* Règles jury — obligatoires RS */
    new Paragraph({ text: "Règles du jury (décret 2025-500)", heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 } }),
    ...[
      `Composition : ${data.step5?.jury?.taille != null ? `${data.step5.jury.taille} membre(s)` : "À définir"}${data.step5?.jury?.membres_exterieurs ? ` — ${data.step5.jury.membres_exterieurs}` : ""}`,
      "Règle de majorité externe : strictement plus de 50 % des membres doivent être extérieurs à l'organisme de formation",
      "Les formateurs ayant assuré la formation des candidats évalués sont exclus du jury",
      "Jury de 2 membres : les 2 doivent être externes. Jury de 3 membres (recommandé) : minimum 2 externes",
      "Le PV d'évaluation mentionne TOUS les candidats (certifiés et non certifiés)",
    ].map((rule) =>
      new Paragraph({
        children: [new TextRun({ text: rule, font: "Calibri", size: 20 })],
        bullet: { level: 0 },
        spacing: { after: 60 },
      })
    ),

    /* ---- 6. ORGANISATION ET ARCHIVAGE ---- */
    new Paragraph({ text: "6. ORGANISATION ET ARCHIVAGE", heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } }),

    ...(data.step5?.archivage
      ? [
          new Paragraph({ text: "Archivage des PV et pièces d'évaluation", heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 100 } }),
          labelPara("Durée de conservation", data.step5.archivage.duree ?? "5 ans"),
          ...(data.step5.archivage.support ? [labelPara("Support", data.step5.archivage.support)] : []),
          ...(data.step5.archivage.responsable ? [labelPara("Responsable", data.step5.archivage.responsable)] : []),
        ]
      : [new Paragraph({ children: [new TextRun({ text: "Archivage : durée minimale 5 ans (exigence FC). Compléter l'étape 5.", font: "Calibri", size: 20, italics: true, color: "888888" })], spacing: { after: 80 } })]
    ),

    ...(data.step5?.conseil_perfectionnement?.composition
      ? [
          new Paragraph({ text: "Conseil de perfectionnement", heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 100 } }),
          ...(data.step5.conseil_perfectionnement.composition ? [labelPara("Composition", data.step5.conseil_perfectionnement.composition)] : []),
          ...(data.step5.conseil_perfectionnement.frequence ? [labelPara("Fréquence de réunion", data.step5.conseil_perfectionnement.frequence)] : []),
          ...(data.step5.conseil_perfectionnement.missions ? [labelPara("Missions", data.step5.conseil_perfectionnement.missions)] : []),
        ]
      : []
    ),

    /* ---- PIED DE PAGE ---- */
    new Paragraph({
      children: [new TextRun({ text: `Document généré par RS-Builder — NéoTechno Formation — ${data.generated_date}`, font: "Calibri", size: 16, color: "999999", italics: true })],
      spacing: { before: 400 },
      alignment: AlignmentType.CENTER,
    }),
  ];

  const doc = new Document({
    sections: [{ properties: { page: { margin: PAGE_MARGINS } }, children }],
  });

  return await Packer.toBuffer(doc);
}
