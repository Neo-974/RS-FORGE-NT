-- ============================================================
-- RS-Builder — Migration initiale
-- Toutes les tables, enums, RLS et politiques de sécurité
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type project_status as enum ('draft', 'in_progress', 'complete', 'archived');
create type step_status    as enum ('pending', 'in_progress', 'complete');
create type document_type  as enum (
  'referentiel_complet',
  'fiche_synthese',
  'etude_opportunite',
  'reglement_evaluation',
  'lettre_soutien',
  'programme_formation'
);
create type file_format as enum ('docx', 'pdf');

-- ------------------------------------------------------------
-- TABLE : user_profiles
-- Profil étendu, lié à auth.users
-- ------------------------------------------------------------
create table public.user_profiles (
  id                 uuid        primary key references auth.users(id) on delete cascade,
  full_name          text,
  organisation_name  text,
  expertise_domains  text[]      default '{}',
  qualiopi_status    boolean     default false,
  created_at         timestamptz default now() not null,
  updated_at         timestamptz default now() not null
);

alter table public.user_profiles enable row level security;

create policy "Un utilisateur voit uniquement son propre profil"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur peut créer son profil"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Un utilisateur peut modifier son propre profil"
  on public.user_profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- TABLE : projects
-- Un projet = un dossier RS en cours de construction
-- ------------------------------------------------------------
create table public.projects (
  id                  uuid           primary key default uuid_generate_v4(),
  user_id             uuid           not null references auth.users(id) on delete cascade,
  title               text           not null,
  status              project_status default 'draft' not null,
  current_step        smallint       default 1 not null check (current_step between 1 and 7),
  concept_summary     text,
  target_audience     text,
  domain              text,
  uniqueness_score    smallint       check (uniqueness_score between 0 and 100),
  uniqueness_analysis jsonb,
  created_at          timestamptz    default now() not null,
  updated_at          timestamptz    default now() not null,
  deleted_at          timestamptz
);

alter table public.projects enable row level security;

create policy "Un utilisateur voit uniquement ses propres projets"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Un utilisateur peut créer ses projets"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur peut modifier ses propres projets"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Un utilisateur peut supprimer ses propres projets"
  on public.projects for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- TABLE : project_steps
-- Suivi de chaque étape pour un projet
-- ------------------------------------------------------------
create table public.project_steps (
  id           uuid        primary key default uuid_generate_v4(),
  project_id   uuid        not null references public.projects(id) on delete cascade,
  step_number  smallint    not null check (step_number between 1 and 7),
  step_name    text        not null,
  status       step_status default 'pending' not null,
  content      jsonb,
  completed_at timestamptz,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  unique (project_id, step_number)
);

alter table public.project_steps enable row level security;

create policy "Accès aux étapes de ses propres projets"
  on public.project_steps for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_steps.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : conversations
-- Historique des messages par projet et par étape
-- ------------------------------------------------------------
create table public.conversations (
  id           uuid        primary key default uuid_generate_v4(),
  project_id   uuid        not null references public.projects(id) on delete cascade,
  step_number  smallint    not null check (step_number between 1 and 7),
  role         text        not null check (role in ('user', 'assistant')),
  content      text        not null,
  metadata     jsonb,
  created_at   timestamptz default now() not null
);

alter table public.conversations enable row level security;

create policy "Accès aux conversations de ses propres projets"
  on public.conversations for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = conversations.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : referentiel_activites
-- Référentiel d'activités (RA) — Étape 3
-- ------------------------------------------------------------
create table public.referentiel_activites (
  id                   uuid        primary key default uuid_generate_v4(),
  project_id           uuid        not null references public.projects(id) on delete cascade,
  activity_number      smallint    not null check (activity_number between 1 and 5),
  activity_title       text        not null,
  activity_description text,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null,
  unique (project_id, activity_number)
);

alter table public.referentiel_activites enable row level security;

create policy "Accès au référentiel d'activités de ses propres projets"
  on public.referentiel_activites for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = referentiel_activites.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : referentiel_competences
-- Référentiel de compétences (RC) — Étape 4
-- ------------------------------------------------------------
create table public.referentiel_competences (
  id                      uuid        primary key default uuid_generate_v4(),
  project_id              uuid        not null references public.projects(id) on delete cascade,
  activity_id             uuid        references public.referentiel_activites(id) on delete set null,
  competence_code         text        not null,
  competence_title        text        not null,
  competence_description  text,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null,
  unique (project_id, competence_code)
);

alter table public.referentiel_competences enable row level security;

create policy "Accès au référentiel de compétences de ses propres projets"
  on public.referentiel_competences for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = referentiel_competences.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : referentiel_evaluation
-- Référentiel d'évaluation (RE) — Étape 5
-- ------------------------------------------------------------
create table public.referentiel_evaluation (
  id                     uuid        primary key default uuid_generate_v4(),
  project_id             uuid        not null references public.projects(id) on delete cascade,
  competence_id          uuid        references public.referentiel_competences(id) on delete set null,
  evaluation_modality    text,
  evaluation_criteria    text,
  evaluation_indicators  text,
  created_at             timestamptz default now() not null,
  updated_at             timestamptz default now() not null
);

alter table public.referentiel_evaluation enable row level security;

create policy "Accès au référentiel d'évaluation de ses propres projets"
  on public.referentiel_evaluation for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = referentiel_evaluation.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : generated_documents
-- Documents Word/PDF générés à l'étape 7
-- ------------------------------------------------------------
create table public.generated_documents (
  id             uuid          primary key default uuid_generate_v4(),
  project_id     uuid          not null references public.projects(id) on delete cascade,
  document_type  document_type not null,
  file_name      text          not null,
  storage_path   text          not null,
  file_format    file_format   not null,
  generated_at   timestamptz   default now() not null
);

alter table public.generated_documents enable row level security;

create policy "Accès aux documents générés de ses propres projets"
  on public.generated_documents for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = generated_documents.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- TABLE : rs_certifications_cache
-- Cache des certifications RS existantes (France Compétences)
-- Accessible en lecture à tous les utilisateurs connectés
-- ------------------------------------------------------------
create table public.rs_certifications_cache (
  id                   uuid        primary key default uuid_generate_v4(),
  rs_code              text        not null unique,
  title                text        not null,
  holder               text,
  status               text        check (status in ('active', 'inactive')),
  target_audience      text,
  competences_summary  text,
  registration_date    date,
  expiry_date          date,
  raw_data             jsonb,
  cached_at            timestamptz default now() not null
);

alter table public.rs_certifications_cache enable row level security;

-- Lecture publique pour tous les utilisateurs connectés
create policy "Lecture du cache RS pour tout utilisateur connecté"
  on public.rs_certifications_cache for select
  using (auth.role() = 'authenticated');

-- Écriture réservée au service role (via route handler serveur)
create policy "Écriture du cache RS réservée au service role"
  on public.rs_certifications_cache for insert
  with check (auth.role() = 'service_role');

create policy "Mise à jour du cache RS réservée au service role"
  on public.rs_certifications_cache for update
  using (auth.role() = 'service_role');

-- ------------------------------------------------------------
-- TRIGGERS : updated_at automatique
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger trg_project_steps_updated_at
  before update on public.project_steps
  for each row execute function public.set_updated_at();

create trigger trg_referentiel_activites_updated_at
  before update on public.referentiel_activites
  for each row execute function public.set_updated_at();

create trigger trg_referentiel_competences_updated_at
  before update on public.referentiel_competences
  for each row execute function public.set_updated_at();

create trigger trg_referentiel_evaluation_updated_at
  before update on public.referentiel_evaluation
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TRIGGER : création automatique du profil utilisateur
-- Se déclenche à chaque inscription via Supabase Auth
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- INDEX : performances des requêtes fréquentes
-- ------------------------------------------------------------
create index idx_projects_user_id        on public.projects(user_id);
create index idx_projects_status         on public.projects(status);
create index idx_projects_deleted_at     on public.projects(deleted_at) where deleted_at is null;
create index idx_project_steps_project   on public.project_steps(project_id);
create index idx_conversations_project   on public.conversations(project_id, step_number);
create index idx_ref_activites_project   on public.referentiel_activites(project_id);
create index idx_ref_competences_project on public.referentiel_competences(project_id);
create index idx_ref_evaluation_project  on public.referentiel_evaluation(project_id);
create index idx_gen_documents_project   on public.generated_documents(project_id);
create index idx_rs_cache_rs_code        on public.rs_certifications_cache(rs_code);
