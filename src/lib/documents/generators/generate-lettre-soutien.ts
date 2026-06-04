import {
  Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer,
} from "docx";
import { ProjectData } from "../types";
import { PAGE_MARGINS, COLOR_DARK } from "../styles";

export async function generateLettreSoutien(data: ProjectData): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: { page: { margin: PAGE_MARGINS } },
      children: [

        /* En-tête expéditeur */
        new Paragraph({
          children: [new TextRun({ text: data.author_name ?? "Prénom NOM", font: "Calibri", size: 22, bold: true })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.organisation_name ?? "NéoTechno Formation", font: "Calibri", size: 20 })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Saint-Pierre, Île de la Réunion", font: "Calibri", size: 20 })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.generated_date, font: "Calibri", size: 20 })],
          spacing: { after: 240 },
        }),

        /* Destinataire */
        new Paragraph({
          children: [new TextRun({ text: "À l'attention de France Compétences", font: "Calibri", size: 20, bold: true })],
          spacing: { after: 40 },
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [new TextRun({ text: "Commission de la certification professionnelle", font: "Calibri", size: 20 })],
          spacing: { after: 40 },
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [new TextRun({ text: "Répertoire Spécifique", font: "Calibri", size: 20 })],
          spacing: { after: 240 },
          alignment: AlignmentType.RIGHT,
        }),

        /* Objet */
        new Paragraph({
          children: [
            new TextRun({ text: "Objet : ", font: "Calibri", size: 20, bold: true }),
            new TextRun({ text: `Demande d'enregistrement au Répertoire Spécifique — "${data.title}"`, font: "Calibri", size: 20 }),
          ],
          spacing: { after: 240 },
        }),

        /* Corps de la lettre */
        new Paragraph({
          children: [new TextRun({ text: "Madame, Monsieur,", font: "Calibri", size: 20 })],
          spacing: { after: 160 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Nous avons l'honneur de vous soumettre la présente demande d'enregistrement de la certification intitulée "${data.title}" au Répertoire Spécifique de France Compétences.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Cette certification s'inscrit dans le domaine professionnel de ${data.domain ?? "l'enseignement et de la formation professionnelle"} et vise à certifier les compétences de ${data.target_audience ?? "professionnels en activité souhaitant se spécialiser"}.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({
            text: `Notre démarche est motivée par ${data.concept_summary ?? "la nécessité de répondre à des besoins professionnels identifiés sur le marché de l'emploi, non couverts par les certifications existantes."}`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({
            text: `La certification porte sur ${data.competences.length} compétence(s) répartie(s) en ${data.activities.length} activité(s) professionnelle(s). Le dossier complet (référentiel de certification, programme de formation, règlement d'évaluation et étude d'opportunité) est joint à la présente demande.`,
            font: "Calibri", size: 20,
          })],
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Nous restons disponibles pour tout renseignement complémentaire et vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.",
            font: "Calibri", size: 20,
          })],
          spacing: { after: 320 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        /* Signature */
        new Paragraph({
          children: [new TextRun({ text: data.author_name ?? "Prénom NOM", font: "Calibri", size: 20, bold: true })],
          spacing: { after: 40 },
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [new TextRun({ text: data.organisation_name ?? "NéoTechno Formation", font: "Calibri", size: 20 })],
          spacing: { after: 40 },
          alignment: AlignmentType.RIGHT,
        }),

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
