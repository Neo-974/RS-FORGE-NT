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

export interface UserProfile {
  id:                string;
  full_name:         string | null;
  organisation_name: string | null;
  expertise_domains: string[];
  qualiopi_status:   boolean;
  created_at:        string;
  updated_at:        string;
}
