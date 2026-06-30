#!/bin/bash
# ============================================================
# RS-Builder — Lanceur rapide (développement local)
# Double-cliquez sur ce fichier ou exécutez : bash lancer-rs-builder.sh
# ============================================================

# Couleurs terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Reset

clear
echo -e "${CYAN}"
echo "  ██████╗ ███████╗      ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗ "
echo "  ██╔══██╗██╔════╝      ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗"
echo "  ██████╔╝███████╗█████╗██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝"
echo "  ██╔══██╗╚════██║╚════╝██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗"
echo "  ██║  ██║███████║      ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║"
echo "  ╚═╝  ╚═╝╚══════╝      ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${GREEN}  by NéoTechno Formation — David PAYET${NC}"
echo ""

# Vérifie que .env.local existe
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  Fichier .env.local manquant !${NC}"
  echo ""
  echo "  Créez un fichier .env.local à la racine du projet avec :"
  echo "  NEXT_PUBLIC_SUPABASE_URL=..."
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
  echo "  SUPABASE_SERVICE_ROLE_KEY=..."
  echo "  ANTHROPIC_API_KEY=..."
  echo ""
  echo "  (Copiez .env.example et remplissez vos valeurs)"
  exit 1
fi

echo -e "  ${GREEN}✓${NC} Variables d'environnement trouvées"
echo -e "  ${GREEN}✓${NC} Démarrage du serveur de développement…"
echo ""
echo -e "  ${CYAN}→ Application disponible sur : http://localhost:3000${NC}"
echo ""
echo "  Appuyez sur Ctrl+C pour arrêter le serveur."
echo "  ─────────────────────────────────────────────────────"
echo ""

# Ouvre le navigateur après 3 secondes (macOS / Linux)
(sleep 3 && open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) &

# Lance le serveur Next.js
npm run dev
