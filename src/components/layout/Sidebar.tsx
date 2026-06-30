"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, FolderOpen, LogOut, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="w-60 flex flex-col h-screen sticky top-0 flex-shrink-0"
      style={{ background: "var(--color-bg-secondary)", borderRight: "1px solid var(--color-border)" }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--gradient-neotechno)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-gradient leading-tight">RS-Builder</p>
            <p className="text-xs leading-tight" style={{ color: "var(--color-text-muted)" }}>NéoTechno Formation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "text-accent-cyan bg-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-secondary"
              )}
              style={isActive ? { boxShadow: "inset 0 0 0 1px rgba(0,188,212,0.25)" } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Séparateur */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Ressources
          </p>
        </div>

        <a
          href="https://www.francecompetences.fr/repertoire-specifique/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-text-secondary hover:text-text-primary hover:bg-secondary"
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          France Compétences RS
        </a>

        <a
          href="https://certifpro.francecompetences.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-text-secondary hover:text-text-primary hover:bg-secondary"
        >
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          CERTIF PRO (dépôt)
        </a>
      </nav>

      {/* Déconnexion */}
      <div className="p-3 border-t" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-text-muted hover:text-error hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
