# CLAUDE.md — Manuel d'instructions pour Claude Code
## Projet : RS-Builder by NéoTechno Formation

---

## 🎯 Contexte du projet

**RS-Builder** est une application web conversationnelle qui accompagne un formateur expert dans la création et la soumission d'un dossier de certification au **Répertoire Spécifique (RS) de France Compétences**.

L'utilisateur est David PAYET, formateur certifié IA & Numérique, basé à La Réunion. Il travaille seul (usage solo). L'app doit être pédagogique, guidante, experte, et produire des documents conformes aux exigences de France Compétences.

---

## 🏗️ Stack technique

| Couche | Outil | Gratuit |
|---|---|---|
| Frontend | Next.js 14 (App Router) | ✅ |
| Auth | Supabase Auth | ✅ |
| Base de données | Supabase (PostgreSQL) | ✅ |
| Stockage fichiers | Supabase Storage | ✅ |
| Déploiement | Vercel | ✅ |
| IA conversationnelle | Claude API (claude-sonnet-4-20250514) | Pay-per-use |
| Recherche web RS | Web Search Tool (Anthropic) | Pay-per-use |
| Export documents | docx + pdf-lib (npm) | ✅ |

---

## 📁 Structure des dossiers

```
rs-builder/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Pages login/signup
│   ├── dashboard/          # Tableau de bord projets
│   ├── projet/[id]/        # Pages par étapes du projet
│   └── api/                # Route handlers API
├── components/             # Composants React réutilisables
│   ├── ui/                 # Composants de base (boutons, inputs…)
│   ├── chat/               # Interface conversationnelle
│   ├── steps/              # Composants par étape RS
│   └── documents/          # Prévisualisation et export
├── lib/                    # Utilitaires
│   ├── supabase/           # Client Supabase
│   ├── claude/             # Appels API Claude
│   └── documents/          # Génération Word/PDF
├── docs/                   # ← CE DOSSIER — tous les docs fondateurs
└── public/                 # Assets statiques (logo NéoTechno, etc.)
```

---

## 🧠 Règles absolues pour Claude Code

### 1. DATA DICTIONARY EN PRIORITÉ
> **⚠️ RÈGLE CRITIQUE** : Avant de nommer un nouveau champ, une nouvelle table, une nouvelle variable ou une nouvelle route API, **consulter impérativement `docs/data-dictionary.md`**. Ne jamais inventer un nom de champ sans vérifier l'existant. Utiliser exclusivement le snake_case pour tous les noms de tables et colonnes.

### 2. Cohérence du design
- Toujours respecter les tokens définis dans `docs/brand-brief.md`
- Ne jamais utiliser de couleurs hardcodées — utiliser les CSS variables
- Le thème est sombre (dark mode par défaut), inspiré de la carte de visite NéoTechno

### 3. Composants et code
- Toujours créer des composants réutilisables dans `/components/`
- Ne jamais dupliquer de logique — extraire dans `/lib/`
- Tous les appels à l'API Claude passent par `/lib/claude/`
- Toujours gérer les états de chargement et les erreurs

### 4. Base de données
- Toutes les migrations Supabase dans `/supabase/migrations/`
- Ne jamais modifier directement la DB en prod — toujours passer par des migrations
- Activer Row Level Security (RLS) sur toutes les tables
- Consulter `docs/data-dictionary.md` avant toute migration

### 5. Sécurité
- Ne jamais exposer les clés API côté client
- Toutes les clés dans `.env.local` (jamais dans le code)
- Les appels à l'API Claude se font uniquement depuis les Route Handlers Next.js

### 6. Gestion des erreurs
- Consigner toutes les erreurs dans `docs/errors-log.md`
- Toujours afficher un message utilisateur en français, clair et bienveillant
- Ne jamais laisser une erreur silencieuse

### 7. Langue
- L'interface utilisateur est entièrement en **français**
- Les noms de variables, fonctions et fichiers sont en **anglais** (snake_case pour la DB)
- Les commentaires de code sont en **français**

---

## 🔄 Flux principal de l'app

```
1. Tableau de bord → liste des projets RS en cours
2. Nouveau projet → entretien guidé par Claude (questions dynamiques)
3. Étape 1 : Définition du concept de formation
4. Étape 2 : Analyse d'unicité (recherche web France Compétences)
5. Étape 3 : Référentiel d'activités
6. Étape 4 : Référentiel de compétences
7. Étape 5 : Référentiel d'évaluation
8. Étape 6 : Programme de formation
9. Étape 7 : Génération et export du dossier complet
10. Archivage ou suppression du projet
```

---

## 📋 Checklist avant chaque session Claude Code

- [ ] J'ai lu `docs/app-spec.md` pour comprendre le contexte
- [ ] J'ai consulté `docs/data-dictionary.md` avant tout nouveau champ
- [ ] J'ai vérifié `docs/feature-backlog.md` pour ne pas sortir du scope v1
- [ ] J'ai respecté les couleurs et polices de `docs/brand-brief.md`
- [ ] J'ai logué les erreurs rencontrées dans `docs/errors-log.md`
