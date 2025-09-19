import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic surfaces
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",

        // Brand colors
        primary: {
          DEFAULT: "var(--color-primary)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
        },
        "on-primary": "var(--color-on-primary)",

        // State colors
        danger: "var(--color-danger)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
      },

      borderRadius: {
        sm: "var(--rd-sm)",
        lg: "var(--rd-lg)",
        xl: "var(--rd-lg)",
        "2xl": "calc(var(--rd-lg) + 6px)",
      },

      fontFamily: {
        sans: ["var(--font-family)"],
      },

      fontSize: {
        xs: "var(--fs-xs)",
        sm: "var(--fs-sm)",
        base: "var(--fs-md)",
        lg: "var(--fs-lg)",
        xl: "var(--fs-xl)",
      },

      spacing: {
        1: "var(--sp-1)",
        2: "var(--sp-2)",
        3: "var(--sp-3)",
        4: "var(--sp-4)",
        6: "var(--sp-6)",
      },

      height: {
        'input-sm': "var(--h-input-sm)",
        'input-md': "var(--h-input-md)",
        'input-lg': "var(--h-input-lg)",
      }
    },
  },
  plugins: [],
};

export default config;