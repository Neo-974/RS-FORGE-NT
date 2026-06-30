export type ProjectStatus = "draft" | "in_progress" | "complete" | "archived";
export type StepStatus    = "pending" | "in_progress" | "complete";
export type DocumentType  = "referentiel_complet" | "fiche_synthese" | "etude_opportunite" | "reglement_evaluation" | "lettre_soutien" | "programme_formation";
export type FileFormat    = "docx" | "pdf";

export interface Project {
  id:                  string;
  user_id:             string;
  title:               string;
  status:              ProjectStatus;
  current_step:        number;
  concept_summary:     string | null;
  target_audience:     string | null;
  domain:              string | null;
  uniqueness_score:    number | null;
  uniqueness_analysis: Record<string, unknown> | null;
  created_at:          string;
  updated_at:          string;
  deleted_at:          string | null;
}

export interface ProjectStep {
  id:           string;
  project_id:   string;
  step_number:  number;
  step_name:    string;
  status:       StepStatus;
  content:      Record<string, unknown> | null;
  completed_at: string | null;
  created_at:   string;
  updated_at:   string;
}

export interface ConversationMessage {
  id:          string;
  project_id:  string;
  step_number: number;
  role:        "user" | "assistant";
  content:     string;
  metadata:    Record<string, unknown> | null;
  created_at:  string;
}

export type TitulaireResult      = "certifie" | "non_certifie" | "absent_justifie" | "absent_non_justifie";
export type TitulaireStatusBefore = "salarie" | "independant" | "demandeur_emploi" | "etudiant" | "autre";
export type TitulaireFollowUp    = "3_mois" | "6_mois" | "non_renseigne";
export type TitulaireEvolution   = "promotion" | "augmentation" | "nouvelles_missions" | "creation_activite" | "reconversion" | "sans_changement" | "non_renseigne";

export interface PromotionTitulaire {
  id:                string;
  session_id:        string;
  project_id:        string;
  last_name:         string;
  first_name:        string;
  result:            TitulaireResult;
  job_title_before:  string | null;
  employer_before:   string | null;
  sector_before:     string | null;
  status_before:     TitulaireStatusBefore | null;
  job_title_after:   string | null;
  employer_after:    string | null;
  follow_up_delay:   TitulaireFollowUp | null;
  evolution_type:    TitulaireEvolution | null;
  evolution_details: string | null;
  created_at:        string;
  updated_at:        string;
}

export interface PromotionSession {
  id:             string;
  project_id:     string;
  session_number: number;
  session_name:   string;
  start_date:     string | null;
  end_date:       string | null;
  eval_date:      string | null;
  location:       string | null;
  created_at:     string;
  updated_at:     string;
  titulaires:     PromotionTitulaire[];
}

export interface UserProfile {
  id:                string;
  full_name:         string | null;
  organisation_name: string | null;
  expertise_domains: string[];
  qualiopi_status:   boolean;
  created_at:        string;
  updated_at:        string;
}
