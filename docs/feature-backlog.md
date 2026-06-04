# feature-backlog.md — Backlog des fonctionnalités
## Projet : RS-Builder by NéoTechno Formation

---

## ✅ Scope V1 — À construire maintenant

### 🔐 Auth & Profil
- [ ] Connexion / Déconnexion via Supabase Auth (email + password)
- [ ] Page profil simple (nom, organisme, domaines d'expertise)

### 📋 Tableau de bord
- [ ] Affichage liste des projets en cours
- [ ] Statut et progression de chaque projet (étape x/7)
- [ ] Bouton "Nouveau projet"
- [ ] Bouton "Supprimer un projet" (avec confirmation + soft delete)
- [ ] Tri par date de modification

### 💬 Interface conversationnelle (toutes étapes)
- [ ] Bulle assistant (à gauche, style NéoTechno)
- [ ] Bulle utilisateur (à droite)
- [ ] Input texte avec envoi au clavier (Entrée) et bouton
- [ ] Indicateur de frappe de l'assistant (3 points animés)
- [ ] Scroll automatique vers le dernier message
- [ ] Sauvegarde automatique de chaque message en base

### 📍 Navigation par étapes
- [ ] Barre de progression 7 étapes en haut de chaque page
- [ ] Statut visuel : complète / active / à venir
- [ ] Bouton "Étape suivante" (activé quand étape validée)
- [ ] Retour possible à une étape complète (lecture seule)

### Étape 1 — Définition du concept
- [ ] Prompt système expert FC pour l'assistant
- [ ] Questions dynamiques sur le concept de formation
- [ ] Résumé structuré généré et validé par l'utilisateur
- [ ] Sauvegarde du `concept_summary` dans `projects`

### Étape 2 — Analyse d'unicité
- [ ] Appel web search sur France Compétences (base RS publique)
- [ ] Identification des certifications proches (top 5)
- [ ] Rapport d'analyse comparative affiché dans l'interface
- [ ] Score d'unicité estimé (0-100)
- [ ] Recommandations de différenciation
- [ ] Cache des résultats dans `rs_certifications_cache`

### Étape 3 — Référentiel d'activités
- [ ] Accompagnement conversationnel pour 3-5 activités
- [ ] Validation de chaque activité par l'utilisateur
- [ ] Sauvegarde dans `referentiel_activites`
- [ ] Aperçu du RA construit au fil des échanges

### Étape 4 — Référentiel de compétences
- [ ] Aide à la rédaction format FC (verbe + moyens + finalité)
- [ ] Liaison compétences ↔ activités
- [ ] Sauvegarde dans `referentiel_competences`

### Étape 5 — Référentiel d'évaluation
- [ ] Génération des modalités / critères / indicateurs
- [ ] Tableau d'évaluation interactif
- [ ] Sauvegarde dans `referentiel_evaluation`

### Étape 6 — Programme de formation
- [ ] Structuration durée, séquences, modalités pédagogiques
- [ ] Sauvegarde dans `project_steps` (content jsonb)

### Étape 7 — Génération des documents
- [ ] Génération Word (.docx) — référentiel complet
- [ ] Génération Word (.docx) — fiche synthétique
- [ ] Génération Word (.docx) — étude d'opportunité
- [ ] Génération Word (.docx) — règlement d'évaluation
- [ ] Génération Word (.docx) — programme de formation
- [ ] Génération Word (.docx) — modèle lettre de soutien
- [ ] Export PDF de chaque document
- [ ] Téléchargement individuel ou en ZIP
- [ ] Sauvegarde dans `generated_documents` + Supabase Storage

---

## 🅱️ Idées V2 — Parking lot

### Fonctionnalités futures (ne pas coder en v1)

| Idée | Valeur estimée | Complexité |
|---|---|---|
| Multi-utilisateurs avec espace client | Haute | Haute |
| Suivi post-dépôt (statut décision FC) | Haute | Moyenne |
| Tableau de bord analytics (taux d'unicité moyen, etc.) | Moyenne | Faible |
| Modèles de projets par domaine (IA, 3D, numérique…) | Haute | Faible |
| Collaboration (partage d'un projet en lecture) | Moyenne | Haute |
| Notifications email à chaque étape complétée | Faible | Faible |
| Intégration directe API France Compétences (si disponible) | Haute | Haute |
| Versionning des documents (v1, v2 du dossier) | Moyenne | Moyenne |
| Chatbot FAQ France Compétences intégré | Haute | Moyenne |
| Application mobile (PWA) | Moyenne | Haute |
| Abonnement / facturation (Stripe) | Haute | Moyenne |
| Mode "révision" — relecture et amélioration d'un dossier existant | Haute | Moyenne |
| Export au format CERTIF PRO (si API disponible) | Haute | Haute |
| Glossaire interactif des termes France Compétences | Faible | Faible |

---

## 🚫 Hors scope définitif (jamais en v1)

- Soumission automatique à CERTIF PRO
- Gestion Qualiopi
- Facturation / paiement
- Application mobile native (iOS / Android)
- Collaboration temps réel
- Formation e-learning intégrée dans l'app

---

## Priorisation V1 (ordre de développement recommandé)

1. Setup projet (Next.js + Supabase + Vercel)
2. Auth + Layout de base + thème NéoTechno
3. Tableau de bord (CRUD projets)
4. Interface conversationnelle (composant réutilisable)
5. Étape 1 — Définition du concept
6. Étape 2 — Analyse d'unicité (web search)
7. Étapes 3, 4, 5 — Référentiels
8. Étape 6 — Programme
9. Étape 7 — Génération et export documents
10. Tests + polish UI
