# brand-brief.md — Charte de marque
## Projet : RS-Builder by NéoTechno Formation

---

## Identité de marque

**Nom de l'app** : RS-Builder
**Sous-titre** : by NéoTechno Formation
**Propriétaire** : David PAYET — Formateur Certifié IA & Numérique
**Localisation** : Saint-Pierre, Île de la Réunion

**Promesse de marque** : L'assistant expert qui transforme votre expertise en certification RS reconnue.

**3 mots clés de l'expérience** : Expert · Guidant · Précis

---

## Palette de couleurs

Inspirée directement de la carte de visite NéoTechno : fond très sombre, accents néon vibrants, dégradé triangulaire signature.

### Couleurs principales

| Nom | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#1A1025` | Fond principal (dark violet profond) |
| `--color-bg-secondary` | `#120D1E` | Fond secondaire, cartes, sidebar |
| `--color-bg-card` | `#231535` | Cartes et panneaux |
| `--color-bg-elevated` | `#2D1A42` | Éléments surélevés, modals |

### Couleurs d'accent (dégradé triangulaire NéoTechno)

| Nom | Hex | Usage |
|---|---|---|
| `--color-accent-green` | `#00E676` | Succès, étapes complètes, CTA primaire |
| `--color-accent-cyan` | `#00BCD4` | Liens, info, accents secondaires |
| `--color-accent-purple` | `#9C27B0` | Highlights, badges, éléments actifs |
| `--color-accent-orange` | `#FF6D00` | Alertes, étapes en cours, accents chauds |
| `--color-accent-pink` | `#E91E8C` | Accents décoratifs, hover states |

### Dégradé signature

```css
/* Dégradé triangulaire NéoTechno */
--gradient-neotechno: linear-gradient(135deg, #00E676 0%, #00BCD4 25%, #9C27B0 60%, #FF6D00 100%);

/* Dégradé texte hero */
--gradient-text: linear-gradient(90deg, #00E676, #00BCD4, #9C27B0);

/* Dégradé fond subtil */
--gradient-bg: linear-gradient(180deg, #1A1025 0%, #120D1E 100%);
```

### Couleurs neutres

| Nom | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#F0EAF8` | Texte principal |
| `--color-text-secondary` | `#B8A9CC` | Texte secondaire, labels |
| `--color-text-muted` | `#7A6A8A` | Texte désactivé, placeholders |
| `--color-border` | `#3D2A55` | Bordures subtiles |
| `--color-border-glow` | `#6B3FA0` | Bordures avec lueur |

### Couleurs sémantiques

| Nom | Hex | Usage |
|---|---|---|
| `--color-success` | `#00E676` | Succès, validé |
| `--color-warning` | `#FF6D00` | Attention, en cours |
| `--color-error` | `#F44336` | Erreur |
| `--color-info` | `#00BCD4` | Information |

---

## Typographie

### Polices

| Rôle | Police | Import |
|---|---|---|
| Display / Titres | **Orbitron** | Google Fonts — futuriste, tech |
| Corps / Interface | **Exo 2** | Google Fonts — lisible, moderne |
| Monospace / Code | **JetBrains Mono** | Google Fonts — pour les codes RS |

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Échelle typographique

| Niveau | Police | Taille | Poids | Usage |
|---|---|---|---|---|
| H1 | Orbitron | 2.5rem | 700 | Titre de page |
| H2 | Orbitron | 1.8rem | 600 | Titre de section |
| H3 | Exo 2 | 1.3rem | 600 | Titre de carte |
| Body | Exo 2 | 1rem | 400 | Texte courant |
| Small | Exo 2 | 0.875rem | 400 | Labels, metadata |
| Code | JetBrains Mono | 0.875rem | 400 | Codes RS, identifiants |

---

## Effets visuels

### Lueurs (glows)

```css
/* Lueur verte — succès / CTA */
--glow-green: 0 0 20px rgba(0, 230, 118, 0.3);

/* Lueur cyan — info / liens */
--glow-cyan: 0 0 20px rgba(0, 188, 212, 0.3);

/* Lueur purple — actif */
--glow-purple: 0 0 20px rgba(156, 39, 176, 0.3);

/* Bordure lumineuse */
--border-glow: 1px solid rgba(0, 230, 118, 0.4);
```

### Glassmorphism (cartes)

```css
.card-glass {
  background: rgba(35, 21, 53, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 63, 160, 0.3);
  border-radius: 12px;
}
```

---

## Logo

- Utiliser le logo triangle NéoTechno fourni dans `/public/logo-neotechno.png`
- Ne jamais déformer ou recolorer le logo
- Sur fond sombre uniquement
- Taille minimale : 32px de hauteur

---

## Ton éditorial

### Persona de l'assistant

L'assistant RS-Builder s'exprime comme un **expert France Compétences bienveillant** — il connaît le référentiel sur le bout des doigts, mais ne jargonne jamais inutilement. Il guide, il rassure, il précise.

### Règles de rédaction

| Règle | ✅ Correct | ❌ À éviter |
|---|---|---|
| Langue | Français courant professionnel | Anglicismes, langage SMS |
| Ton | Pédagogique et encourageant | Condescendant ou trop formel |
| Précision | Toujours nommer les articles/codes FC | Rester vague ("les règles disent…") |
| Questions | Une à la fois, claire et motivée | Plusieurs questions en rafale |
| Validation | Reformuler avant de valider | Valider sans confirmer |
| Erreurs | "Précisons ensemble ce point…" | "C'est incorrect." |

### Formules types

- **Ouverture** : "Parfait, commençons par définir ensemble…"
- **Validation** : "Voici ce que j'ai retenu de vos réponses :"
- **Question** : "Pour avancer, j'ai besoin de comprendre…"
- **Encouragement** : "Excellent ! Votre projet prend forme."
- **Alerte unicité** : "Attention, cette compétence ressemble à RS[CODE]. Affinons le périmètre."

---

## Composants UI — directives visuelles

### Boutons

```css
/* CTA primaire */
.btn-primary {
  background: var(--gradient-neotechno);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  box-shadow: var(--glow-green);
}

/* Bouton secondaire */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-accent-cyan);
  color: var(--color-accent-cyan);
}
```

### Barre de progression des étapes

- 7 étapes numérotées
- Étape complète : vert (`--color-accent-green`) avec icône ✓
- Étape active : cyan (`--color-accent-cyan`) avec lueur
- Étape à venir : gris (`--color-text-muted`)
- Connecteurs : ligne fine avec dégradé

### Bulles de conversation

- **Utilisateur** : bulle à droite, fond `--color-bg-elevated`, border `--color-accent-purple`
- **Assistant** : bulle à gauche, fond `--color-bg-card`, border `--color-accent-cyan` avec lueur subtile
- Police : Exo 2, 1rem
- Avatar assistant : logo triangle NéoTechno miniature
