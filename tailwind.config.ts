import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ninja-dark": "#0f0c29",
        "ninja-mid": "#302b63",
        "ninja-gold": "#f59e0b",
        "ninja-text": "#f3f4f6",
      },
    },
  },
  plugins: [],
};

export default config;
