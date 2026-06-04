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
  author_name: string | null;
  organisation_name: string | null;
  generated_date: string;
}
