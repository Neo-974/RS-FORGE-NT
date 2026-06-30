import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          card:      "var(--color-bg-card)",
          elevated:  "var(--color-bg-elevated)",
        },
        accent: {
          green:  "var(--color-accent-green)",
          cyan:   "var(--color-accent-cyan)",
          purple: "var(--color-accent-purple)",
          orange: "var(--color-accent-orange)",
          pink:   "var(--color-accent-pink)",
        },
        text: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted:     "var(--color-text-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          glow:    "var(--color-border-glow)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error:   "var(--color-error)",
        info:    "var(--color-info)",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body:    ["Exo 2", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-green":  "0 0 20px rgba(0, 230, 118, 0.3)",
        "glow-cyan":   "0 0 20px rgba(0, 188, 212, 0.3)",
        "glow-purple": "0 0 20px rgba(156, 39, 176, 0.3)",
        "glow-green-lg": "0 0 30px rgba(0, 230, 118, 0.5)",
      },
      backgroundImage: {
        "gradient-neotechno": "linear-gradient(135deg, #00E676 0%, #00BCD4 25%, #9C27B0 60%, #FF6D00 100%)",
        "gradient-text":      "linear-gradient(90deg, #00E676, #00BCD4, #9C27B0)",
        "gradient-bg":        "linear-gradient(180deg, #1A1025 0%, #120D1E 100%)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
