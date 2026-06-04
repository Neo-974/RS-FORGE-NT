# data-dictionary.md — Dictionnaire de données
## Projet : RS-Builder by NéoTechno Formation

> ⚠️ Ce fichier est la **source de vérité unique** pour tous les noms de tables et colonnes.
> Consulter ce document avant de créer ou modifier tout champ en base de données.
> Convention : **snake_case** obligatoire pour tous les identifiants.

---

## Tables Supabase

---

### `users`
Gérée par Supabase Auth. Étendue par `user_profiles`.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire (auth.users) |
| `email` | text | Email de l'utilisateur |
| `created_at` | timestamptz | Date de création du compte |

---

### `user_profiles`
Profil étendu de l'utilisateur (lié à `users`).

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK, FK → users.id |
| `full_name` | text | Nom complet |
| `organisation_name` | text | Nom de l'organisme de formation |
| `expertise_domains` | text[] | Domaines d'expertise du formateur |
| `qualiopi_status` | boolean | Certifié Qualiopi ou non |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière mise à jour |

---

### `projects`
Un projet = un dossier RS en cours de construction.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `user_id` | uuid | FK → users.id |
| `title` | text | Titre provisoire de la certification |
| `status` | text | `draft` / `in_progress` / `complete` / `archived` |
| `current_step` | int2 | Étape courante (1 à 7) |
| `concept_summary` | text | Résumé du concept validé |
| `target_audience` | text | Public visé de la formation |
| `domain` | text | Domaine professionnel (ex: IA, 3D, Numérique) |
| `uniqueness_score` | int2 | Score d'unicité estimé (0-100) |
| `uniqueness_analysis` | jsonb | Résultat de l'analyse RS existant |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière modification |
| `deleted_at` | timestamptz | Suppression logique (soft delete) |

---

### `project_steps`
Suivi détaillé de chaque étape pour un projet donné.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `step_number` | int2 | Numéro de l'étape (1-7) |
| `step_name` | text | Nom de l'étape |
| `status` | text | `pending` / `in_progress` / `complete` |
| `content` | jsonb | Contenu structuré de l'étape |
| `completed_at` | timestamptz | Date de complétion |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière modification |

---

### `conversations`
Historique des échanges conversationnels par projet et par étape.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `step_number` | int2 | Étape liée à la conversation |
| `role` | text | `user` ou `assistant` |
| `content` | text | Contenu du message |
| `metadata` | jsonb | Données contextuelles (tool_use, etc.) |
| `created_at` | timestamptz | Horodatage du message |

---

### `referentiel_activites`
Référentiel d'activités (RA) — Étape 3.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `activity_number` | int2 | Numéro de l'activité (1-5 max) |
| `activity_title` | text | Intitulé de l'activité |
| `activity_description` | text | Description détaillée |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière modification |

---

### `referentiel_competences`
Référentiel de compétences (RC) — Étape 4.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `activity_id` | uuid | FK → referentiel_activites.id |
| `competence_code` | text | Code compétence (ex: C1, C2…) |
| `competence_title` | text | Intitulé (verbe + moyens + finalité) |
| `competence_description` | text | Description détaillée |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière modification |

---

### `referentiel_evaluation`
Référentiel d'évaluation (RE) — Étape 5.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `competence_id` | uuid | FK → referentiel_competences.id |
| `evaluation_modality` | text | Modalité d'évaluation |
| `evaluation_criteria` | text | Critères d'évaluation |
| `evaluation_indicators` | text | Indicateurs de réussite |
| `created_at` | timestamptz | Date de création |
| `updated_at` | timestamptz | Dernière modification |

---

### `generated_documents`
Documents Word/PDF générés à l'étape 7.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `project_id` | uuid | FK → projects.id |
| `document_type` | text | `referentiel_complet` / `fiche_synthese` / `etude_opportunite` / `reglement_evaluation` |
| `file_name` | text | Nom du fichier généré |
| `storage_path` | text | Chemin Supabase Storage |
| `file_format` | text | `docx` ou `pdf` |
| `generated_at` | timestamptz | Date de génération |

---

### `rs_certifications_cache`
Cache des certifications RS existantes (scraping/API France Compétences).

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | Clé primaire |
| `rs_code` | text | Code RS (ex: RS7029) |
| `title` | text | Intitulé de la certification |
| `holder` | text | Organisme certificateur |
| `status` | text | `active` / `inactive` |
| `target_audience` | text | Public visé |
| `competences_summary` | text | Résumé des compétences |
| `registration_date` | date | Date d'enregistrement |
| `expiry_date` | date | Date d'échéance |
| `raw_data` | jsonb | Données brutes complètes |
| `cached_at` | timestamptz | Date du dernier cache |

---

## Valeurs énumérées (enums)

### `project_status`
`draft` | `in_progress` | `complete` | `archived`

### `step_status`
`pending` | `in_progress` | `complete`

### `document_type`
`referentiel_complet` | `fiche_synthese` | `etude_opportunite` | `reglement_evaluation` | `lettre_soutien` | `programme_formation`

### `file_format`
`docx` | `pdf`

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Tables | snake_case pluriel | `user_profiles` |
| Colonnes | snake_case | `created_at` |
| Clés primaires | toujours `id` (uuid) | `id` |
| Clés étrangères | `table_singulier_id` | `project_id` |
| Timestamps | suffixe `_at` | `deleted_at` |
| Booléens | préfixe `is_` ou `has_` | `is_active` |
| Tableaux | suffixe `s` | `expertise_domains` |
