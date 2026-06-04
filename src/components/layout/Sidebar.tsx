"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "⊞" },
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
      className="w-64 flex flex-col h-screen sticky top-0"
      style={{ background: "var(--color-bg-secondary)", borderRight: "1px solid var(--color-border)" }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--gradient-neotechno)" }}
          >
            <span className="text-white font-bold font-display text-sm">RS</span>
          </div>
          <div>
            <p className="font-display font-bold text-sm text-gradient">RS-Builder</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>NéoTechno Formation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: isActive ? "var(--color-accent-cyan)" : "var(--color-text-secondary)",
                background: isActive ? "rgba(0, 188, 212, 0.1)" : "transparent",
                boxShadow: isActive ? "var(--glow-cyan)" : "none",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span>⎋</span>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
