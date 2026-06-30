-- ============================================================
-- RS-Builder — Module Promotions de Titulaires
-- Critère 1 bis du Répertoire Spécifique (décret 2025-500)
-- ============================================================

-- ------------------------------------------------------------
-- TABLE : promotions_sessions
-- Une session = une promotion au sens FC
-- ------------------------------------------------------------
create table public.promotions_sessions (
  id             uuid        primary key default uuid_generate_v4(),
  project_id     uuid        not null references public.projects(id) on delete cascade,
  session_number smallint    not null check (session_number >= 1),
  session_name   text        not null,
  start_date     date,
  end_date       date,
  eval_date      date,
  location       text,
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null,
  unique (project_id, session_number)
);

alter table public.promotions_sessions enable row level security;

create policy "Accès aux sessions de ses propres projets"
  on public.promotions_sessions for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = promotions_sessions.project_id
        and projects.user_id = auth.uid()
    )
  );

create trigger trg_promotions_sessions_updated_at
  before update on public.promotions_sessions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TABLE : promotions_titulaires
-- Un titulaire = un candidat évalué dans une session
-- Inclut certifiés ET non certifiés (exigence FC)
-- ------------------------------------------------------------
create table public.promotions_titulaires (
  id                 uuid        primary key default uuid_generate_v4(),
  session_id         uuid        not null references public.promotions_sessions(id) on delete cascade,
  project_id         uuid        not null references public.projects(id) on delete cascade,
  last_name          text        not null,
  first_name         text        not null,
  result             text        not null check (result in ('certifie', 'non_certifie', 'absent_justifie', 'absent_non_justifie')),
  -- Situation AVANT la formation
  job_title_before   text,
  employer_before    text,
  sector_before      text,
  status_before      text        check (status_before in ('salarie', 'independant', 'demandeur_emploi', 'etudiant', 'autre')),
  -- Situation APRÈS (suivi à 3 ou 6 mois)
  job_title_after    text,
  employer_after     text,
  follow_up_delay    text        check (follow_up_delay in ('3_mois', '6_mois', 'non_renseigne')),
  evolution_type     text        check (evolution_type in ('promotion', 'augmentation', 'nouvelles_missions', 'creation_activite', 'reconversion', 'sans_changement', 'non_renseigne')),
  evolution_details  text,
  created_at         timestamptz default now() not null,
  updated_at         timestamptz default now() not null
);

alter table public.promotions_titulaires enable row level security;

create policy "Accès aux titulaires de ses propres projets"
  on public.promotions_titulaires for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = promotions_titulaires.project_id
        and projects.user_id = auth.uid()
    )
  );

create trigger trg_promotions_titulaires_updated_at
  before update on public.promotions_titulaires
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- INDEX
-- ------------------------------------------------------------
create index idx_promotions_sessions_project on public.promotions_sessions(project_id);
create index idx_promotions_titulaires_session on public.promotions_titulaires(session_id);
create index idx_promotions_titulaires_project on public.promotions_titulaires(project_id);
