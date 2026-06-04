# RS-Forge NT — Documentation Projet

## Stack technique
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **Backend** : Supabase (auth + base de données)

## Structure des dossiers

```
src/
├── app/
│   ├── (auth)/          # Pages d'authentification (login, register)
│   ├── (dashboard)/     # Pages protégées après connexion
│   ├── layout.tsx       # Layout racine
│   └── page.tsx         # Page d'accueil
├── components/
│   ├── ui/              # Composants génériques (Button, Input, Modal…)
│   ├── forms/           # Formulaires métier
│   └── layout/          # Header, Footer, Sidebar…
├── lib/
│   ├── supabase/
│   │   ├── client.ts    # Client Supabase côté navigateur
│   │   └── server.ts    # Client Supabase côté serveur (RSC)
│   └── utils/           # Fonctions utilitaires
├── hooks/               # Custom React hooks
├── types/               # Types TypeScript partagés
└── styles/              # Styles globaux additionnels
```

## Variables d'environnement requises

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

## Commandes

```bash
npm run dev      # Démarrer en développement
npm run build    # Build de production
npm run lint     # Linter ESLint
```
