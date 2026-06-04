# app-spec.md — Spécification de l'application
## Projet : RS-Builder by NéoTechno Formation

---

## Vision

**RS-Builder** est un assistant web expert qui accompagne un formateur professionnel dans la création complète d'un dossier de certification au **Répertoire Spécifique (RS) de France Compétences**.

L'application combine intelligence artificielle conversationnelle, expertise métier intégrée, et génération automatique de documents conformes — pour transformer une idée de formation en un dossier RS recevable et unique.

---

## L'utilisateur

**Profil** : David PAYET, formateur certifié IA & Numérique, titulaire du titre FPA (Formateur Professionnel d'Adultes), fondateur de NéoTechno Formation à Saint-Pierre, Île de la Réunion.

**Caractéristiques** :
- Expert dans son domaine de formation (IA, modélisation 3D, numérique)
- Maîtrise l'ingénierie pédagogique
- À l'aise avec les outils numériques (vibe coding)
- Usage solo — pas de multi-utilisateurs en v1
- Besoin de clarté, de guidage et d'efficacité

**Douleurs actuelles** :
- Processus de dépôt RS long et complexe
- Risque de créer une certification trop proche d'une existante → rejet
- Nombreux documents à produire avec des formats précis imposés par France Compétences
- Manque d'un outil dédié à ce processus spécifique

---

## Ce que l'app fait

### Flux principal (7 étapes)

#### Étape 1 — Définition du concept
L'assistant interroge l'utilisateur de manière dynamique pour cerner précisément son idée de formation. Il pose autant de questions que nécessaire pour obtenir :
- Le domaine professionnel ciblé
- Les activités visées
- Le public cible précis
- Le niveau de qualification attendu
- La valeur ajoutée distinctive

**Output** : Un résumé structuré du concept validé par l'utilisateur.

#### Étape 2 — Analyse d'unicité
L'assistant effectue une recherche en temps réel sur le site France Compétences et la base RS pour :
- Identifier les certifications existantes proches
- Évaluer le risque de doublon
- Proposer des axes de différenciation concrets
- Calculer un score d'unicité estimé

**Output** : Rapport d'analyse comparative avec recommandations.

#### Étape 3 — Référentiel d'activités (RA)
Accompagnement guidé pour définir les 3 à 5 activités-types du métier ciblé, conformément au format France Compétences.

**Output** : Référentiel d'activités structuré et validé.

#### Étape 4 — Référentiel de compétences (RC)
Aide à la rédaction des compétences au format FC : *verbe d'action + moyens + finalité*.

**Output** : Référentiel de compétences (C1 à Cn) lié aux activités.

#### Étape 5 — Référentiel d'évaluation (RE)
Construction des modalités, critères et indicateurs d'évaluation pour chaque compétence.

**Output** : Tableau d'évaluation complet.

#### Étape 6 — Programme de formation
Structuration du programme pédagogique : durée, séquences, modalités pédagogiques.

**Output** : Programme de formation structuré.

#### Étape 7 — Génération du dossier complet
Export automatique de tous les documents au format Word (.docx) et PDF, prêts à être déposés sur CERTIF PRO.

**Documents générés** :
1. Référentiel complet (RA + RC + RE)
2. Fiche descriptive synthétique
3. Étude d'opportunité
4. Règlement d'évaluation
5. Programme de formation
6. Modèle de lettre de soutien

---

## Tableau de bord

Page d'accueil après connexion. Affiche :
- Liste de tous les projets RS en cours
- Statut et avancement de chaque projet (étape x/7)
- Bouton "Nouveau projet"
- Bouton "Supprimer" (soft delete avec confirmation)
- Date de dernière modification

---

## Architecture des pages

| Route | Description |
|---|---|
| `/` | Landing page / redirection vers dashboard |
| `/auth/login` | Connexion |
| `/auth/signup` | Inscription |
| `/dashboard` | Tableau de bord — liste des projets |
| `/projet/nouveau` | Création d'un nouveau projet |
| `/projet/[id]` | Vue du projet — redirige vers étape courante |
| `/projet/[id]/etape/[num]` | Page d'une étape spécifique (1-7) |
| `/projet/[id]/documents` | Prévisualisation et export des documents |
| `/api/chat` | Route handler — appels Claude API |
| `/api/analyse-rs` | Route handler — recherche France Compétences |
| `/api/generate-doc` | Route handler — génération documents |

---

## Comportement de l'assistant IA

- **Modèle** : claude-sonnet-4-20250514
- **Mémoire** : L'historique complet de la conversation est envoyé à chaque appel (contexte complet par projet)
- **Web search** : Activé pour l'étape 2 (analyse d'unicité RS)
- **Langue** : Français uniquement
- **Posture** : Expert France Compétences + pédagogue bienveillant
- **Questions** : Une à la fois, progressive, contextuelle
- **Reformulation** : L'assistant reformule les réponses de l'utilisateur avant de valider

---

## Contraintes techniques

- Application **gratuite à déployer** (Vercel + Supabase free tier)
- **Usage solo** — pas de gestion multi-utilisateurs en v1
- **Responsive** — utilisable sur desktop et tablette
- **Dark mode par défaut** — thème NéoTechno
- **Export local** — les fichiers générés sont téléchargeables directement
- **Pas de soumission directe** à CERTIF PRO (hors scope v1)

---

## Ce que l'app NE fait PAS en v1

- ❌ Multi-utilisateurs / espace client
- ❌ Soumission automatique à France Compétences
- ❌ Suivi post-dépôt (recours, décisions)
- ❌ Facturation / abonnement
- ❌ Application mobile native
- ❌ Collaboration en temps réel
- ❌ Gestion Qualiopi
- ❌ Formation e-learning intégrée

---

## Métriques de succès v1

- Un dossier RS complet généré en moins de 3 sessions
- Tous les documents exportés au format conforme France Compétences
- Zéro rejet pour motif de "doublon RS" grâce à l'analyse d'unicité
