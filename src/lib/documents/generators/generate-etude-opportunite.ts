import {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  WidthType, ShadingType, BorderStyle, HeadingLevel, AlignmentType, Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_ACCENT, COLOR_DARK, COLOR_GREEN } from "../styles";

function para(text: string, opts?: { bold?: boolean; color?: string; size?: number; bullet?: boolean; after?: number; before?: number; italic?: boolean }) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: opts?.size ?? 20, bold: opts?.bold, color: opts?.color, italics: opts?.italic })],
    bullet: opts?.bullet ? { level: 0 } : undefined,
    spacing: { after: opts?.after ?? 80, before: opts?.before ?? 0 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function h1(text: string) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 160 } });
}

function h2(text: string) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } });
}

function labelValue(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label} : `, font: "Calibri", size: 20, bold: true }),
      new TextRun({ text: value, font: "Calibri", size: 20 }),
    ],
    spacing: { after: 80 },
  });
}

export async function generateEtudeOpportunite(data: ProjectData): Promise<Buffer> {
  const analysis = data.uniqueness_analysis as Record<string, unknown> | null;
  const etude = analysis?.etude_opportunite as Record<string, unknown> | null;
  const valeur = analysis?.valeur_usage as Record<string, unknown> | null;
  const objectifs = analysis?.objectifs_L6313_3 as string[] | null;
  const rsPproches = analysis?.rs_proches as Array<Record<string, string>> | null;
  const rncpVoisins = analysis?.rncp_voisins as Array<Record<string, string>> | null;
  const axesDiff = analysis?.axes_differenciation as string[] | null;
  const recommandation = analysis?.recommandation as string | null;

  const children = [
    new Paragraph({
      children: [new TextRun({ text: "ÉTUDE D'OPPORTUNITÉ", font: "Calibri", size: 32, bold: true, color: COLOR_DARK })],
      heading: HeadingLevel.TITLE,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.title, font: "Calibri", size: 24, bold: true, color: COLOR_ACCENT })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `${data.organisation_name ?? "NéoTechno Formation"} — ${data.generated_date}`, font: "Calibri", size: 18, color: "666666" })],
      spacing: { after: 400 },
    }),

    /* 1. Présentation de la certification */
    h1("1. Présentation de la certification"),
    labelValue("Intitulé", data.title),
    labelValue("Domaine", data.domain ?? "—"),
    labelValue("Public visé", data.target_audience ?? "—"),
    para(data.concept_summary ?? "Concept non renseigné. Compléter l'étape 1.", { after: 200 }),

    /* 2. Objectifs de la certification (art. L.6313-3) */
    h1("2. Objectifs poursuivis — art. L.6313-3 du Code du travail"),
    para("La présente certification poursuit les objectifs suivants parmi ceux définis à l'article L.6313-3 :"),
    ...(objectifs && objectifs.length > 0
      ? objectifs.map((o) => para(o, { bullet: true }))
      : [para("Non renseigné. Compléter l'étape 2.", { italic: true, color: "999999" })]
    ),

    /* 3. Situation actuelle du marché */
    h1("3. Situation actuelle et besoins identifiés"),
    para(
      etude?.situation_actuelle
        ? String(etude.situation_actuelle)
        : "Non renseigné. Compléter l'étape 2.",
      { after: 120 }
    ),

    ...(etude?.sources && Array.isArray(etude.sources) && etude.sources.length > 0
      ? [h2("Sources consultées"), ...(etude.sources as string[]).map((s) => para(s, { bullet: true }))]
      : []
    ),

    ...(etude?.evolution_marche
      ? [h2("Évolution du marché"), para(String(etude.evolution_marche))]
      : []
    ),

    ...(etude?.resultats_attendus
      ? [h2("Résultats attendus pour les individus et les entreprises"), para(String(etude.resultats_attendus))]
      : []
    ),

    /* 4. Analyse des certifications existantes */
    h1("4. Analyse des certifications RS voisines"),
    ...buildRSProchesTable(rsPproches),

    h1("5. Analyse des certifications RNCP voisines"),
    ...buildRNCPVoisinsTable(rncpVoisins),

    /* 5. Axes de différenciation */
    h1("6. Axes de différenciation"),
    ...(axesDiff && axesDiff.length > 0
      ? axesDiff.map((a) => para(a, { bullet: true }))
      : [para("Non renseigné.", { italic: true, color: "999999" })]
    ),

    /* 6. Valeur d'usage */
    h1("7. Valeur d'usage (critère 1 bis)"),
    labelValue(
      "Sessions pilotes réalisées",
      valeur?.sessions_realisees === true ? "Oui" : valeur?.sessions_realisees === false ? "Non" : "Non renseigné"
    ),

    ...(valeur?.preuves_disponibles && Array.isArray(valeur.preuves_disponibles) && (valeur.preuves_disponibles as string[]).length > 0
      ? [
          para("Preuves de valeur d'usage disponibles :", { bold: true, after: 60 }),
          ...(valeur.preuves_disponibles as string[]).map((p) => para(p, { bullet: true })),
        ]
      : []
    ),

    ...(valeur?.preuves_a_obtenir && Array.isArray(valeur.preuves_a_obtenir) && (valeur.preuves_a_obtenir as string[]).length > 0
      ? [
          para("Preuves à obtenir avant dépôt :", { bold: true, after: 60 }),
          ...(valeur.preuves_a_obtenir as string[]).map((p) => para(p, { bullet: true })),
        ]
      : []
    ),

    /* 7. Score et recommandation */
    h1("8. Score d'unicité et recommandation"),
    new Paragraph({
      children: [
        new TextRun({ text: "Score d'unicité estimé : ", font: "Calibri", size: 20, bold: true }),
        new TextRun({
          text: data.uniqueness_score != null ? `${data.uniqueness_score}/100` : "Non évalué",
          font: "Calibri", size: 20, bold: true,
          color: data.uniqueness_score != null
            ? data.uniqueness_score >= 70 ? COLOR_GREEN : data.uniqueness_score >= 50 ? "FF8800" : "CC0000"
            : "999999",
        }),
      ],
      spacing: { after: 120 },
    }),
    ...(recommandation
      ? [para(`Recommandation : ${recommandation}`, { bold: true, color: recommandation.startsWith("GO") ? COLOR_GREEN : "CC0000" })]
      : []
    ),

    /* 8. Voies d'accès */
    h1("9. Modalités d'accès à la certification"),
    para("Accès direct après formation", { bullet: true }),
    para("Validation des Acquis de l'Expérience (VAE) — voie d'accès obligatoire (Fiche 27 FC)", { bullet: true }),
    para("Accessibilité aux personnes en situation de handicap (PSH) — modalités contextualisées selon nature des évaluations", { bullet: true }),

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

function buildRSProchesTable(items: Array<Record<string, string>> | null | undefined) {
  if (!items || items.length === 0) {
    return [para("Aucune RS proche identifiée.", { italic: true, color: "999999" })];
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Code RS", "Titre", "Proximité", "Points communs"].map(headerCell),
        }),
        ...items.map((rs, i) =>
          new TableRow({
            children: [
              dataCell(rs.code ?? "—", i, COLOR_GREEN, true),
              dataCell(rs.titre ?? "—", i),
              dataCell(rs.proximite ?? "—", i),
              dataCell(rs.points_communs ?? "—", i),
            ],
          })
        ),
      ],
    }),
    new Paragraph({ spacing: { after: 120 } }),
  ];
}

function buildRNCPVoisinsTable(items: Array<Record<string, string>> | null | undefined) {
  if (!items || items.length === 0) {
    return [para("Aucun RNCP voisin identifié.", { italic: true, color: "999999" })];
  }

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Code RNCP", "Titre", "Niveau", "Risque"].map(headerCell),
        }),
        ...items.map((rncp, i) =>
          new TableRow({
            children: [
              dataCell(rncp.code ?? "—", i, COLOR_ACCENT, true),
              dataCell(rncp.titre ?? "—", i),
              dataCell(rncp.niveau ?? "—", i),
              dataCell(rncp.risque ?? "—", i),
            ],
          })
        ),
      ],
    }),
    new Paragraph({ spacing: { after: 120 } }),
  ];
}

function tableBorders() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
}

function headerCell(text: string) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: COLOR_DARK },
    children: [new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 16, bold: true, color: "FFFFFF" })] })],
  });
}

function dataCell(text: string, rowIndex: number, color?: string, bold?: boolean) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: rowIndex % 2 === 0 ? "F0EAF8" : "FFFFFF" },
    children: [new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 16, bold, color })] })],
  });
}
