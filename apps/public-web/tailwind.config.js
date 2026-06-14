/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "#111118",
        'border-color': "#1e1e2e",
        primary: "#6366f1",
        secondary: "#a855f7",
        'text-primary': "#ffffff",
        'text-secondary': "#94a3b8",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
};
