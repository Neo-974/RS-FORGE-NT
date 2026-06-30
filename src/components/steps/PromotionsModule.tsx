"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import type {
  PromotionSession,
  PromotionTitulaire,
  TitulaireResult,
  TitulaireStatusBefore,
  TitulaireFollowUp,
  TitulaireEvolution,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Constantes libellés                                                */
/* ------------------------------------------------------------------ */
const RESULT_LABELS: Record<TitulaireResult, string> = {
  certifie:            "Certifié ✓",
  non_certifie:        "Non certifié",
  absent_justifie:     "Absent justifié",
  absent_non_justifie: "Absent non justifié",
};

const RESULT_COLORS: Record<TitulaireResult, string> = {
  certifie:            "var(--color-accent-green)",
  non_certifie:        "var(--color-accent-orange)",
  absent_justifie:     "var(--color-text-muted)",
  absent_non_justifie: "var(--color-text-muted)",
};

const STATUS_BEFORE_LABELS: Record<TitulaireStatusBefore, string> = {
  salarie:         "Salarié",
  independant:     "Indépendant / Freelance",
  demandeur_emploi:"Demandeur d'emploi",
  etudiant:        "Étudiant",
  autre:           "Autre",
};

const EVOLUTION_LABELS: Record<TitulaireEvolution, string> = {
  promotion:           "Promotion / Changement de poste",
  augmentation:        "Augmentation de salaire",
  nouvelles_missions:  "Nouvelles missions",
  creation_activite:   "Création d'activité",
  reconversion:        "Reconversion professionnelle",
  sans_changement:     "Sans changement notable",
  non_renseigne:       "Non renseigné",
};

/* ------------------------------------------------------------------ */
/*  Formulaire session                                                 */
/* ------------------------------------------------------------------ */
interface SessionFormData {
  session_name: string;
  start_date:   string;
  end_date:     string;
  eval_date:    string;
  location:     string;
}

const EMPTY_SESSION: SessionFormData = {
  session_name: "",
  start_date:   "",
  end_date:     "",
  eval_date:    "",
  location:     "",
};

/* ------------------------------------------------------------------ */
/*  Formulaire titulaire                                               */
/* ------------------------------------------------------------------ */
interface TitulaireFormData {
  last_name:         string;
  first_name:        string;
  result:            TitulaireResult;
  job_title_before:  string;
  employer_before:   string;
  sector_before:     string;
  status_before:     TitulaireStatusBefore | "";
  job_title_after:   string;
  employer_after:    string;
  follow_up_delay:   TitulaireFollowUp;
  evolution_type:    TitulaireEvolution;
  evolution_details: string;
}

const EMPTY_TITULAIRE: TitulaireFormData = {
  last_name:         "",
  first_name:        "",
  result:            "certifie",
  job_title_before:  "",
  employer_before:   "",
  sector_before:     "",
  status_before:     "",
  job_title_after:   "",
  employer_after:    "",
  follow_up_delay:   "non_renseigne",
  evolution_type:    "non_renseigne",
  evolution_details: "",
};

/* ------------------------------------------------------------------ */
/*  Badge de statut global                                             */
/* ------------------------------------------------------------------ */
function StatusBadge({ sessions }: { sessions: PromotionSession[] }) {
  const validSessions = sessions.filter((s) => s.titulaires.length >= 2);
  const totalCertified = sessions.flatMap((s) => s.titulaires).filter((t) => t.result === "certifie").length;

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,109,0,0.12)", border: "1px solid var(--color-accent-orange)" }}>
        <span style={{ color: "var(--color-accent-orange)" }}>⚠ Aucune promotion documentée</span>
        <span style={{ color: "var(--color-text-secondary)" }} className="ml-2">
          — Le critère 1 bis (décret 2025-500) impose de documenter au moins une promotion avant le dépôt. Vous pouvez continuer la construction du dossier et saisir les données après vos sessions pilotes.
        </span>
      </div>
    );
  }

  if (validSessions.length === 0) {
    return (
      <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,109,0,0.12)", border: "1px solid var(--color-accent-orange)" }}>
        <span style={{ color: "var(--color-accent-orange)" }}>⚠ Session(s) insuffisante(s)</span>
        <span style={{ color: "var(--color-text-secondary)" }} className="ml-2">
          — Une promotion doit comporter au moins 2 candidats évalués pour être recevable par France Compétences.
        </span>
      </div>
    );
  }

  if (validSessions.length === 1) {
    return (
      <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(0,188,212,0.10)", border: "1px solid var(--color-accent-cyan)" }}>
        <span style={{ color: "var(--color-accent-cyan)" }}>ℹ 1 promotion valide — {totalCertified} certifié(s)</span>
        <span style={{ color: "var(--color-text-secondary)" }} className="ml-2">
          — Enregistrement RS limité à 3 ans (1 seule promotion). Ajoutez une 2e session pour viser 5 ans.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(0,230,118,0.10)", border: "1px solid var(--color-accent-green)" }}>
      <span style={{ color: "var(--color-accent-green)" }}>✓ {validSessions.length} promotions valides — {totalCertified} certifié(s) au total</span>
      <span style={{ color: "var(--color-text-secondary)" }} className="ml-2">
        — Enregistrement RS 5 ans possible.
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */
interface Props {
  projectId: string;
}

export default function PromotionsModule({ projectId }: Props) {
  const supabase = createClient();
  const [sessions, setSessions] = useState<PromotionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionForm, setSessionForm] = useState<SessionFormData>(EMPTY_SESSION);
  const [savingSession, setSavingSession] = useState(false);
  const [activeTitulaireForm, setActiveTitulaireForm] = useState<string | null>(null); // sessionId
  const [titulaireForm, setTitulaireForm] = useState<TitulaireFormData>(EMPTY_TITULAIRE);
  const [savingTitulaire, setSavingTitulaire] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  /* --- Chargement --- */
  const loadSessions = useCallback(async () => {
    setLoading(true);
    const { data: rawSessions } = await supabase
      .from("promotions_sessions")
      .select("*")
      .eq("project_id", projectId)
      .order("session_number");

    if (!rawSessions) { setLoading(false); return; }

    const sessionIds = rawSessions.map((s) => s.id);
    const { data: titulaires } = await supabase
      .from("promotions_titulaires")
      .select("*")
      .in("session_id", sessionIds.length > 0 ? sessionIds : [""])
      .order("last_name");

    const enriched: PromotionSession[] = rawSessions.map((s) => ({
      ...s,
      titulaires: (titulaires ?? []).filter((t) => t.session_id === s.id) as PromotionTitulaire[],
    }));

    setSessions(enriched);
    setLoading(false);
  }, [projectId, supabase]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  /* --- Créer une session --- */
  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionForm.session_name.trim()) return;
    setSavingSession(true);

    const nextNumber = sessions.length + 1;
    await supabase.from("promotions_sessions").insert({
      project_id:     projectId,
      session_number: nextNumber,
      session_name:   sessionForm.session_name,
      start_date:     sessionForm.start_date || null,
      end_date:       sessionForm.end_date || null,
      eval_date:      sessionForm.eval_date || null,
      location:       sessionForm.location || null,
    });

    setSessionForm(EMPTY_SESSION);
    setShowSessionForm(false);
    setSavingSession(false);
    await loadSessions();
  }

  /* --- Supprimer une session --- */
  async function handleDeleteSession(sessionId: string) {
    if (!confirm("Supprimer cette session et tous ses titulaires ?")) return;
    await supabase.from("promotions_sessions").delete().eq("id", sessionId);
    await loadSessions();
  }

  /* --- Ajouter un titulaire --- */
  async function handleAddTitulaire(e: React.FormEvent, sessionId: string) {
    e.preventDefault();
    if (!titulaireForm.last_name.trim() || !titulaireForm.first_name.trim()) return;
    setSavingTitulaire(true);

    await supabase.from("promotions_titulaires").insert({
      session_id:        sessionId,
      project_id:        projectId,
      last_name:         titulaireForm.last_name,
      first_name:        titulaireForm.first_name,
      result:            titulaireForm.result,
      job_title_before:  titulaireForm.job_title_before || null,
      employer_before:   titulaireForm.employer_before || null,
      sector_before:     titulaireForm.sector_before || null,
      status_before:     titulaireForm.status_before || null,
      job_title_after:   titulaireForm.job_title_after || null,
      employer_after:    titulaireForm.employer_after || null,
      follow_up_delay:   titulaireForm.follow_up_delay,
      evolution_type:    titulaireForm.evolution_type,
      evolution_details: titulaireForm.evolution_details || null,
    });

    setTitulaireForm(EMPTY_TITULAIRE);
    setActiveTitulaireForm(null);
    setSavingTitulaire(false);
    await loadSessions();
  }

  /* --- Supprimer un titulaire --- */
  async function handleDeleteTitulaire(id: string) {
    if (!confirm("Supprimer ce titulaire ?")) return;
    await supabase.from("promotions_titulaires").delete().eq("id", id);
    await loadSessions();
  }

  /* --- Export CSV --- */
  async function handleExport() {
    setExporting(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/promotions/export?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "promotions-titulaires-FC.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Rendu                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}>

      {/* En-tête collapsible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--color-accent-cyan)", fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
            PROMOTIONS DE TITULAIRES
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(156,39,176,0.2)", color: "var(--color-accent-purple)" }}>
            Critère 1 bis — Décret 2025-500
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {sessions.length} session(s) · {sessions.flatMap((s) => s.titulaires).length} titulaire(s)
          </span>
        </div>
        <span style={{ color: "var(--color-text-muted)" }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="p-5 space-y-5">

          {/* Badge statut */}
          {!loading && <StatusBadge sessions={sessions} />}

          {/* Chargement */}
          {loading && (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Chargement…</p>
          )}

          {/* Liste des sessions */}
          {!loading && sessions.map((session) => (
            <div key={session.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>

              {/* En-tête session */}
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--color-bg-elevated)" }}>
                <div>
                  <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                    Session {session.session_number} — {session.session_name}
                  </span>
                  {session.eval_date && (
                    <span className="ml-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      Évaluation : {new Date(session.eval_date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {session.location && (
                    <span className="ml-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      📍 {session.location}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: session.titulaires.length >= 2 ? "var(--color-accent-green)" : "var(--color-accent-orange)" }}>
                    {session.titulaires.length} candidat(s)
                    {session.titulaires.length < 2 && " ⚠ min. 2"}
                  </span>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ color: "var(--color-error)", border: "1px solid var(--color-error)" }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Table titulaires */}
              {session.titulaires.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "rgba(0,0,0,0.3)", color: "var(--color-text-muted)" }}>
                        <th className="text-left px-3 py-2">Nom</th>
                        <th className="text-left px-3 py-2">Résultat</th>
                        <th className="text-left px-3 py-2">Poste avant</th>
                        <th className="text-left px-3 py-2">Évolution</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.titulaires.map((t) => (
                        <tr key={t.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                          <td className="px-3 py-2" style={{ color: "var(--color-text-primary)" }}>
                            {t.last_name} {t.first_name}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant={
                              t.result === "certifie" ? "default"
                              : t.result === "non_certifie" ? "warning"
                              : "secondary"
                            }>
                              {RESULT_LABELS[t.result]}
                            </Badge>
                          </td>
                          <td className="px-3 py-2" style={{ color: "var(--color-text-secondary)" }}>
                            {t.job_title_before || "—"}
                            {t.employer_before && <span className="block" style={{ color: "var(--color-text-muted)" }}>{t.employer_before}</span>}
                          </td>
                          <td className="px-3 py-2" style={{ color: "var(--color-text-secondary)" }}>
                            {t.evolution_type && t.evolution_type !== "non_renseigne"
                              ? EVOLUTION_LABELS[t.evolution_type]
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => handleDeleteTitulaire(t.id)}
                              style={{ color: "var(--color-text-muted)" }}
                              className="hover:text-red-400 transition-colors"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Formulaire ajout titulaire */}
              {activeTitulaireForm === session.id ? (
                <form onSubmit={(e) => handleAddTitulaire(e, session.id)} className="p-4 space-y-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--color-accent-cyan)" }}>Ajouter un candidat</p>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nom *">
                      <input required className="form-input" value={titulaireForm.last_name}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, last_name: e.target.value }))} />
                    </FormField>
                    <FormField label="Prénom *">
                      <input required className="form-input" value={titulaireForm.first_name}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, first_name: e.target.value }))} />
                    </FormField>
                  </div>

                  <FormField label="Résultat *">
                    <select required className="form-input" value={titulaireForm.result}
                      onChange={(e) => setTitulaireForm((f) => ({ ...f, result: e.target.value as TitulaireResult }))}>
                      {Object.entries(RESULT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </FormField>

                  <p className="text-xs font-semibold pt-2" style={{ color: "var(--color-text-muted)" }}>Situation AVANT la formation</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Intitulé de poste">
                      <input className="form-input" value={titulaireForm.job_title_before}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, job_title_before: e.target.value }))} />
                    </FormField>
                    <FormField label="Employeur">
                      <input className="form-input" value={titulaireForm.employer_before}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, employer_before: e.target.value }))} />
                    </FormField>
                    <FormField label="Secteur">
                      <input className="form-input" value={titulaireForm.sector_before}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, sector_before: e.target.value }))} />
                    </FormField>
                    <FormField label="Statut">
                      <select className="form-input" value={titulaireForm.status_before}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, status_before: e.target.value as TitulaireStatusBefore }))}>
                        <option value="">— Sélectionner —</option>
                        {Object.entries(STATUS_BEFORE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </FormField>
                  </div>

                  <p className="text-xs font-semibold pt-2" style={{ color: "var(--color-text-muted)" }}>Situation APRÈS la certification (suivi)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nouveau poste">
                      <input className="form-input" value={titulaireForm.job_title_after}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, job_title_after: e.target.value }))} />
                    </FormField>
                    <FormField label="Nouvel employeur">
                      <input className="form-input" value={titulaireForm.employer_after}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, employer_after: e.target.value }))} />
                    </FormField>
                    <FormField label="Délai de suivi">
                      <select className="form-input" value={titulaireForm.follow_up_delay}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, follow_up_delay: e.target.value as TitulaireFollowUp }))}>
                        <option value="non_renseigne">Non renseigné</option>
                        <option value="3_mois">3 mois</option>
                        <option value="6_mois">6 mois</option>
                      </select>
                    </FormField>
                    <FormField label="Type d'évolution">
                      <select className="form-input" value={titulaireForm.evolution_type}
                        onChange={(e) => setTitulaireForm((f) => ({ ...f, evolution_type: e.target.value as TitulaireEvolution }))}>
                        {Object.entries(EVOLUTION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Détails de l'évolution">
                    <textarea className="form-input" rows={2} value={titulaireForm.evolution_details}
                      onChange={(e) => setTitulaireForm((f) => ({ ...f, evolution_details: e.target.value }))} />
                  </FormField>

                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => { setActiveTitulaireForm(null); setTitulaireForm(EMPTY_TITULAIRE); }}
                      className="text-xs px-3 py-2 rounded" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                      Annuler
                    </button>
                    <button type="submit" disabled={savingTitulaire} className="btn-primary text-xs">
                      {savingTitulaire ? "Enregistrement…" : "Ajouter ce candidat"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-4 py-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <button
                    onClick={() => { setActiveTitulaireForm(session.id); setTitulaireForm(EMPTY_TITULAIRE); }}
                    className="text-xs px-3 py-1.5 rounded transition-colors"
                    style={{ color: "var(--color-accent-cyan)", border: "1px solid var(--color-accent-cyan)" }}
                  >
                    + Ajouter un candidat
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Formulaire nouvelle session */}
          {showSessionForm ? (
            <form onSubmit={handleCreateSession} className="rounded-lg p-4 space-y-4" style={{ border: "1px dashed var(--color-border-glow)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--color-accent-purple)" }}>Nouvelle session de formation</p>
              <FormField label="Nom de la session *">
                <input required className="form-input" placeholder="Ex : Session pilote 1 — juin 2025"
                  value={sessionForm.session_name}
                  onChange={(e) => setSessionForm((f) => ({ ...f, session_name: e.target.value }))} />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Début formation">
                  <input type="date" className="form-input" value={sessionForm.start_date}
                    onChange={(e) => setSessionForm((f) => ({ ...f, start_date: e.target.value }))} />
                </FormField>
                <FormField label="Fin formation">
                  <input type="date" className="form-input" value={sessionForm.end_date}
                    onChange={(e) => setSessionForm((f) => ({ ...f, end_date: e.target.value }))} />
                </FormField>
                <FormField label="Date d'évaluation">
                  <input type="date" className="form-input" value={sessionForm.eval_date}
                    onChange={(e) => setSessionForm((f) => ({ ...f, eval_date: e.target.value }))} />
                </FormField>
              </div>
              <FormField label="Lieu">
                <input className="form-input" placeholder="Ex : La Réunion / Distanciel"
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm((f) => ({ ...f, location: e.target.value }))} />
              </FormField>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowSessionForm(false); setSessionForm(EMPTY_SESSION); }}
                  className="text-xs px-3 py-2 rounded" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={savingSession} className="btn-primary text-xs">
                  {savingSession ? "Création…" : "Créer la session"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setShowSessionForm(true)}
                className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ color: "var(--color-accent-purple)", border: "1px solid var(--color-accent-purple)" }}
              >
                + Ajouter une session
              </button>
              {sessions.length > 0 && (
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="text-xs px-3 py-2 rounded"
                  style={{ color: "var(--color-accent-green)", border: "1px solid var(--color-accent-green)" }}
                >
                  {exporting ? "Export…" : "⬇ Exporter le tableur FC (.csv)"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper FormField                                                    */
/* ------------------------------------------------------------------ */
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}
