/* Prompts d'extraction JSON par étape.
   Ces prompts sont utilisés pour extraire des données structurées
   depuis l'historique de conversation d'une étape, après sa validation.
   L'extraction est best-effort : si une information est absente de la
   conversation, la valeur correspondante sera null. */

export const EXTRACTION_PROMPTS: Record<number, string> = {

  /* ----------------------------------------------------------------
     ÉTAPE 1 — Concept de certification
     Cible : projects (title, domain, target_audience, concept_summary)
  ---------------------------------------------------------------- */
  1: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les informations validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "title": "intitulé exact de la certification tel que validé dans la conversation",
  "domain": "domaine professionnel principal",
  "target_audience": "description du public visé (profil, expérience, niveau requis)",
  "concept_summary": "résumé complet du concept (2-3 paragraphes : nature de la certification, valeur ajoutée, type RS, prérequis, voies d'accès)"
}

Si une information n'est pas présente dans la conversation, mets null.`,

  /* ----------------------------------------------------------------
     ÉTAPE 2 — Analyse d'unicité et opportunité
     Cible : projects (uniqueness_score, uniqueness_analysis)
  ---------------------------------------------------------------- */
  2: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les informations validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "uniqueness_score": nombre entier de 0 à 100 ou null,
  "uniqueness_analysis": {
    "rs_proches": [{"code": "RS000", "titre": "...", "proximite": "X%", "points_communs": "..."}],
    "rncp_voisins": [{"code": "RNCP000", "titre": "...", "niveau": "...", "risque": "..."}],
    "axes_differenciation": ["axe 1", "axe 2"],
    "recommandation": "GO" ou "GO avec ajustements" ou "STOP",
    "etude_opportunite": {
      "situation_actuelle": "résumé des besoins identifiés",
      "sources": ["source 1", "source 2"],
      "evolution_marche": "tendances identifiées",
      "resultats_attendus": "impacts pour individus et entreprises"
    },
    "valeur_usage": {
      "sessions_realisees": true ou false,
      "preuves_disponibles": ["courrier entreprise X", "..."],
      "preuves_a_obtenir": ["..."]
    },
    "objectifs_L6313_3": ["objectif 1 parmi les 4 de L.6313-3", "objectif 2"],
    "certificateur": {
      "type": "unique" ou "co-certificateur" ou "réseau" ou null,
      "groupement": description du groupement ou null
    },
    "documents_accompagnement": {
      "courrier_rfc": true ou false,
      "courriers_refus_financement": nombre de courriers disponibles ou null,
      "positionnement_rse": description ou null
    }
  }
}

Si une information n'est pas présente dans la conversation, mets null.`,

  /* ----------------------------------------------------------------
     ÉTAPE 3 — Référentiel d'activités et de compétences
     Cible : referentiel_activites + referentiel_competences
  ---------------------------------------------------------------- */
  3: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les activités-types et compétences validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "activities": [
    {
      "activity_number": 1,
      "activity_title": "intitulé court de l'activité",
      "activity_description": "description complète : verbe + objet + contexte professionnel réel"
    }
  ],
  "competences": [
    {
      "competence_code": "C1",
      "competence_title": "libellé court de la compétence",
      "competence_description": "formulation complète FC : verbe observable + quoi + contexte + finalité",
      "activity_number": 1
    }
  ]
}

IMPORTANT :
- Ne retiens que les compétences au format FC validé (verbe observable + finalité)
- activity_number correspond au numéro de l'activité parente (null si pas de RA)
- Si pas d'activités-types retenues, "activities" = []`,

  /* ----------------------------------------------------------------
     ÉTAPE 4 — Référentiel d'évaluation
     Cible : referentiel_evaluation
  ---------------------------------------------------------------- */
  4: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les modalités d'évaluation validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "evaluations": [
    {
      "competence_code": "C1",
      "evaluation_modality": "description de la modalité d'évaluation (mise en situation, étude de cas, production...)",
      "evaluation_criteria": "critères d'évaluation : qualité attendue + indicateurs observables",
      "evaluation_indicators": "indicateurs de réussite mesurables avec seuils précis"
    }
  ],
  "psh_amenagements": "description des aménagements PSH prévus ou null",
  "diversite_modalites": true ou false
}`,

  /* ----------------------------------------------------------------
     ÉTAPE 5 — Procédures d'organisation
     Cible : project_steps.content (step 5)
  ---------------------------------------------------------------- */
  5: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les procédures d'organisation validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "jury": {
    "taille": nombre de membres ou null,
    "membres_exterieurs": description des membres extérieurs ou null,
    "college_employeurs": description du collège employeurs ou null,
    "college_salaries": description du collège salariés/praticiens ou null,
    "habilitation": procédure d'habilitation ou null
  },
  "organisation": {
    "responsable": fonction du responsable ou null,
    "convocation": modalités et délais de convocation ou null,
    "deroulement": protocole de déroulement de l'épreuve ou null,
    "dysfonctionnements": gestion des dysfonctionnements ou null,
    "resultats": délai et modalité de communication des résultats ou null,
    "rattrapage": conditions du rattrapage ou null,
    "delivrance": format du certificat ou null,
    "recours": procédure de voies de recours ou null
  },
  "validation": "totale" ou "partielle justifiée",
  "duree_validite": "à vie" ou description si durée limitée,
  "archivage": {
    "duree": "5 ans",
    "support": description du support ou null,
    "responsable": responsable désigné ou null
  },
  "conseil_perfectionnement": {
    "composition": description ou null,
    "frequence": fréquence de réunion ou null,
    "missions": missions ou null
  },
  "mise_en_reseau": false ou description si applicable,
  "regulation_processus": description des procédures d'étalonnage et suivi ou null,
  "statistiques_indicateurs": {
    "outil": description de l'outil de collecte ou null,
    "responsable": "fonction ou nom" ou null,
    "indicateurs": ["taux de certification", "suivi insertion"] ou null
  },
  "obligations_fc": {
    "certif_pro_responsable": "fonction ou nom" ou null,
    "fiche_descriptive_responsable": "fonction ou nom" ou null,
    "format_attestation": description ou null
  }
}`,

  /* ----------------------------------------------------------------
     ÉTAPE 6 — Programme de formation + Moyens
     Cible : project_steps.content (step 6)
  ---------------------------------------------------------------- */
  6: `Tu es un extracteur de données JSON. Analyse cette conversation entre un expert RS et un ingénieur pédagogique.

Extrais UNIQUEMENT les informations du programme et des moyens validées et confirmées dans la conversation.
Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans markdown.

Format requis :
{
  "contraintes_legales": {
    "applicable": true ou false,
    "reglementation": description ou null,
    "prerequis_reglementaires": liste ou null
  },
  "moyens": {
    "techniques": description des équipements, logiciels, plateformes ou null,
    "pedagogiques": description des méthodes et supports ou null,
    "encadrement": description des formateurs (profil, disciplines, ratio) ou null,
    "centre": description des moyens propres du centre (accès, numérisation, archivage) ou null,
    "rse": description de la démarche RSE et impact territorial ou null,
    "plateau_technique_epreuve": description du dispositif matériel pour les épreuves ou null,
    "document_reference": "programme" ou "cahier_des_charges" ou null
  },
  "programme": {
    "duree_totale": "ex: 35h" ou null,
    "modalites": ["présentiel", "distanciel"] ou null,
    "modules": [
      {
        "title": "titre du module",
        "duration": "durée ex: 7h",
        "modality": "modalité pédagogique",
        "competences": "C1, C2",
        "content": "contenu et objectifs du module"
      }
    ]
  },
  "transition_ecologique": description de l'intégration spécifique au domaine ou null,
  "transition_numerique": description des outils numériques ou null,
  "psh": {
    "referent": true ou false,
    "temps": description ou null,
    "supports": description ou null,
    "ressources_humaines": description ou null,
    "locaux": description ou null
  }
}`,
};
