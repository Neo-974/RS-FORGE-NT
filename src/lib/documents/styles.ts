/* Styles Word partagés — charte NéoTechno / France Compétences */
import {
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  convertInchesToTwip,
} from "docx";

export const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1.2),
  right: convertInchesToTwip(1.2),
};

/* Couleurs */
export const COLOR_DARK   = "1A1025";
export const COLOR_ACCENT = "00BCD4";
export const COLOR_GREEN  = "00E676";
export const COLOR_TEXT   = "2D1B3D";
export const COLOR_MUTED  = "7A6A8A";

/* Style : titre principal (H1) */
export const styleH1 = {
  heading: HeadingLevel.HEADING_1,
  run: {
    font: "Calibri",
    size: 28,
    bold: true,
    color: COLOR_DARK,
  },
  paragraph: {
    spacing: { after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_ACCENT },
    },
  },
};

/* Style : sous-titre (H2) */
export const styleH2 = {
  heading: HeadingLevel.HEADING_2,
  run: {
    font: "Calibri",
    size: 22,
    bold: true,
    color: COLOR_TEXT,
  },
  paragraph: {
    spacing: { before: 240, after: 120 },
  },
};

/* Style : titre de section (H3) */
export const styleH3 = {
  heading: HeadingLevel.HEADING_3,
  run: {
    font: "Calibri",
    size: 18,
    bold: true,
    color: COLOR_ACCENT.replace("#", ""),
  },
  paragraph: {
    spacing: { before: 160, after: 80 },
  },
};

/* Style : texte courant */
export const styleBody = {
  run: {
    font: "Calibri",
    size: 20,
    color: COLOR_TEXT,
  },
  paragraph: {
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
  },
};

/* Style : texte mis en valeur (label) */
export const styleLabel = {
  run: {
    font: "Calibri",
    size: 18,
    bold: true,
    color: COLOR_MUTED,
  },
};

/* Largeurs colonnes tableau (en twips) */
export const TABLE_COL_WIDTHS = {
  small: 1000,
  medium: 2500,
  large: 5000,
  full: 8500,
};
