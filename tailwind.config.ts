import type { Config } from "tailwindcss";

/**
 * Design tokens are defined as CSS custom properties in src/styles/globals.css
 * and referenced here, so runtime theme switching (dark/light) never requires
 * re-rendering React — only the `.dark` / `.light` class on <html> changes,
 * and every color updates via the cascade.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(var(--bg))",
          surface: "hsl(var(--bg-surface))",
          "surface-hover": "hsl(var(--bg-surface-hover))",
          elevated: "hsl(var(--bg-elevated))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "hsl(var(--border-subtle))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          muted: "hsl(var(--primary-muted))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          muted: "hsl(var(--success-muted))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          muted: "hsl(var(--error-muted))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          muted: "hsl(var(--warning-muted))",
        },
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        display: ["Geist", "Inter var", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h1: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 hsl(var(--shadow-color) / 0.06)",
        card: "0 1px 3px 0 hsl(var(--shadow-color) / 0.08), 0 1px 2px -1px hsl(var(--shadow-color) / 0.08)",
        elevated: "0 4px 16px -4px hsl(var(--shadow-color) / 0.16), 0 2px 6px -2px hsl(var(--shadow-color) / 0.1)",
        popover: "0 8px 30px -6px hsl(var(--shadow-color) / 0.24)",
      },
      spacing: {
        18: "4.5rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "fade-in-up": "fade-in-up 250ms ease-out",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
