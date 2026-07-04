import {
  Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_DARK } from "../styles";

const B = { style: BorderStyle.SINGLE, size: 2, color: COLOR_DARK } as const;

/* Génère un courrier de soutien / attestation de valeur d'usage.
   Ce document est destiné à être rempli par un partenaire EXTERNE
   (entreprise, branche, OPCO, institution) — PAS par l'organisme certificateur.
   Format conforme aux exigences France Compétences (Vademecum 2026). */
export async function generateLettreSoutien(data: ProjectData): Promise<Buffer> {
  const today = data.generated_date;

  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        /* ---- AVERTISSEMENT FC ---- */
        new Paragraph({
          children: [
            new TextRun({
              text: "⚠️ IMPORTANT — Courrier de valeur d'usage (France Compétences)",
              font: "Calibri", size: 20, bold: true, color: "C0392B",
            }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Ce modèle doit être complété et signé par un PARTENAIRE EXTERNE (entreprise, branche professionnelle, OPCO, collectivité). Les courriers signés par des stagiaires ou anciens élèves sont NON RECEVABLES par France Compétences.",
            font: "Calibri", size: 18, italics: true, color: "C0392B",
          })],
          spacing: { after: 240 },
        }),

        /* ---- EN-TÊTE STRUCTURE SIGNATAIRE (à compléter) ---- */
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: B, bottom: B, left: B, right: B, insideHorizontal: B, insideVertical: B },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "F4F4F4" },
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "[LOGO DE LA STRUCTURE — obligatoire]", font: "Calibri", size: 18, bold: true, color: "999999", italics: true })], spacing: { after: 60 } }),
                    new Paragraph({ children: [new TextRun({ text: "[Nom et raison sociale de la structure]", font: "Calibri", size: 20, bold: true })], spacing: { after: 40 } }),
                    new Paragraph({ children: [new TextRun({ text: "[Adresse complète — SIRET si entreprise]", font: "Calibri", size: 18 })], spacing: { after: 40 } }),
                    new Paragraph({ children: [new TextRun({ text: "[Téléphone — Email — Site web]", font: "Calibri", size: 18 })], spacing: { after: 40 } }),
                  ],
                }),
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `[Ville], le ${today}`, font: "Calibri", size: 18 })], alignment: AlignmentType.RIGHT, spacing: { after: 80 } }),
                    new Paragraph({ children: [new TextRun({ text: "⚠️ Date récente obligatoire", font: "Calibri", size: 16, italics: true, color: "E67E22" })], alignment: AlignmentType.RIGHT }),
                    new Paragraph({ children: [new TextRun({ text: "(≤ 12 mois avant le dépôt)", font: "Calibri", size: 16, italics: true, color: "999999" })], alignment: AlignmentType.RIGHT }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { after: 240 } }),

        /* ---- DESTINATAIRE ---- */
        new Paragraph({
          children: [new TextRun({ text: "À l'attention de :", font: "Calibri", size: 20, bold: true })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `[Nom de l'organisme de formation] — ${data.organisation_name ?? "NéoTechno Formation"}`, font: "Calibri", size: 20 })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "(Ce courrier peut aussi être adressé directement à France Compétences)", font: "Calibri", size: 16, italics: true, color: "999999" })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 240 },
        }),

        /* ---- OBJET ---- */
        new Paragraph({
          children: [
            new TextRun({ text: "Objet : ", font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: `Attestation de valeur d'usage — Certification "${data.title}"`, font: "Calibri", size: 20 }),
          ],
          spacing: { after: 240 },
        }),

        /* ---- CORPS ---- */
        new Paragraph({
          children: [new TextRun({ text: "Madame, Monsieur,", font: "Calibri", size: 20 })],
          spacing: { after: 160 },
        }),

        /* Paragraphe 1 — Présentation de la structure et légitimité du signataire */
        new Paragraph({
          children: [new TextRun({
            text: "[Paragraphe 1 — Présentation de la structure et légitimité du signataire à s'exprimer sur ce sujet :]",
            font: "Calibri", size: 18, italics: true, color: "999999",
          })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Notre structure, [raison sociale], est [décrire l'activité, le secteur, la taille — ex : une entreprise de 50 salariés spécialisée dans…]. En qualité de [DRH / Responsable formation / Directeur / Représentant de branche], j'ai la légitimité de me prononcer sur les besoins en compétences de notre secteur et les effets observés de la formation certifiante dispensée par ${data.organisation_name ?? "NéoTechno Formation"}.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Paragraphe 2 — Besoins identifiés sur le marché */
        new Paragraph({
          children: [new TextRun({
            text: "[Paragraphe 2 — Besoins en compétences identifiés sur le marché du travail :]",
            font: "Calibri", size: 18, italics: true, color: "999999",
          })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Nous avons identifié un besoin réel et documenté en compétences de type "${data.title}" au sein de notre organisation / de notre secteur. Ce besoin se manifeste par [décrire : tensions de recrutement, lacunes identifiées, évolution réglementaire, transformation numérique, etc.]. Les compétences certifiées par "${data.title}" répondent directement à ces besoins car [expliquer le lien].`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Paragraphe 3 — Preuves d'utilisation effective (données quantitatives obligatoires) */
        new Paragraph({
          children: [new TextRun({
            text: "[Paragraphe 3 — Preuves d'utilisation effective OBLIGATOIRES (données quantitatives + bénéfices mesurés) :]",
            font: "Calibri", size: 18, italics: true, color: "C0392B",
          })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: `À ce jour, [N] collaborateurs / membres de notre réseau ont bénéficié de la formation certifiante "${data.title}" dispensée par ${data.organisation_name ?? "NéoTechno Formation"} depuis [date de début de collaboration].`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 100 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({ text: "Les effets concrets et mesurés que nous avons observés :", font: "Calibri", size: 20 })],
          spacing: { after: 80 },
        }),
        ...[
          "[Bénéfice 1 — quantifiable : ex. réduction de X% du temps de traitement des dossiers Y]",
          "[Bénéfice 2 — ex. prise en charge autonome de missions nécessitant auparavant un prestataire externe]",
          "[Bénéfice 3 RH éventuel : intégration dans la grille de classification, évolution de poste, augmentation de responsabilités]",
          "[Impact sur l'employabilité : taux d'insertion dans le métier visé, évolution salariale constatée si applicable]",
        ].map((item) =>
          new Paragraph({
            children: [new TextRun({ text: item, font: "Calibri", size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        ),

        new Paragraph({ spacing: { after: 160 } }),

        /* Paragraphe 4 — Conclusion */
        new Paragraph({
          children: [new TextRun({
            text: `Cette certification répond à un besoin avéré et actuel de notre secteur d'activité. Nous confirmons son utilité pour le marché du travail et soutenons sa demande d'enregistrement au Répertoire Spécifique de France Compétences.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Nous restons à la disposition de France Compétences pour tout renseignement complémentaire.",
            font: "Calibri", size: 20,
          })],
          spacing: { after: 320 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* ---- SIGNATURE (obligatoire : nom + fonction + tampon) ---- */
        new Paragraph({
          children: [new TextRun({ text: "Fait à [Ville], le [date]", font: "Calibri", size: 20 })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 240 },
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: B, bottom: B, left: B, right: B, insideHorizontal: B, insideVertical: B },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "F9F9F9" },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "Signataire — OBLIGATOIRE :", font: "Calibri", size: 18, bold: true })], spacing: { after: 60 } }),
                    new Paragraph({ children: [new TextRun({ text: "Nom Prénom : [à compléter]", font: "Calibri", size: 20 })], spacing: { after: 40 } }),
                    new Paragraph({ children: [new TextRun({ text: "Fonction : [DRH / Directeur / Responsable formation / Délégué de branche…]", font: "Calibri", size: 20 })], spacing: { after: 40 } }),
                    new Paragraph({ children: [new TextRun({ text: "Structure : [raison sociale]", font: "Calibri", size: 20 })], spacing: { after: 80 } }),
                    new Paragraph({ children: [new TextRun({ text: "Signature + Cachet de la structure :", font: "Calibri", size: 18, bold: true })], spacing: { after: 80 } }),
                    new Paragraph({ children: [new TextRun({ text: "\n\n\n\n[Espace pour signature et tampon]", font: "Calibri", size: 18, italics: true, color: "CCCCCC" })], spacing: { after: 40 } }),
                  ],
                }),
              ],
            }),
          ],
        }),

        /* ---- PIED DE PAGE ---- */
        new Paragraph({
          children: [new TextRun({ text: `Modèle généré par RS-Builder — NéoTechno Formation — ${today} | Format conforme Vademecum France Compétences 2026`, font: "Calibri", size: 14, color: "999999", italics: true })],
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}
