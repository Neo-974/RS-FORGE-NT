"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError("Impossible de créer le compte. " + error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card-glass p-8">
      <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--color-text-primary)" }}>
        Créer un compte
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label" htmlFor="fullName">Nom complet</label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
            placeholder="David PAYET"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="david@neotechno.re"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="8 caractères minimum"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Création en cours…
            </>
          ) : (
            "Créer mon compte"
          )}
        </Button>
      </form>

      <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium" style={{ color: "var(--color-accent-cyan)" }}>
          Se connecter
        </Link>
      </p>
    </div>
  );
}
