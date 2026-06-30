import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vérifie que les variables d'env critiques sont présentes au build */
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
};

export default nextConfig;
