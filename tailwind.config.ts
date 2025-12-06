import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
          light: "#3B82F6",
        },
        secondary: {
          DEFAULT: "#06B6D4",
          dark: "#0E7490",
          light: "#67E8F9",
        },
        accent: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
        },
        background: "#F4F7FA",
        surface: "#FFFFFF",
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
        },
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(2,6,23,0.06)",
        md: "0 2px 10px rgba(2,6,23,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
