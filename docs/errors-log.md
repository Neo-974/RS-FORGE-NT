# errors-log.md — Journal des erreurs
## Projet : RS-Builder by NéoTechno Formation

> Ce fichier est mis à jour manuellement à chaque erreur rencontrée pendant le développement.
> Format : une entrée par erreur, avec contexte, message, cause et solution.

---

## Comment utiliser ce fichier

Quand vous rencontrez une erreur :
1. Copier le message d'erreur exact
2. Remplir une nouvelle entrée avec le template ci-dessous
3. Indiquer si l'erreur est **résolue** ou **en cours**

```markdown
### [DATE] — [TITRE COURT]
- **Statut** : 🔴 En cours / ✅ Résolu
- **Contexte** : Quelle page / étape / action déclenchait l'erreur
- **Message d'erreur** : `message exact ici`
- **Cause** : Ce qui a causé l'erreur
- **Solution** : Ce qui a résolu le problème
- **Fichiers modifiés** : liste des fichiers touchés
```

---

## Erreurs en cours 🔴

*Aucune erreur en cours.*

---

## Erreurs résolues ✅

*Aucune erreur résolue pour l'instant — le projet vient de démarrer.*

---

## Erreurs courantes Next.js + Supabase (référence)

### Hydration mismatch
- **Cause** : Différence entre le rendu serveur et client (souvent lié à des données dynamiques)
- **Solution** : Utiliser `useEffect` + état local pour les données côté client

### `supabaseClient` is not defined
- **Cause** : Import manquant ou mauvais chemin vers `/lib/supabase/client.ts`
- **Solution** : Vérifier que le client est bien importé depuis le bon fichier

### Row Level Security (RLS) bloque une requête
- **Cause** : Policy Supabase manquante ou mal configurée
- **Solution** : Vérifier les policies dans le dashboard Supabase → Authentication → Policies

### API Claude retourne 401
- **Cause** : Clé API manquante ou incorrecte dans `.env.local`
- **Solution** : Vérifier `ANTHROPIC_API_KEY` dans `.env.local` et les variables Vercel

### API Claude retourne 529 (overloaded)
- **Cause** : Trop de requêtes simultanées
- **Solution** : Ajouter un retry avec backoff exponentiel

### Génération docx échoue silencieusement
- **Cause** : Données manquantes dans le `project_steps.content` (jsonb)
- **Solution** : Valider les données avant la génération, afficher une erreur explicite

### Web search ne trouve pas les certifications RS
- **Cause** : Query trop vague ou site France Compétences temporairement indisponible
- **Solution** : Affiner la query, proposer une analyse manuelle à l'utilisateur

---

## Template vierge (copier-coller)

```markdown
### [DATE] — [TITRE COURT]
- **Statut** : 🔴 En cours
- **Contexte** : 
- **Message d'erreur** : ``
- **Cause** : 
- **Solution** : 
- **Fichiers modifiés** : 
```
