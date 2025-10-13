/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./App.tsx",
    "./main.tsx",
    "./{components,imports,public,services,styles,supabase,types,utils}/**/*.{js,ts,jsx,tsx,html}",
  ],
  // ⬇️ add this block temporarily
  safelist: [{ pattern: /.*/ }],
  theme: { extend: {} },
  plugins: [],
  
  theme: {
    extend: {
      colors: {
        // shadcn semantic colors (via CSS vars)
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        // 🎨 MaverickAI brand (via CSS vars you already use)
        navy: "var(--color-navy)",
        "deep-blue": "var(--color-deep-blue)",
        cyan: "var(--color-cyan)",
        teal: "var(--color-teal)",
        purple: "var(--color-purple)",
        gold: "var(--color-gold)",
        pink: "var(--color-pink)",

        // Glass tints
        glass: "var(--color-glass)",
        "glass-subtle": "var(--color-glass-subtle)",
        "glass-strong": "var(--color-glass-strong)",
        "glass-intense": "var(--color-glass-intense)",

        // Semantic
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",

        // Borders
        "border-subtle": "var(--color-border-subtle)",
        "border-strong": "var(--color-border-strong)",
        "border-cyan": "var(--color-border-cyan)",
        "border-purple": "var(--color-border-purple)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      backdropBlur: {
        xs: "2px",
      },

      /* 🟣 Added: shadows + animations used by the glow/radar UI */
      boxShadow: {
        glass: "0 10px 40px rgba(16,24,40,.35)",
        glow: "0 0 40px rgba(56,189,248,.45), 0 0 80px rgba(99,102,241,.35)",
        soft: "0 8px 30px rgba(0,0,0,.25)",
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "radar-sweep": "radar 2.6s linear infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: 0.85 },
          "50%": { opacity: 1 },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  /* 🟣 Added: helpful animation utilities */
  plugins: [require("tailwindcss-animate")],
};
