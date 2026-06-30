"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card-glass p-8">
      <h2 className="font-display text-xl font-semibold mb-6" style={{ color: "var(--color-text-primary)" }}>
        Connexion
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label" htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-field ${error ? "error" : ""}`}
            placeholder="david@neotechno.re"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`input-field ${error ? "error" : ""}`}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connexion en cours…
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>

      <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium" style={{ color: "var(--color-accent-cyan)" }}>
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
