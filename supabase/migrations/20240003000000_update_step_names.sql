-- ============================================================
-- RS-Builder — Mise à jour des noms d'étapes
-- Alignement sur les 4 critères réglementaires France Compétences
-- décret n°2018-1172 du 18 décembre 2018
-- ============================================================

-- Ajout du champ step_description pour le texte de guidage
alter table public.project_steps
  add column if not exists step_description text;

-- Mise à jour des noms et descriptions d'étapes sur les projets existants
update public.project_steps set
  step_name        = 'Concept & intitulé RS',
  step_description = 'Critère FC — Définir l''intitulé conforme, le type RS, le public visé et les prérequis'
where step_number = 1;

update public.project_steps set
  step_name        = 'Opportunité & valeur d''usage',
  step_description = 'Critère FC n°1 — Analyse d''unicité RS + étude d''opportunité + preuves de valeur d''usage'
where step_number = 2;

update public.project_steps set
  step_name        = 'Référentiel de compétences',
  step_description = 'Critère FC n°2 — Construire le référentiel de compétences au format officiel (verbe + quoi + finalité)'
where step_number = 3;

update public.project_steps set
  step_name        = 'Référentiel d''évaluation',
  step_description = 'Critère FC n°2 — Construire le référentiel d''évaluation avec modalités, critères et indicateurs mesurables'
where step_number = 4;

update public.project_steps set
  step_name        = 'Procédures d''organisation',
  step_description = 'Critère FC n°3 — Définir les procédures d''organisation du jury (50% externe) et des épreuves de certification'
where step_number = 5;

update public.project_steps set
  step_name        = 'Contraintes légales & programme',
  step_description = 'Critère FC n°4 — Contraintes réglementaires + programme de formation certifiante complet'
where step_number = 6;

update public.project_steps set
  step_name        = 'Validation & génération du dossier',
  step_description = 'Audit de conformité FC complet + génération des 6 documents officiels prêts pour CERTIF PRO'
where step_number = 7;

-- Ajout du champ jury_external_pct et other_certification_links sur projects
alter table public.projects
  add column if not exists rs_type             text check (rs_type in ('transversal', 'complementaire', 'habilitation')),
  add column if not exists legal_constraints   text,
  add column if not exists jury_composition    text,
  add column if not exists rncp_equivalences   text,
  add column if not exists certification_url   text;
