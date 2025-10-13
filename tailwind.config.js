/** @type {import('tailwindcss').Config} */
// Build: 2025-10-13 - Clean config, no motion imports
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./App.tsx",
    "./main.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./types/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Shadcn semantic colors - using CSS variables directly
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

        // 🎨 MAVERICK AI BRAND COLORS
        navy: "var(--color-navy)",
        "deep-blue": "var(--color-deep-blue)",
        cyan: "var(--color-cyan)",
        teal: "var(--color-teal)",
        purple: "var(--color-purple)",
        gold: "var(--color-gold)",
        pink: "var(--color-pink)",

        // Glass effects
        glass: "var(--color-glass)",
        "glass-subtle": "var(--color-glass-subtle)",
        "glass-strong": "var(--color-glass-strong)",
        "glass-intense": "var(--color-glass-intense)",

        // Semantic colors
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",

        // Border utilities
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
        xs: '2px',
      },
    },
  },
  plugins: [
    // Explicitly empty - no motion or animation plugins
  ],
  corePlugins: {
    // Ensure we're not loading any problematic plugins
  },
};
