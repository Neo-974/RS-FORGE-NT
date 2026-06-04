# integrations.md — Intégrations et outils externes
## Projet : RS-Builder by NéoTechno Formation

---

## Vue d'ensemble

| Service | Rôle | Gratuit | Clé requise |
|---|---|---|---|
| Supabase | Base de données + Auth + Storage | ✅ (free tier) | `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` |
| Vercel | Hébergement + déploiement | ✅ (hobby) | Via CLI |
| Anthropic Claude API | IA conversationnelle + web search | Pay-per-use | `ANTHROPIC_API_KEY` |
| France Compétences (web) | Données RS existantes | ✅ (public) | Aucune — web search |
| docx (npm) | Génération fichiers Word | ✅ | Aucune |
| pdf-lib (npm) | Génération fichiers PDF | ✅ | Aucune |
| JSZip (npm) | Export ZIP multi-documents | ✅ | Aucune |

---

## 1. Supabase

**Rôle** : Base de données PostgreSQL, authentification utilisateur, stockage des fichiers générés.

**Configuration** :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...  # Serveur uniquement — jamais exposé client
```

**Services utilisés** :
- `supabase.auth` — Connexion email/password
- `supabase.from()` — CRUD sur toutes les tables
- `supabase.storage` — Stockage des .docx et .pdf générés

**Bucket Storage** :
- `generated-documents` — Fichiers Word/PDF par projet
  - Chemin : `{user_id}/{project_id}/{document_type}.docx`
  - Accès : privé (RLS activé)

**Limites free tier** :
- 500 MB base de données
- 1 GB Storage
- 50 000 utilisateurs actifs/mois

---

## 2. Vercel

**Rôle** : Hébergement de l'application Next.js, déploiement continu depuis GitHub.

**Configuration** :
- Connecter le repo GitHub à Vercel
- Variables d'environnement à configurer dans le dashboard Vercel
- Branch `main` → production automatique
- Branch `develop` → preview automatique

**Commandes** :
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 3. Anthropic Claude API

**Rôle** : Moteur conversationnel de l'assistant RS-Builder. Pose les questions, analyse les réponses, génère les référentiels, rédige les documents.

**Modèle utilisé** : `claude-sonnet-4-20250514`

**Configuration** :
```env
ANTHROPIC_API_KEY=sk-ant-xxxx  # Serveur uniquement
```

**Route handler** : `/app/api/chat/route.ts`

```typescript
// Exemple d'appel avec web search activé (étape 2)
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT_BY_STEP[stepNumber],
    messages: conversationHistory,
    tools: stepNumber === 2 ? [{ type: "web_search_20250305", name: "web_search" }] : []
  })
});
```

**Prompts système par étape** : Stocker dans `/lib/claude/prompts/`
- `step1-concept.ts` — Expert en définition de projet de formation
- `step2-unicite.ts` — Expert en analyse RS + web search FC
- `step3-activites.ts` — Expert référentiel d'activités FC
- `step4-competences.ts` — Expert référentiel de compétences FC
- `step5-evaluation.ts` — Expert référentiel d'évaluation FC
- `step6-programme.ts` — Expert ingénierie pédagogique
- `step7-generation.ts` — Générateur de contenu documentaire

---

## 4. France Compétences (données publiques)

**Rôle** : Vérifier l'unicité d'une certification en consultant les RS existants.

**Méthode** : Web search via l'outil `web_search` de l'API Claude (pas d'API officielle France Compétences disponible publiquement).

**URLs cibles pour la recherche** :
- `https://www.francecompetences.fr/recherche/rs/` — Base RS publique
- `https://certifpro.francecompetences.fr/` — CERTIF PRO

**Stratégie de cache** :
- Les résultats de recherche sont stockés dans `rs_certifications_cache`
- TTL : 7 jours (les données RS changent peu)
- Invalider le cache manuellement si besoin

---

## 5. docx (npm)

**Rôle** : Génération des fichiers Word (.docx) conformes au format France Compétences.

**Installation** :
```bash
npm install docx
```

**Usage** : Dans `/lib/documents/generators/`
- `generate-referentiel.ts`
- `generate-fiche-synthese.ts`
- `generate-etude-opportunite.ts`
- `generate-reglement-evaluation.ts`
- `generate-programme.ts`
- `generate-lettre-soutien.ts`

---

## 6. pdf-lib (npm)

**Rôle** : Conversion ou génération de fichiers PDF à partir des documents Word.

**Installation** :
```bash
npm install pdf-lib
```

---

## 7. JSZip (npm)

**Rôle** : Empaqueter tous les documents générés dans un seul fichier ZIP téléchargeable.

**Installation** :
```bash
npm install jszip
```

---

## Variables d'environnement — récapitulatif

Créer un fichier `.env.local` à la racine du projet (jamais commiter dans Git) :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ajouter `.env.local` dans `.gitignore` :
```
.env.local
.env*.local
```

---

## Setup initial — ordre des étapes

1. Créer compte **Supabase** → récupérer les clés
2. Créer compte **Vercel** + connecter GitHub
3. Créer compte **Anthropic** → générer une clé API
4. Initialiser le projet Next.js
5. Configurer `.env.local`
6. Déployer sur Vercel avec les variables d'env
