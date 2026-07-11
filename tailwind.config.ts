import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-pink": "#e2107b",
        "brand-indigo": "#3c47d8",
        ink: "#0a0616",
        surface: "#f7f7f9",
        surface2: "#f6f3ff",
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
    },
  },
  plugins: [],
};

export default config;
