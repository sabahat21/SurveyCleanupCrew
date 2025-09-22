/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colour values from index.css
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",
        "primary-lighter": "var(--primary-lighter)",

        // Secondary colour values (The Saffron/Gold Colors section in index.css)
        secondary: "var(--secondary)",
        "secondary-dark": "var(--secondary-dark)",
        "secondary-light": "var(--secondary-light)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",

        // Survey Layout colours
        "survey-bg": "var(--survey-bg)",

        // Header colors
        "header-bg": "var(--header-bg)",
        "header-primary": "var(--header-primary)",
        "header-subtitle": "var(--header-subtitle)",
        "header-accent": "var(--header-accent)",

        // Header button colours
        "btn-active-text": "var(--btn-active-text)",
        "btn-inactive-text": "var(--btn-inactive-text)",

        // Sidebar colours
        "progress-text": "var(--progress-text)",
        "progress-number": "var(--progress-number)",
        "progress-bar-from": "var(--progress-bar-from)",
        "progress-bar-to": "var(--progress-bar-to)",
        "levelquestion-active-bg": "var(--levelquestion-active-bg)",
        "levelquestion-active-border": "var(--levelquestion-active-border)",
      },

      fontFamily: {
        samarkan: ['"Samarkan Normal V2"', "cursive"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        devanagari: [
          "Noto Sans Devanagari",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
