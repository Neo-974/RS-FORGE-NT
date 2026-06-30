/* Types partagés pour la génération de documents */

export interface ActivityData {
  activity_number: number;
  activity_title: string;
  activity_description: string | null;
}

export interface CompetenceData {
  competence_code: string;
  competence_title: string;
  competence_description: string | null;
  activity_number?: number;
}

export interface EvaluationData {
  competence_code: string;
  competence_title: string;
  evaluation_modality: string | null;
  evaluation_criteria: string | null;
  evaluation_indicators: string | null;
}

export interface ProgrammeModule {
  title: string;
  duration: string;
  modality: string;
  competences: string;
  content: string;
}

export interface JuryData {
  taille: number | null;
  membres_exterieurs: string | null;
  college_employeurs: string | null;
  college_salaries: string | null;
  habilitation: string | null;
}

export interface OrganisationData {
  responsable: string | null;
  convocation: string | null;
  deroulement: string | null;
  dysfonctionnements: string | null;
  resultats: string | null;
  rattrapage: string | null;
  delivrance: string | null;
  recours: string | null;
}

export interface Step5Content {
  jury: JuryData | null;
  organisation: OrganisationData | null;
  validation: string | null;
  duree_validite: string | null;
  archivage: { duree: string; support: string | null; responsable: string | null } | null;
  conseil_perfectionnement: { composition: string | null; frequence: string | null; missions: string | null } | null;
  mise_en_reseau: boolean | string | null;
  psh_amenagements?: string | null;
}

export interface Step6Content {
  contraintes_legales: { applicable: boolean; reglementation: string | null; prerequis_reglementaires: unknown[] | null } | null;
  moyens: { techniques: string | null; pedagogiques: string | null; encadrement: string | null; document_reference: string | null } | null;
  programme: { duree_totale: string | null; modalites: string[] | null; modules: ProgrammeModule[] | null } | null;
  transition_ecologique: string | null;
  transition_numerique: string | null;
  psh: { referent: boolean; temps: string | null; supports: string | null; ressources_humaines: string | null; locaux: string | null } | null;
}

export interface ProjectData {
  title: string;
  domain: string | null;
  target_audience: string | null;
  concept_summary: string | null;
  uniqueness_score: number | null;
  uniqueness_analysis: Record<string, unknown> | null;
  activities: ActivityData[];
  competences: CompetenceData[];
  evaluations: EvaluationData[];
  programme: ProgrammeModule[] | null;
  step5: Step5Content | null;
  step6: Step6Content | null;
  author_name: string | null;
  organisation_name: string | null;
  generated_date: string;
}
